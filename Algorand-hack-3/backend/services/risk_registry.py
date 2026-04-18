from __future__ import annotations

import base64
import os
import struct
from dataclasses import dataclass
from typing import Any, Dict, Optional

from algosdk import account, mnemonic
from algosdk.abi import Method
from algosdk.atomic_transaction_composer import (
    AtomicTransactionComposer,
    AccountTransactionSigner,
    TransactionWithSigner,
)
from algosdk.encoding import decode_address, is_valid_address
from algosdk.transaction import ApplicationNoOpTxn
from algosdk.v2client.algod import AlgodClient


@dataclass(frozen=True)
class RiskRegistryEntry:
    exists: bool
    score: int
    updated_at: int


def _get_env_int(name: str) -> Optional[int]:
    v = os.getenv(name)
    if not v:
        return None
    try:
        return int(v)
    except ValueError:
        return None


def _algod_from_env() -> AlgodClient:
    algod_address = os.getenv("ALGOD_ADDRESS", "").strip()
    algod_token = os.getenv("ALGOD_TOKEN", "").strip()
    if not algod_address:
        raise RuntimeError("ALGOD_ADDRESS is not set")
    return AlgodClient(algod_token, algod_address)


def _app_id_from_env() -> int:
    app_id = _get_env_int("RISK_REGISTRY_APP_ID")
    if not app_id:
        raise RuntimeError("RISK_REGISTRY_APP_ID is not set")
    return app_id


def _creator_signer_from_env() -> AccountTransactionSigner:
    creator_mn = os.getenv("CREATOR_MNEMONIC", "").strip()
    if not creator_mn:
        raise RuntimeError("CREATOR_MNEMONIC is not set")
    sk = mnemonic.to_private_key(creator_mn)
    return AccountTransactionSigner(sk)


def _creator_address_from_signer(signer: AccountTransactionSigner) -> str:
    return account.address_from_private_key(signer.private_key)


def _box_key_from_address(addr: str) -> bytes:
    if not is_valid_address(addr):
        raise ValueError("Invalid Algorand address (expected 58-char base32 address)")
    return decode_address(addr)  # 32 bytes


def _parse_box_value(value: bytes) -> RiskRegistryEntry:
    # value is 16 bytes: uint64 score, uint64 updated_at
    if len(value) != 16:
        raise ValueError(f"Unexpected box length: {len(value)}")
    score, updated_at = struct.unpack(">QQ", value)
    return RiskRegistryEntry(exists=True, score=int(score), updated_at=int(updated_at))


def get_entry(wallet_address: str) -> RiskRegistryEntry:
    """
    Read the on-chain risk entry for a wallet (by box lookup).
    Returns exists=False if box doesn't exist.
    """
    client = _algod_from_env()
    app_id = _app_id_from_env()
    key = _box_key_from_address(wallet_address)

    try:
        box = client.application_box_by_name(app_id, key)
    except Exception:
        # If the box doesn't exist, algod returns 404.
        return RiskRegistryEntry(exists=False, score=0, updated_at=0)

    raw_value = base64.b64decode(box["value"])
    return _parse_box_value(raw_value)


def set_entry(wallet_address: str, score: int) -> Dict[str, Any]:
    """
    Creator-only: writes/updates box entry on-chain via ARC-4 ABI method call.
    """
    client = _algod_from_env()
    app_id = _app_id_from_env()
    signer = _creator_signer_from_env()
    sender = _creator_address_from_signer(signer)

    method = Method.from_signature("set_risk(byte[],uint64)void")
    pk = _box_key_from_address(wallet_address)

    sender_info = client.account_info(sender)
    sender_balance = int(sender_info.get("amount", 0))
    if sender_balance < 200_000:
        raise RuntimeError(
            f"Creator account not funded on TestNet (addr={sender}, balance_microalgos={sender_balance}). "
            "Fund this address with the TestNet dispenser or update CREATOR_MNEMONIC."
        )

    sp = client.suggested_params()

    atc = AtomicTransactionComposer()
    atc.add_method_call(
        app_id=app_id,
        method=method,
        sender=sender,
        sp=sp,
        signer=signer,
        method_args=[pk, int(score)],
        boxes=[(app_id, pk)],  # allow box write
    )

    result = atc.execute(client, 2)
    return {
        "tx_id": result.tx_ids[0] if result.tx_ids else None,
        "confirmed_round": result.confirmed_round,
        "app_id": app_id,
    }


def as_dict(entry: RiskRegistryEntry) -> Dict[str, Any]:
    return {
        "exists": entry.exists,
        "score": entry.score,
        "updated_at": entry.updated_at,
    }


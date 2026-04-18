"""
Call RiskRegistry ABI methods on Algorand TestNet (set_risk → get_risk).

Loads env from backend/.env:
  ALGOD_ADDRESS, ALGOD_TOKEN (optional), CREATOR_MNEMONIC, RISK_REGISTRY_APP_ID

Usage (from repo root):
  python contracts/interact_abi.py
  python contracts/interact_abi.py --address RKP6SEO... --score 85
  python contracts/interact_abi.py --get-only   # only get_risk (no write)
"""
from __future__ import annotations

import argparse
import base64
import os
import sys
from pathlib import Path

from algosdk import account, mnemonic
from algosdk.abi import Method
from algosdk.atomic_transaction_composer import AccountTransactionSigner, AtomicTransactionComposer
from algosdk.encoding import decode_address
from algosdk.logic import get_application_address
from algosdk.transaction import PaymentTxn, wait_for_confirmation
from algosdk.v2client.algod import AlgodClient
from dotenv import load_dotenv

# Box creation charges the *application escrow* min balance; fund it before first set_risk.
MIN_APP_MICROALGOS = 1_000_000  # 1 ALGO headroom on TestNet

ROOT = Path(__file__).resolve().parent
BACKEND_ENV = ROOT.parent / "backend" / ".env"


def _ensure_app_escrow_funded(
    client: AlgodClient, creator_sk: bytes, creator_addr: str, app_id: int
) -> None:
    app_addr = get_application_address(app_id)
    info = client.account_info(app_addr)
    bal = int(info.get("amount", 0))
    print("App escrow:", app_addr)
    print("App escrow balance (microAlgos):", bal)
    if bal >= MIN_APP_MICROALGOS:
        return
    top_up = MIN_APP_MICROALGOS - bal + 100_000
    sp = client.suggested_params()
    pay = PaymentTxn(sender=creator_addr, sp=sp, receiver=app_addr, amt=top_up)
    signed = pay.sign(creator_sk)
    txid = client.send_transaction(signed)
    print(f"Funding app escrow: sent {top_up} microAlgos, txid={txid}")
    wait_for_confirmation(client, txid, 4)


def _load_env() -> None:
    load_dotenv(BACKEND_ENV, override=False)
    load_dotenv(ROOT / ".env", override=True)


def main() -> None:
    _load_env()

    parser = argparse.ArgumentParser(description="Interact with RiskRegistry via ABI")
    parser.add_argument(
        "--address",
        default=os.getenv("TARGET_WALLET_ADDRESS", "RKP6SEOFZ42CX2JZDUOPK732QFEXLLTCFVPWTCHDLM3AEQJ6CFSTST2D4Q"),
        help="58-char Algorand address whose risk box to read/write",
    )
    parser.add_argument("--score", type=int, default=int(os.getenv("RISK_SCORE", "85")), help="uint64 score for set_risk")
    parser.add_argument("--get-only", action="store_true", help="Only call get_risk (no set_risk)")
    args = parser.parse_args()

    algod_address = os.getenv("ALGOD_ADDRESS", "").strip()
    algod_token = os.getenv("ALGOD_TOKEN", "").strip()
    app_id_str = os.getenv("RISK_REGISTRY_APP_ID", "").strip()
    creator_mn = os.getenv("CREATOR_MNEMONIC", "").strip()

    if not algod_address:
        print("Missing ALGOD_ADDRESS in backend/.env", file=sys.stderr)
        sys.exit(1)
    if not app_id_str:
        print("Missing RISK_REGISTRY_APP_ID in backend/.env", file=sys.stderr)
        sys.exit(1)
    if not creator_mn:
        print("Missing CREATOR_MNEMONIC in backend/.env", file=sys.stderr)
        sys.exit(1)

    app_id = int(app_id_str)
    pk = decode_address(args.address)
    print("address_pk length (must be 32):", len(pk))
    print("address_pk HEX:", pk.hex())
    print("address_pk BASE64:", base64.b64encode(pk).decode())

    client = AlgodClient(algod_token, algod_address)
    sp = client.suggested_params()

    sk = mnemonic.to_private_key(creator_mn)
    sender = account.address_from_private_key(sk)
    signer = AccountTransactionSigner(sk)

    print("Sender (creator):", sender)
    print("App ID:", app_id)

    boxes = [(app_id, pk)]

    if not args.get_only:
        _ensure_app_escrow_funded(client, sk, sender, app_id)
        sp = client.suggested_params()
        set_method = Method.from_signature("set_risk(byte[],uint64)void")
        atc_set = AtomicTransactionComposer()
        atc_set.add_method_call(
            app_id=app_id,
            method=set_method,
            sender=sender,
            sp=sp,
            signer=signer,
            method_args=[pk, int(args.score)],
            boxes=boxes,
        )
        result_set = atc_set.execute(client, 2)
        print("set_risk tx_id:", result_set.tx_ids[0] if result_set.tx_ids else None)

    get_method = Method.from_signature("get_risk(byte[])(bool,uint64,uint64)")
    sp2 = client.suggested_params()
    atc_get = AtomicTransactionComposer()
    atc_get.add_method_call(
        app_id=app_id,
        method=get_method,
        sender=sender,
        sp=sp2,
        signer=signer,
        method_args=[pk],
        boxes=boxes,
    )
    result_get = atc_get.execute(client, 2)
    print("get_risk tx_id:", result_get.tx_ids[0] if result_get.tx_ids else None)
    if result_get.abi_results:
        print("get_risk return:", result_get.abi_results[0].return_value)
    else:
        print("get_risk: no abi_results (check transaction in explorer)")


if __name__ == "__main__":
    main()

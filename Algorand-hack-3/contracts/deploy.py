from __future__ import annotations

import base64
import os
from pathlib import Path

from algosdk import account, mnemonic
from algosdk.v2client import algod
from algosdk.transaction import wait_for_confirmation
from algosdk.transaction import ApplicationCreateTxn, OnComplete, StateSchema
from dotenv import load_dotenv


ROOT = Path(__file__).resolve().parent
ARTIFACTS_DIR = ROOT / "artifacts"
BACKEND_ENV = ROOT.parent / "backend" / ".env"


def _require(name: str) -> str:
    v = os.getenv(name)
    if not v:
        raise RuntimeError(f"Missing required env var: {name}")
    return v


def main() -> None:
    # Prefer backend/.env (single source of truth), allow contracts/.env to override.
    load_dotenv(BACKEND_ENV, override=False)
    load_dotenv(ROOT / ".env", override=True)

    algod_address = _require("ALGOD_ADDRESS")
    algod_token = os.getenv("ALGOD_TOKEN", "")
    creator_mn = _require("CREATOR_MNEMONIC")

    creator_sk = mnemonic.to_private_key(creator_mn)
    creator_addr = account.address_from_private_key(creator_sk)

    approval = (ARTIFACTS_DIR / "approval.teal").read_text(encoding="utf-8")
    clear = (ARTIFACTS_DIR / "clear.teal").read_text(encoding="utf-8")

    client = algod.AlgodClient(algod_token, algod_address)

    creator_info = client.account_info(creator_addr)
    creator_balance = int(creator_info.get("amount", 0))
    print(f"Creator address: {creator_addr}")
    print(f"Creator balance (microAlgos): {creator_balance}")

    # App create needs a fee and (potentially) min balance changes; require some buffer.
    if creator_balance < 200_000:
        raise RuntimeError(
            "Creator account is not funded on TestNet. "
            "Fund this address using the Algorand TestNet dispenser, then re-run deploy."
        )

    approval_compiled_b64 = client.compile(approval)["result"]
    clear_compiled_b64 = client.compile(clear)["result"]

    approval_program = base64.b64decode(approval_compiled_b64)
    clear_program = base64.b64decode(clear_compiled_b64)

    sp = client.suggested_params()

    # This app uses only boxes; no global/local state required.
    txn = ApplicationCreateTxn(
        sender=creator_addr,
        sp=sp,
        on_complete=OnComplete.NoOpOC,
        approval_program=approval_program,
        clear_program=clear_program,
        global_schema=StateSchema(0, 0),
        local_schema=StateSchema(0, 0),
    )

    signed = txn.sign(creator_sk)
    txid = client.send_transaction(signed)
    print(f"Sent app create tx: {txid}")

    result = wait_for_confirmation(client, txid, 10)
    app_id = result.get("application-index") or result.get("application-index".encode("utf-8"))
    print(f"Deployed app_id: {app_id}")
    print(f"Creator: {creator_addr}")


if __name__ == "__main__":
    main()


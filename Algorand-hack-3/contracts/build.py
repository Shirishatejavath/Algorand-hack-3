import base64
import json
import os
from pathlib import Path

from algosdk.v2client.algod import AlgodClient
from dotenv import load_dotenv
from pyteal import *

from risk_registry import build_router

ROOT = Path(__file__).resolve().parent
ARTIFACTS_DIR = ROOT / "artifacts"
BACKEND_ENV = ROOT.parent / "backend" / ".env"


def _algod_client() -> AlgodClient:
    load_dotenv(BACKEND_ENV, override=False)
    load_dotenv(ROOT / ".env", override=True)
    addr = os.getenv("ALGOD_ADDRESS", "https://testnet-api.algonode.cloud").strip()
    token = os.getenv("ALGOD_TOKEN", "").strip()
    return AlgodClient(token, addr)


def _build_arc32(
    contract_dict: dict,
    approval_teal: str,
    clear_teal: str,
    client: AlgodClient,
) -> dict:
    approval_b64 = client.compile(approval_teal)["result"]
    clear_b64 = client.compile(clear_teal)["result"]

    # Decode once to verify programs are valid base64 TEAL bytecode
    base64.b64decode(approval_b64)
    base64.b64decode(clear_b64)

    app_id = os.getenv("RISK_REGISTRY_APP_ID", "").strip()
    networks: dict = {}
    if app_id.isdigit():
        aid = int(app_id)
        networks = {
            "SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=": {"appId": aid},
            "testnet-v1.0": {"appId": aid},
        }

    contract_block = {**contract_dict, "networks": networks or contract_dict.get("networks", {})}

    versions = client.versions()
    ci = versions.get("versions", {}) if isinstance(versions, dict) else {}
    major, minor, patch = 4, 6, 0
    commit_hash = "unknown"
    try:
        vstr = str(ci.get("Version", "4.6.0"))
        commit_hash = str(ci.get("LastCommitHash", "unknown"))[:20]
        segs = vstr.replace("v", "").split(".")[:3]
        if len(segs) >= 1 and segs[0].isdigit():
            major = int(segs[0])
        if len(segs) >= 2 and segs[1].isdigit():
            minor = int(segs[1])
        if len(segs) >= 3 and segs[2].split("-")[0].isdigit():
            patch = int(segs[2].split("-")[0])
    except Exception:
        pass

    return {
        "schema": {
            "global": {"ints": 0, "bytes": 0},
            "local": {"ints": 0, "bytes": 0},
        },
        "contract": contract_block,
        "bareActions": {
            "create": ["NoOp"],
            "call": ["NoOp", "OptIn", "CloseOut"],
        },
        "byteCode": {
            "approval": approval_b64,
            "clear": clear_b64,
        },
        "compilerInfo": {
            "compiler": "algod",
            "compilerVersion": {
                "major": major,
                "minor": minor,
                "patch": patch,
                "commitHash": commit_hash,
            },
        },
    }


def main() -> None:
    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)

    router = build_router()
    approval, clear, contract = router.compile_program(version=8)

    (ARTIFACTS_DIR / "approval.teal").write_text(approval, encoding="utf-8")
    (ARTIFACTS_DIR / "clear.teal").write_text(clear, encoding="utf-8")

    client = _algod_client()
    arc32 = _build_arc32(contract.dictify(), approval, clear, client)

    out_path = ARTIFACTS_DIR / "RiskRegistry.arc32.json"
    out_path.write_text(json.dumps(arc32, indent=2, sort_keys=True), encoding="utf-8")

    # Single app spec: remove legacy duplicates if present
    for stale in ("contract.json", "RiskRegistry.arc56.json"):
        p = ARTIFACTS_DIR / stale
        if p.exists():
            p.unlink()

    print(f"Wrote {ARTIFACTS_DIR / 'approval.teal'}")
    print(f"Wrote {ARTIFACTS_DIR / 'clear.teal'}")
    print(f"Wrote {out_path}")


if __name__ == "__main__":
    main()

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


def _testnet_networks_arc32(app_id: int | None) -> dict:
    if app_id is None:
        return {}
    return {
        "SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=": {"appId": app_id},
        "testnet-v1.0": {"appId": app_id},
    }


def _testnet_networks_arc56(app_id: int | None) -> dict:
    """ARC-56 uses camelCase appID in network entries."""
    if app_id is None:
        return {}
    return {
        "SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=": {"appID": app_id},
        "testnet-v1.0": {"appID": app_id},
    }


def _compiler_info(client: AlgodClient) -> dict:
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
        "compiler": "algod",
        "compilerVersion": {
            "major": major,
            "minor": minor,
            "patch": patch,
            "commitHash": commit_hash,
        },
    }


def _resolved_app_id() -> int | None:
    app_id = os.getenv("RISK_REGISTRY_APP_ID", "").strip()
    return int(app_id) if app_id.isdigit() else None


def _build_arc32(
    contract_dict: dict,
    approval_b64: str,
    clear_b64: str,
    client: AlgodClient,
) -> dict:
    base64.b64decode(approval_b64)
    base64.b64decode(clear_b64)

    aid = _resolved_app_id()
    networks = _testnet_networks_arc32(aid) if aid is not None else (contract_dict.get("networks") or {})
    contract_block = {**contract_dict, "networks": networks}

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
        "compilerInfo": _compiler_info(client),
    }


def _build_arc56(
    contract_dict: dict,
    approval_b64: str,
    clear_b64: str,
    client: AlgodClient,
) -> dict:
    """ARC-56 combined spec (Lora / newer clients). Same bytecode + methods as ARC-32."""
    aid = _resolved_app_id()
    networks = _testnet_networks_arc56(aid) if aid is not None else {}

    return {
        "arcs": [4, 22, 28, 56],
        "name": contract_dict.get("name", "RiskRegistry"),
        "desc": "On-chain risk registry with boxes keyed by each wallet's 32-byte public key (Algorand address preimage).",
        "networks": networks,
        "structs": {},
        "methods": contract_dict.get("methods", []),
        "state": {
            "schema": {
                "global": {"ints": 0, "bytes": 0},
                "local": {"ints": 0, "bytes": 0},
            },
            "keys": {"global": {}, "local": {}, "box": {}},
            "maps": {"global": {}, "local": {}, "box": {}},
        },
        "bareActions": {
            "create": ["NoOp"],
            "call": ["NoOp", "OptIn", "CloseOut"],
        },
        "byteCode": {
            "approval": approval_b64,
            "clear": clear_b64,
        },
        "compilerInfo": _compiler_info(client),
    }


def main() -> None:
    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)

    router = build_router()
    approval, clear, contract = router.compile_program(version=8)

    (ARTIFACTS_DIR / "approval.teal").write_text(approval, encoding="utf-8")
    (ARTIFACTS_DIR / "clear.teal").write_text(clear, encoding="utf-8")

    client = _algod_client()
    approval_b64 = client.compile(approval)["result"]
    clear_b64 = client.compile(clear)["result"]

    cdict = contract.dictify()
    arc32 = _build_arc32(cdict, approval_b64, clear_b64, client)
    arc56 = _build_arc56(cdict, approval_b64, clear_b64, client)

    path32 = ARTIFACTS_DIR / "RiskRegistry.arc32.json"
    path56 = ARTIFACTS_DIR / "RiskRegistry.arc56.json"
    path32.write_text(json.dumps(arc32, indent=2, sort_keys=True), encoding="utf-8")
    path56.write_text(json.dumps(arc56, indent=2, sort_keys=True), encoding="utf-8")

    # Legacy minimal ARC-4-only file — not needed if you use ARC-32/56 in Lora
    stale = ARTIFACTS_DIR / "contract.json"
    if stale.exists():
        stale.unlink()

    print(f"Wrote {ARTIFACTS_DIR / 'approval.teal'}")
    print(f"Wrote {ARTIFACTS_DIR / 'clear.teal'}")
    print(f"Wrote {path32}")
    print(f"Wrote {path56}")


if __name__ == "__main__":
    main()

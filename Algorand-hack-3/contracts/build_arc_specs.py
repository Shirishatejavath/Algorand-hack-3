"""
Build ARC-56 (and a minimal ARC-32-style) app spec JSON for RiskRegistry.

Reads:
  - contracts/artifacts/contract.json  (ARC-4 methods from PyTeal Router)
  - contracts/artifacts/approval.teal / clear.teal (source; compiled via Algod)

Env (optional; defaults to public TestNet AlgoNode):
  ALGOD_ADDRESS, ALGOD_TOKEN

Optional:
  RISK_REGISTRY_APP_ID — embedded under networks[TestNet genesis hash]

Output:
  - contracts/artifacts/RiskRegistry.arc56.json
  - contracts/artifacts/RiskRegistry.arc32.json  (minimal ARC-32 shape for tools that expect it)
"""
from __future__ import annotations

import json
import os
from pathlib import Path

from algosdk.v2client.algod import AlgodClient
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent
ART = ROOT / "artifacts"
BACKEND_ENV = ROOT.parent / "backend" / ".env"

# TestNet genesis hash from algod /versions (stable for app spec keys)
TESTNET_GENESIS_HASH_B64 = "SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI="


def main() -> None:
    load_dotenv(BACKEND_ENV, override=False)
    load_dotenv(ROOT / ".env", override=True)

    algod_addr = os.getenv("ALGOD_ADDRESS", "https://testnet-api.algonode.cloud").strip()
    algod_token = os.getenv("ALGOD_TOKEN", "").strip()
    app_id = os.getenv("RISK_REGISTRY_APP_ID", "759012792").strip()

    contract_path = ART / "contract.json"
    approval_path = ART / "approval.teal"
    clear_path = ART / "clear.teal"

    contract = json.loads(contract_path.read_text(encoding="utf-8"))
    approval_src = approval_path.read_text(encoding="utf-8")
    clear_src = clear_path.read_text(encoding="utf-8")

    client = AlgodClient(algod_token, algod_addr)
    versions = client.versions()
    build = versions.get("build", {})
    approval_b64 = client.compile(approval_src)["result"]
    clear_b64 = client.compile(clear_src)["result"]

    methods = contract.get("methods", [])
    name = contract.get("name", "RiskRegistry")

    arc56: dict = {
        "arcs": [4, 22, 28, 56],
        "name": name,
        "desc": "On-chain risk registry (boxes keyed by 32-byte address public key).",
        "networks": {
            TESTNET_GENESIS_HASH_B64: {"appID": int(app_id)},
            "testnet-v1.0": {"appID": int(app_id)},
        },
        "structs": {},
        "methods": methods,
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
        "compilerInfo": {
            "compiler": "algod",
            "compilerVersion": {
                "major": int(build.get("major", 0)),
                "minor": int(build.get("minor", 0)),
                "patch": int(build.get("build_number", 0)),
                "commitHash": str(build.get("commit_hash", "")),
            },
        },
    }

    out56 = ART / "RiskRegistry.arc56.json"
    out56.write_text(json.dumps(arc56, indent=2), encoding="utf-8")
    print(f"Wrote {out56}")

    # Minimal ARC-32-style bundle (many tools accept { schema, contract, bareActions, ... })
    arc32: dict = {
        "schema": {
            "global": {"ints": 0, "bytes": 0},
            "local": {"ints": 0, "bytes": 0},
        },
        "contract": {
            "name": name,
            "methods": methods,
            "networks": {
                TESTNET_GENESIS_HASH_B64: {"appId": int(app_id)},
                "testnet-v1.0": {"appId": int(app_id)},
            },
        },
        "bareActions": arc56["bareActions"],
        "byteCode": arc56["byteCode"],
        "compilerInfo": arc56["compilerInfo"],
    }

    out32 = ART / "RiskRegistry.arc32.json"
    out32.write_text(json.dumps(arc32, indent=2), encoding="utf-8")
    print(f"Wrote {out32}")


if __name__ == "__main__":
    main()

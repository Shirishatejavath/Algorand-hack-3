import json
from pathlib import Path

from pyteal import *

from risk_registry import build_router


ROOT = Path(__file__).resolve().parent
ARTIFACTS_DIR = ROOT / "artifacts"


def main() -> None:
    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)

    router = build_router()

    approval, clear, contract = router.compile_program(version=8)

    (ARTIFACTS_DIR / "approval.teal").write_text(approval, encoding="utf-8")
    (ARTIFACTS_DIR / "clear.teal").write_text(clear, encoding="utf-8")

    # Router contract spec is ARC-4 compatible; write it as JSON
    (ARTIFACTS_DIR / "contract.json").write_text(
        json.dumps(contract.dictify(), indent=2, sort_keys=True),
        encoding="utf-8",
    )

    print(f"Wrote {ARTIFACTS_DIR / 'approval.teal'}")
    print(f"Wrote {ARTIFACTS_DIR / 'clear.teal'}")
    print(f"Wrote {ARTIFACTS_DIR / 'contract.json'}")


if __name__ == "__main__":
    main()


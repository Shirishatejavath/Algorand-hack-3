# Lora (App Lab) — RiskRegistry on TestNet

This project’s on-chain app is **RiskRegistry** (PyTeal). Use these steps with [Lora](https://lora.algokit.io) on **TestNet**.

## Artifacts (regenerate anytime)

From the repo root:

```bash
python contracts/build.py
```

Outputs:

| File | Use |
|------|-----|
| `contracts/artifacts/RiskRegistry.arc32.json` | Upload when Lora asks for **ARC-32** |
| `contracts/artifacts/RiskRegistry.arc56.json` | Upload when Lora asks for **ARC-56** |
| `contracts/artifacts/approval.teal` / `clear.teal` | Source / debugging |

Set `RISK_REGISTRY_APP_ID` in `backend/.env` before building if you want the deployed app id embedded in the spec `networks` section.

## If the app is already deployed

You **do not** need to deploy again unless you want a **new** app id.

1. **App Lab → Create** (or open your saved interface).
2. Upload **`RiskRegistry.arc32.json`** (or **`.arc56.json`** if the UI requests ARC-56).
3. Enter your **existing App ID** (from `RISK_REGISTRY_APP_ID` / deployment logs).
4. **Connect wallet** — must be the **creator** account for `set_risk` and `delete_risk`.

## ABI methods

| Method | Args | Who can call |
|--------|------|----------------|
| `set_risk` | `address_pk` (byte[]), `score` (uint64) | **Creator only** |
| `delete_risk` | `address_pk` (byte[]) | **Creator only** |
| `get_risk` | `address_pk` (byte[]) | Anyone (fee payer) |

`address_pk` is the **32-byte public key** of a wallet, **not** the 58-character address string.

```python
from algosdk.encoding import decode_address
import base64
addr = "YOUR_58_CHAR_ADDRESS"
pk = decode_address(addr)
print(pk.hex())       # often paste into Lora as hex
print(base64.b64encode(pk).decode())  # or base64 if the UI expects that
```

## Transaction settings (critical)

- **On completion:** **`NoOp`** for all ABI method calls. Using **Close-out** or **Opt-in** for a normal ABI call will fail logic checks.
- **Box references:** Required for every call that touches box storage. Add:

  - **Application id:** your RiskRegistry app id  
  - **Box name:** the **same 32 bytes** as `address_pk` (same hex or base64 encoding the UI expects)

## App escrow funding (first `set_risk`)

Creating a box increases the **application account** minimum balance. If `set_risk` fails with the **app escrow** address having insufficient balance, fund that address on TestNet (dispenser), or run:

```bash
python contracts/interact_abi.py
```

That script tops up the app escrow when needed, then calls `set_risk` and `get_risk`.

## Programmatic alternative (no Lora)

```bash
python contracts/interact_abi.py
python contracts/interact_abi.py --get-only --address YOUR58CHARADDRESS
```

Uses `backend/.env` (`ALGOD_*`, `CREATOR_MNEMONIC`, `RISK_REGISTRY_APP_ID`).

## Further reading

- [AlgoKit quick start — deploy & interact](https://dev.algorand.co/getting-started/algokit-quick-start/#deploy-the-hello-world-application)
- [AlgoKit clients — calling methods](https://dev.algorand.co/algokit/utils/algokit-clients/#calling-a-smart-contract-method)

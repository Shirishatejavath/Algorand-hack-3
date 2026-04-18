# Smart Contract Artifacts (Algorand)

This folder contains the on-chain **Risk Registry** contract (PyTeal) and a build script that generates deployable artifacts.

## Generate artifacts

From repo root:

```bash
python contracts/build.py
```

This writes:

- `contracts/artifacts/approval.teal`
- `contracts/artifacts/clear.teal`
- `contracts/artifacts/contract.json` (ARC-4 contract spec)

## Deploy (TestNet)

1) Install backend deps (includes `pyteal`, `py-algorand-sdk`, `python-dotenv`)

```bash
cd backend
pip install -r requirements.txt
```

2) Put env vars in `backend/.env` (recommended single env file)

`contracts/deploy.py` will load `backend/.env` automatically.

You need:
- `ALGOD_ADDRESS` (TestNet AlgoNode is fine)
- `ALGOD_TOKEN` (leave blank for AlgoNode)
- `CREATOR_MNEMONIC` (deployer account mnemonic)

Optionally, you can also create `contracts/.env` to override `backend/.env` locally.

### (Optional) Create `contracts/.env` (copy from example)

```bash
copy contracts\.env.example contracts\.env
```

Edit `contracts/.env` and set:
- `CREATOR_MNEMONIC` (the deployer account mnemonic)

3) Build artifacts, then deploy

```bash
python contracts/build.py
python contracts/deploy.py
```

The script prints the **app_id** you’ll use from backend/frontend.

## Call ABI from Python (`interact_abi.py`)

From repo root (uses `backend/.env` for `ALGOD_*`, `CREATOR_MNEMONIC`, `RISK_REGISTRY_APP_ID`):

```bash
python contracts/interact_abi.py
python contracts/interact_abi.py --get-only
python contracts/interact_abi.py --address YOUR58CHARADDRESS --score 85
```

- The first `set_risk` needs the **application escrow** funded (boxes increase app min balance). The script **auto-sends** TestNet ALGO to the app account if it is below ~1 ALGO.
- For **App Lab**, paste `address_pk` as **hex** (or base64 if the UI asks); add a **box ref** `(app_id, same 32 bytes)`.

## ABI methods

The contract stores entries in **boxes** keyed by a 32-byte public key (decoded Algorand address bytes).

- `set_risk(address_pk: byte[], score: uint64)` (creator-only)
- `delete_risk(address_pk: byte[])` (creator-only)
- `get_risk(address_pk: byte[]) -> (exists: bool, score: uint64, updated_at: uint64)`

Notes:
- `address_pk` must be the **32-byte public key**, not the base32 address string.
- `updated_at` is `Global.latest_timestamp()`.


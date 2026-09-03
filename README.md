# Nokia 3121 Router API Client

Python client for the **Nokia 3121 (Beacon 2)** router admin API. The router's
login is an obfuscated JS crypto handshake (nonce + salt + SHA-256 crypt +
AES-CBC + RSA), so plain form-login fails. This repo replicates the handshake
in Python to get an authenticated session, then queries the data endpoints.

## Requirements

- Python 3 with `requests` + `cryptography`
- `openssl` on PATH (for SHA-256 crypt — Python 3.14 dropped the `crypt` module)

## Setup

The router password is **not** hardcoded. Set it via env:

```bash
export NOKIA_USER=admin        # optional, defaults to admin
export NOKIA_PASS='<router-password>'
```

## Usage

### Library

```python
import nokia_api as N

clients = N.get("clients")       # full AP/client table
devices = N.get("devices")       # device status
info    = N.get("routerinfo")    # router info
status  = N.get("status")        # dashboard status
```

`N.get()` returns a parsed dict with tolerant JSON handling (the router emits
TR-069-style invalid JSON — leading commas — which is cleaned before parsing).

### CLI

```bash
python nokia_api.py clients
python nokia_api.py devices
python nokia_api.py routerinfo
python nokia_api.py status
```

> Note: the CLI truncates output at 4000 chars. For full data, import the
> library and call `N.get()` directly, or use `nokia_full_dump.py`.

### Scripts

| Script | Purpose |
|---|---|
| `nokia_api.py` | Library + CLI (login handshake inside) |
| `nokia_login.py` | The handshake replication (nonce → salt → crypt → AES/RSA) |
| `nokia_cell_raw.py` | Raw cell endpoint response |
| `nokia_cell_status.py` | Cell status |
| `nokia_clients.py` | Client table |
| `nokia_full_dump.py` | All APs + clients + full WAN detail |
| `nokia_pixel_monitor.py` | Poll a phone's signal metrics over time (RSSI, rates, AP) |
| `nokia_pixel_wan.py` | WAN status for a phone |
| `nokia_probe_logs.py` | Probe/diagnostic logs |

## How the handshake works

1. `POST login_web_app.cgi?nonce` → `{nonce, randomKey, salt, pubkey}` (the
   router is in **security-compliance** mode, so a salt is present).
2. Password is hashed with **Linux SHA-256 crypt**: `openssl passwd -5 -salt <salt> <pw>`.
3. The whole `userhash&RandomKeyhash&response&nonce&enckey&enciv&nohash&hPassword`
   string is **AES-CBC** encrypted; the AES key+IV are **RSA-PKCS1v15** encrypted.
4. Body is `encrypted=1&ct=<b64url>&ck=<b64url>`.
5. Success → `{"result":0, "sid":..., "token":...}`.
6. Authenticated calls use **`sid` as a cookie** + **`csrf_token` in the POST body**.

The `base64url_escape` is a pure character substitution (`+`→`-`, `/`→`_`,
`=`→`.`), not a base64 round-trip.

## Notes

- The router's cert is self-signed — the client disables TLS verification.
- Only port 443 is open (no SSH/telnet/SNMP/TR-069).
- The `command_web_app.cgi` shell primitives (`pexist`/`cat`) authenticate but
  return empty bodies on this firmware — the data endpoints are the reliable
  surface.

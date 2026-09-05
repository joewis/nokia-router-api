# Nokia 3121 Router API Client

Python client for the **Nokia 3121 (Beacon 2)** router admin API. The router's
login is an obfuscated JS crypto handshake (nonce + salt + SHA-256 crypt +
AES-CBC + RSA), so plain form-login fails. This repo replicates the handshake
in Python to get an authenticated session, then queries the data endpoints.

The full CGI surface was discovered by pulling the router's own Angular JS
bundle (`/web_whw/main.*.js`) and the `capabilities_status_web_app.cgi` →
`authorizedcgi` whitelist — **no guessing, no brute-force**.

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

To raise the syslog capture level for diagnostics (e.g. to capture more detail
around disconnect events):

```python
import nokia_api as N
N.set_log_level("Debug", "Debug")   # capture level 7 (most detail)
```

Valid capture levels: `Emergency`(0), `Alert`(1), `Critical`(2), `Error`(3),
`Warning`(4), `Notice`(5), `Informational`(6), `Debug`(7). The payload format
(`logLevel=<0-7>&logDispLevel=<string>`) was reverse-engineered from the
router's JS bundle (chunk 733).

### CLI

```bash
python nokia_api.py clients
python nokia_api.py devices
python nokia_api.py routerinfo
python nokia_api.py status
python nokia_api.py capabilities   # the authorizedcgi whitelist
python nokia_api.py log_vlog       # full syslog buffer
```

> Note: the CLI truncates output at 4000 chars. For full data, import the
> library and call `N.get()` directly, or use `nokia_full_dump.py`.

### Scripts

| Script | Purpose |
|---|---|
| `nokia_api.py` | Library + CLI (login handshake inside, `ENDPOINTS` map) |
| `nokia_http.py` | Session creation, tolerant JSON decode, body extraction |
| `nokia_crypto.py` | `url_safe_base64_encode`, `sha256_crypt`, `aes_cbc_encrypt` |
| `nokia_login.py` | The handshake replication (nonce → salt → crypt → AES/RSA) |
| `nokia_clients.py` | Known-devices + live-client table |
| `nokia_full_dump.py` | All APs + clients + full WAN detail |
| `nokia_cell_raw.py` | Raw cell endpoint response |
| `nokia_cell_status.py` | Cell status |
| `nokia_probe_logs.py` | Probe/diagnostic log endpoints |
| `nokia_pixel_wan.py` | Client radio/signal details + WAN double-NAT check |
| `nokia_pixel_monitor.py` | Poll any device's signal metrics over time |

## Endpoints

All endpoints are exposed via the `ENDPOINTS` dict in `nokia_api.py`. Friendly
names map to the actual CGI script names. **Read-only** endpoints are active;
**destructive / state-changing** endpoints are present but commented out.

### Read-only endpoints (active)

| Friendly name | CGI endpoint | Returns |
|---|---|---|
| `clients` | `device_home_nw_client_status_web_app.cgi` | Full AP/client table (76KB) |
| `devices` | `dashboard_device_status_web_app.cgi` | Known devices / ARP table |
| `routerinfo` | `main_web_app.cgi` | Router info (model, serial, version) |
| `device_info` | `device_status_web_app.cgi?getroot` | Device metadata (chipset, HW/SW version, uptime) |
| `status` | `dashboard_status_web_app.cgi` | Dashboard status |
| `troubleshoot_status` | `troubleshooting_status_web_app.cgi` | WAN conns, uptime, DNS |
| `capabilities` | `capabilities_status_web_app.cgi` | **`authorizedcgi` whitelist** + UI visibility |
| `network_topology` | `dashboard_ntwtopo_status_web_app.cgi` | Network topology |
| `home_network` | `device_home_network_status_web_app.cgi` | Home network APs |
| `check_expire` | `check_expire_web_app.cgi` | Expiry / gateway ready |
| `container_management` | `container_management_status_web_app.cgi` | Container/execution units |
| `wan_internet` | `wan_internet_status_web_app.cgi` | WAN IP, status, up flag |
| `wan_config` | `wan_config_glb_status_web_app.cgi` | WAN config |
| `wan_show` | `show_wan_status_web_app.cgi` | WAN connections |
| `ddns` | `ddns_status_web_app.cgi` | DDNS config |
| `sntp` | `sntp_status_web_app.cgi` | Time sync status |
| `upnp` | `upnp_status_web_app.cgi` | UPnP config |
| `lan_ipv4` | `lan_ipv4_status_web_app.cgi` | LAN/DHCP IPv4 config |
| `lan_ipv6` | `lan_ipv6_status_web_app.cgi` | LAN IPv6 config |
| `lan_status` | `lan_status_web_app.cgi` | LAN status |
| `domain_route` | `domain_route_status_web_app.cgi` | DNS prefix/suffix |
| `wlan_config` | `wlan_config_status_web_app.cgi` | WiFi config |
| `wlan_guest` | `wlan_config_guest_status_web_app.cgi` | Guest WiFi config |
| `mesh` | `mesh_status_web_app.cgi` | Mesh/beacon detail |
| `beacon_mode` | `whw_beacon_mode_app_status_web_app.cgi` | Beacon work mode |
| `macfilter` | `macfilter_status_web_app.cgi` | MAC filter config |
| `ipfilter` | `ipfilter_status_web_app.cgi` | IP filter config |
| `firewall` | `firewall_status_web_app.cgi` | Firewall config |
| `parental_control` | `parental_ctrl_status_web_app.cgi` | Parental control |
| `device_name` | `device_name_status_web_app.cgi` | Device config |
| `password` | `password_status_web_app.cgi` | Login config |
| `ledctrl` | `ledctrl_status_web_app.cgi` | LED control status |
| `web_customization` | `web_customization_web_app.cgi` | Logo/color customization |
| `statistics` | `statistics_status_web_app.cgi` | LAN traffic counters |
| `diag` | `diag_status_web_app.cgi` | LAN ethernet status |
| `qos` | `qos_status_web_app.cgi` | QoS config |
| `nat` | `nat_glb_status_web_app.cgi` | NAT config |
| `log` | `log_status_web_app.cgi` | Syslog config |
| `log_info` | `log_status_web_app.cgi?info` | Syslog config detail |
| `log_vlog` | `log_status_web_app.cgi?vlog_glb` | **Full syslog buffer** (142KB) |
| `log_set` | `log_web_app.cgi?set_log_glb` | Set syslog capture/display level |

### Diagnostic endpoints (active)

These run network tests (ping, latency, DNS, throughput, packet loss). They
are **read-only diagnostics** — they run a test and report results, they do not
change configuration. Results are read back via `diag` / `troubleshoot_status`.

| Friendly name | CGI endpoint | Action |
|---|---|---|
| `diag_ping` | `diag_web_app.cgi?ping` | Run a ping test (returns a `pid`) |
| `diag_cancel` | `diag_web_app.cgi?cancel` | Cancel a running diagnostic |
| `troubleshoot_ping` | `troubleshooting_web_app.cgi?ping` | Run a ping test |
| `troubleshoot_latency` | `troubleshooting_web_app.cgi?latencytest` | Run a latency test |
| `troubleshoot_dns` | `troubleshooting_web_app.cgi?dnsrestest` | Run a DNS resolution test |
| `troubleshoot_us_throughput` | `troubleshooting_web_app.cgi?usthroughputtest` | Run an upstream throughput test |
| `troubleshoot_ds_throughput` | `troubleshooting_web_app.cgi?dsthroughputtest` | Run a downstream throughput test |
| `troubleshoot_us_packetloss` | `troubleshooting_web_app.cgi?uspacketloss` | Run an upstream packet-loss test |
| `troubleshoot_ds_packetloss` | `troubleshooting_web_app.cgi?dspacketloss` | Run a downstream packet-loss test |

### Process status / readout endpoint (`command_web_app.cgi`)

`command_web_app.cgi` is **not** a shell backdoor and **not** dead code. It is a
**process-status and output-readout** mechanism used by the router's own UI to
poll long-running operations (firmware upgrade, ping/traceroute diagnostics).
The argument is a **numeric process ID** (returned by the operation that started
the process), not a shell command or file path.

| Friendly name | CGI endpoint | Action |
|---|---|---|
| `command_pexist` | `command_web_app.cgi?pexist+<pid>` | Check if a process is running |
| `command_cat` | `command_web_app.cgi?cat+<pid>.cmd` | Read a process's output |

**How to use it:**

1. Start a long-running operation (e.g. a ping diagnostic via
   `diag_web_app.cgi?ping`). The response includes a `pid`.
2. Poll `command_web_app.cgi?pexist+<pid>` to check if it's still running:
   ```json
   {"exist":1}   // running
   {"exist":0}   // not running / finished
   ```
3. Read the process output via `command_web_app.cgi?cat+<pid>.cmd` (text
   response) to stream the results.

**Verified live:** `pexist+1` → `{"exist":1}` (PID 1, the init process, exists);
`pexist+100` → `{"exist":0}`. Passing a non-numeric argument (e.g. `pexist+ls`)
returns `Invalid pexist parameter` — confirming the argument must be a PID.

The request format (from the de-minified JS bundle, chunk 733):
- `pexist` uses `POST_CSRF` (body `csrf_token=<token>`)
- `cat` uses `POST_CSRF_TEXT` (body `csrf_token=<token>`, text response)

### Disabled / destructive endpoints (commented out)

These are **state-changing or destructive** and are intentionally **disabled**
in `ENDPOINTS`. They are documented here for reference but **must not be called**
without explicit need — several will reboot, factory-reset, or reconfigure the
router.

| Friendly name | CGI endpoint | Risk |
|---|---|---|
| `reboot` | `reboot_web_app.cgi` | **Reboots the router** |
| `restore` | `restore_web_app.cgi?restore_glb` | **Restores config** |
| `restore_factory` | `restore_web_app.cgi?deep_factory` | **Factory reset** |
| `upgrade` | `upgrade_web_app.cgi` | **Firmware upgrade** |
| `troubleshoot_port_mirror` | `troubleshooting_web_app.cgi?v=port_mirror` | Enables port mirror |
| `troubleshoot_del_port_mirror` | `troubleshooting_web_app.cgi?v=del_portmirror` | Disables port mirror |
| `password_set` | `password_web_app.cgi?set` | **Changes admin password** |
| `device_name_add` / `del` | `device_name_web_app.cgi?add` / `?act=del` | Adds/removes device name |
| `lan_ipv4_config` / `bindmac` / `del` | `lan_ipv4_web_app.cgi?config` / `?bindmac` / `?act=del` | LAN/DHCP changes |
| `wlan_config_glb` / `glb11ac` | `wlan_config_web_app.cgi?do_config_glb` / `?do_config_glb11ac` | **WiFi config changes** |
| `wlan_guest_config` | `wlan_config_guest_web_app.cgi?ConfigWhwGuest` | Guest WiFi changes |
| `wlan_wps_*` | `wlan_config_web_app.cgi?wps_status` / `?pin_get` / `?pbc` / `?sta_pin` / `?ap_pin` | WPS operations |
| `mesh_add` / `del` / `set` | `mesh_web_app.cgi?add` / `?del` / `?v_glb=set` | Mesh changes |
| `qos_add` / `del_gfast` | `qos_web_app.cgi?v=add` / `?v=del_gfast` | QoS changes |
| `nat_add/del_vhost` / `thost` | `nat_glb_web_app.cgi?v=add_vhost` / `?v=del_vhost` / `?v=add_thost` / `?v=del_thost` | NAT port-forward changes |
| `nat_cfg_alg` / `dmz` | `nat_glb_web_app.cgi?v=cfg_alg` / `?v=cfg_dmz` | NAT ALG/DMZ changes |
| `ddns_add` | `ddns_web_app.cgi?add_glb` | DDNS changes |
| `upnp_config` | `upnp_web_app.cgi?config_glb` | UPnP changes |
| `firewall_set` / `level` | `firewall_web_app.cgi?fire` / `?level_name` | Firewall changes |
| `macfilter_add/del` | `macfilter_web_app.cgi?add_ethernet` / `?act=del_ethernet` / `?add_wlan` / `?act=del_wlan` | MAC filter changes |
| `ipfilter_set` / `add` / `del` | `ipfilter_web_app.cgi?v_glb=set` / `?add_glb` / `?v_glb=delip` | IP filter changes |
| `parental_control_set` | `parental_ctrl_web_app.cgi` | Parental control changes |
| `ledctrl_set` | `ledctrl_web_app.cgi?SetLedGlb` | LED changes |
| `domain_route_add/del/enable` | `domain_route_web_app.cgi?add_domainRouteData` / `?act=del` / `?enable` | DNS route changes |
| `lan_add_client_alias` / `del` / `del_dom` | `lan_status_web_app.cgi?add_client_alias` / `?del` / `?delDom` | LAN client changes |
| `wan_config_b` | `wan_config_glb_b_web_app.cgi?config` | WAN config changes |
| `beacon_mode_set` | `whw_beacon_mode_app_web_app.cgi` | Beacon mode changes |

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
- The router runs **Linux** (self-reported `execution-env: "Linux OS"`, uses
  Linux `crypt()` SHA-256, served by `thttpd`).
- The SPA is served from `/web_whw/` — the JS bundle there is the authoritative
  source of the CGI endpoint list.

#!/home/carl/.winrm-venv/bin/python
"""Pixel 10 wifi details + WAN IP info (double-NAT check) from Nokia 3121."""
import base64
import json
import os

import requests
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import serialization

from nokia_crypto import url_escape, sha256_crypt, aes_cbc_encrypt
from nokia_http import create_session, tolerant_json, extract_body_content

BASE = "https://192.168.18.1"
USER, PASS = "admin", os.environ.get("NOKIA_PASS", "")

s = create_session()
r = s.post(f"{BASE}/login_web_app.cgi?nonce", data=f"userName={USER}")
j = r.json()
pub = serialization.load_pem_public_key(j["pubkey"].encode())
p_hashed = sha256_crypt(PASS, j["salt"])
ue = requests.utils.quote(p_hashed, safe="")
key, iv = os.urandom(16), os.urandom(16)
key_b64, iv_b64 = base64.b64encode(key).decode(), base64.b64encode(iv).decode()
fe = (f"userhash={USER}&RandomKeyhash={j['randomKey']}&response={ue}"
      f"&nonce={url_escape(j['nonce'])}&enckey={url_escape(key_b64)}"
      f"&enciv={url_escape(iv_b64)}&nohash=1&hPassword=undefined")
ct = aes_cbc_encrypt(key, iv, fe.encode())
ck = pub.encrypt(f"{key_b64} {iv_b64}".encode(), padding.PKCS1v15())
body = ("encrypted=1&ct=" + url_escape(base64.b64encode(ct).decode())
        + "&ck=" + url_escape(base64.b64encode(ck).decode()))
token = s.post(f"{BASE}/login_web_app.cgi", data=body).json()["token"]


def get(ep, method="POST"):
    """Make an authenticated request to an endpoint."""
    try:
        if method == "GET":
            r = s.get(f"{BASE}/{ep}?csrf_token={token}", timeout=15)
        else:
            r = s.post(f"{BASE}/{ep}", data=f"csrf_token={token}", timeout=15)
        tail = extract_body_content(r)
        return tolerant_json(tail) if tail else None
    except Exception as e:
        return None


# Pixel 10 wifi details from client table
cli = get("device_home_nw_client_status_web_app.cgi")
print("=== Pixel 10 / all clients (radio + signal) ===")
if isinstance(cli, dict):
    for ap in cli.get("aps", []):
        for ap_id, ap_info in ap.items():
            if not isinstance(ap_info, dict):
                continue
            for r_ in ap_info.get("radios", []):
                band = r_.get("medium", "?")
                chan = r_.get("channel", "?")
                for ssid in r_.get("ssids", []):
                    for c in ssid.get("clients", []):
                        if isinstance(c, dict):
                            for mac, info in c.items():
                                print(f"  {mac}  band={band} ch={chan} ssid={ssid.get('ssid')} "
                                      f"ip={info.get('ip-address')} state={info.get('state')} "
                                      f"rssi={info.get('rssi', info.get('signal', '?'))} "
                                      f"rate={info.get('rate', info.get('phy-rate', '?'))}")
                                for k in info:
                                    if any(x in k.lower() for x in ("rssi", "signal", "rate", "mcs", "snr", "tx", "rx")):
                                        pass

# WAN IP + status for double-NAT check
print("\n=== WAN IP conns (double-NAT check) ===")
st = get("troubleshooting_status_web_app.cgi")
if isinstance(st, dict):
    for wc in st.get("wan_conns", []):
        for ipc in wc.get("ipConns", []):
            print(f"  {ipc.get('Name')}: status={ipc.get('ConnectionStatus')} "
                  f"ip={ipc.get('ExternalIPAddress', ipc.get('IPAddress', '?'))} "
                  f"uptime={ipc.get('Uptime')}s "
                  f"defaultgw={ipc.get('DefaultGateway', ipc.get('DefaultGatewayIPAddress', '?'))} "
                  f"dns={ipc.get('DNSServers', ipc.get('DNS1', '?'))}")

#!/home/carl/.winrm-venv/bin/python
"""Nokia 3121 authenticated API access — WORKING session.
Usage: python nokia_api.py [endpoint]
Returns JSON from the router's authenticated data endpoints.
"""
import base64
import json
import os
import sys

import requests
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import serialization

from nokia_crypto import url_escape, sha256_crypt, aes_cbc_encrypt
from nokia_http import create_session, tolerant_json, extract_body_content

BASE = "https://192.168.18.1"
USER = os.environ.get("NOKIA_USER", "admin")
PASS = os.environ.get("NOKIA_PASS", "")

ENDPOINTS = {
    "clients": "device_home_nw_client_status_web_app.cgi",
    "devices": "dashboard_device_status_web_app.cgi",
    "routerinfo": "main_web_app.cgi",
    "status": "dashboard_status_web_app.cgi",
    "troubleshoot": "troubleshooting_web_app.cgi",
}


def login(s):
    """Perform authentication and return session credentials."""
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
    return s.post(f"{BASE}/login_web_app.cgi", data=body).json()


def get(endpoint, extra_query=""):
    """Make an authenticated GET/POST request to an endpoint."""
    s = create_session()
    j = login(s)
    s.cookies.set("sid", j["sid"])
    url = f"{BASE}/{endpoint}{extra_query}"
    r = s.post(url, data=f"csrf_token={j['token']}", timeout=20)
    body = extract_body_content(r)
    try:
        return json.loads(body)
    except Exception:
        return tolerant_json(body)


if __name__ == "__main__":
    name = sys.argv[1] if len(sys.argv) > 1 else "clients"
    extra = sys.argv[2] if len(sys.argv) > 2 else ""
    ep = ENDPOINTS.get(name, name)
    data = get(ep, extra)
    if isinstance(data, dict):
        print(json.dumps(data, indent=1)[:4000])
    else:
        print(str(data)[:4000])

#!/home/carl/.winrm-venv/bin/python
"""Probe the live router for log-related endpoints."""
import base64
import os

import requests
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import serialization

from nokia_crypto import url_safe_base64_encode, sha256_crypt, aes_cbc_encrypt
from nokia_http import create_session, extract_body_content

BASE = "https://192.168.18.1"
USER, PASS = "admin", os.environ.get("NOKIA_PASS", "")


def main():
    """Authenticate to the router and probe log-ish endpoints."""
    s = create_session()
    r = s.post(f"{BASE}/login_web_app.cgi?nonce", data=f"userName={USER}")
    j = r.json()
    pub = serialization.load_pem_public_key(j["pubkey"].encode())
    p_hashed = sha256_crypt(PASS, j["salt"])
    ue = requests.utils.quote(p_hashed, safe="")
    key, iv = os.urandom(16), os.urandom(16)
    key_b64, iv_b64 = base64.b64encode(key).decode(), base64.b64encode(iv).decode()
    fe = (f"userhash={USER}&RandomKeyhash={j['randomKey']}&response={ue}"
          f"&nonce={url_safe_base64_encode(j['nonce'])}&enckey={url_safe_base64_encode(key_b64)}"
          f"&enciv={url_safe_base64_encode(iv_b64)}&nohash=1&hPassword=undefined")
    ct = aes_cbc_encrypt(key, iv, fe.encode())
    ck = pub.encrypt(f"{key_b64} {iv_b64}".encode(), padding.PKCS1v15())
    body = ("encrypted=1&ct=" + url_safe_base64_encode(base64.b64encode(ct).decode())
            + "&ck=" + url_safe_base64_encode(base64.b64encode(ck).decode()))
    token = s.post(f"{BASE}/login_web_app.cgi", data=body).json()["token"]

    # probe log-ish endpoints
    cands = [
        "log_web_app.cgi", "syslog_web_app.cgi", "syslog_status_web_app.cgi",
        "eventlog_web_app.cgi", "device_log_web_app.cgi", "log_status_web_app.cgi",
        "diagnostics_log_web_app.cgi", "security_log_web_app.cgi", "firewall_log_web_app.cgi",
        "access_log_web_app.cgi", "alarm_web_app.cgi", "alarm_status_web_app.cgi",
        "device_alarm_web_app.cgi", "syslog_cfg_web_app.cgi",
    ]
    for ep in cands:
        try:
            r = s.post(f"{BASE}/{ep}", data=f"csrf_token={token}", timeout=8)
            tail = extract_body_content(r)
            status = "HIT" if r.status_code == 200 and tail else f"{r.status_code}"
            print(f"{ep:40s} {status} len={len(tail)} body={tail[:90]!r}")
        except Exception as e:
            print(f"{ep:40s} EXC {type(e).__name__}")


if __name__ == "__main__":
    main()

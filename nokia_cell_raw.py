#!/home/carl/.winrm-venv/bin/python
"""Raw cell endpoint response."""
import base64
import os

import requests
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import serialization

from nokia_crypto import url_escape, sha256_crypt, aes_cbc_encrypt
from nokia_http import create_session

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
lj = s.post(f"{BASE}/login_web_app.cgi", data=body).json()
token = lj["token"]

for meth in ["GET", "POST"]:
    if meth == "GET":
        r = s.get(f"{BASE}/cell_management_get_web_app.cgi?csrf_token={token}", timeout=15)
    else:
        r = s.post(f"{BASE}/cell_management_get_web_app.cgi", data=f"csrf_token={token}", timeout=15)
    print(f"=== {meth} status={r.status_code} ===")
    print("headers:", dict(list(r.headers.items())[:6]))
    print("content:", repr(r.content[:400]))
    print()

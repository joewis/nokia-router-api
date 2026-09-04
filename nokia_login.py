#!/home/carl/.winrm-venv/bin/python
"""Nokia 3121 (Beacon 2) router login helper — reverse-engineered from main.js.

The device is in security-compliance mode: the nonce returns a salt and the
password is hashed with Linux SHA-256 crypt (Module.cwrap("sha256_crypt")).
Reproduces the handshake so we can query authenticated endpoints.
Credentials from env (NOKIA_USER / NOKIA_PASS).
"""
import base64
import os

import requests
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import serialization

from nokia_crypto import url_escape, sha256_crypt, aes_cbc_encrypt
from nokia_http import create_session

BASE = "https://192.168.18.1"
USER = os.environ.get("NOKIA_USER", "admin")
PASS = os.environ.get("NOKIA_PASS", "")


def login(s: requests.Session):
    """Perform the authentication handshake and return the login response."""
    r = s.post(f"{BASE}/login_web_app.cgi?nonce", data=f"userName={USER}")
    j = r.json()
    nonce = j["nonce"]
    randkey = j["randomKey"]
    salt = j["salt"]
    pubkey = j["pubkey"]

    pub = serialization.load_pem_public_key(pubkey.encode())

    # security-compliance path: response = crypt(password, salt)
    p_hashed = sha256_crypt(PASS, salt)
    ue = requests.utils.quote(p_hashed, safe="")   # response
    se = USER                                       # userhash
    ye = randkey                                    # RandomKeyhash
    he = "1"                                        # nohash

    key = os.urandom(16)
    iv = os.urandom(16)
    key_b64 = base64.b64encode(key).decode()
    iv_b64 = base64.b64encode(iv).decode()

    fe = (f"userhash={se}&RandomKeyhash={ye}&response={ue}"
          f"&nonce={url_escape(nonce)}"
          f"&enckey={url_escape(key_b64)}"
          f"&enciv={url_escape(iv_b64)}"
          f"&nohash={he}&hPassword=undefined")

    ct = aes_cbc_encrypt(key, iv, fe.encode())

    rsa_pt = f"{key_b64} {iv_b64}".encode()
    ck = pub.encrypt(rsa_pt, padding.PKCS1v15())

    body = ("encrypted=1&ct=" + url_escape(base64.b64encode(ct).decode())
            + "&ck=" + url_escape(base64.b64encode(ck).decode()))
    return s.post(f"{BASE}/login_web_app.cgi", data=body)


if __name__ == "__main__":
    s = create_session()
    r = login(s)
    print("status:", r.status_code)
    print("body:", r.text[:400])

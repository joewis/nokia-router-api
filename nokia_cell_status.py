#!/home/carl/.winrm-venv/bin/python
"""Pull cellular/WAN state + Pixel 10 wifi info from the Nokia 3121."""
import base64, json, os, re, subprocess, urllib3
import requests
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes

urllib3.disable_warnings()
BASE = "https://192.168.18.1"
USER, PASS = "admin", os.environ.get("NOKIA_PASS", "")


def url_escape(s):
    return s.translate(str.maketrans("+/", "-_")).replace("=", ".")


def sha256_crypt(password, salt):
    return subprocess.run(["openssl", "passwd", "-5", "-salt", salt, password],
                          capture_output=True, text=True).stdout.strip()


def aes_cbc_encrypt(key, iv, data):
    c = Cipher(algorithms.AES(key), modes.CBC(iv)).encryptor()
    pad = 16 - (len(data) % 16)
    return c.update(data + bytes([pad]) * pad) + c.finalize()


def tolerant_json(body):
    txt = body.decode("utf-8", "replace")
    txt = re.sub(r"\[\s*,", "[", txt)
    txt = re.sub(r",\s*([}\]])", r"\1", txt)
    return json.loads(txt)


s = requests.Session(); s.verify = False
s.headers["Content-Type"] = "application/x-www-form-urlencoded"
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
    try:
        if method == "GET":
            r = s.get(f"{BASE}/{ep}?csrf_token={token}", timeout=15)
        else:
            r = s.post(f"{BASE}/{ep}", data=f"csrf_token={token}", timeout=15)
        tail = r.content.split(b"\r\n\r\n", 1)[1] if b"\r\n\r\n" in r.content else r.content
        if not tail:
            return None
        return tolerant_json(tail)
    except Exception as e:
        return f"ERR {type(e).__name__}: {str(e)[:120]}"


print("=== CELL INFO (cellular signal) ===")
cells = get("cell_management_get_web_app.cgi", "GET")
if isinstance(cells, dict):
    print(json.dumps(cells, indent=1)[:3000])
else:
    print(cells)

print("\n=== WAN / IP conn status ===")
st = get("troubleshooting_status_web_app.cgi")
if isinstance(st, dict):
    for wc in st.get("wan_conns", []):
        for ipc in wc.get("ipConns", []):
            print(f"  name={ipc.get('Name')} status={ipc.get('ConnectionStatus')} type={ipc.get('ConnectionType')} uptime={ipc.get('Uptime')}s")
else:
    print(st)

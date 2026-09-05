#!/home/carl/.winrm-venv/bin/python
"""
Nokia 3121 (Beacon 2) Router Login Helper

This module implements the authentication handshake reverse-engineered from
the router's JavaScript code (main.js). The device operates in security-
compliance mode where:
- The server returns a nonce, salt, random key, and RSA public key
- The password is hashed using Linux SHA-256 crypt ($5$salt$hash)
- Credentials are encrypted with AES-CBC using a random key/IV
- The AES key/IV are then encrypted with the router's RSA public key

Credentials should be provided via environment variables:
- NOKIA_USER (default: "admin")
- NOKIA_PASS (required)
"""

import base64
import os

import requests
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import serialization

from nokia_crypto import url_safe_base64_encode, sha256_crypt, aes_cbc_encrypt
from nokia_http import create_session

# Router base URL
BASE = "https://192.168.18.1"

# Credentials from environment variables
USER = os.environ.get("NOKIA_USER", "admin")
PASS = os.environ.get("NOKIA_PASS", "")


def login(session: requests.Session) -> requests.Response:
    """
    Performs the authentication handshake with the Nokia router.
    
    The handshake flow:
    1. Request a nonce with username - server returns nonce, salt, randomKey, pubkey
    2. Hash password with SHA-256 crypt using the provided salt
    3. Generate random AES key and IV for encrypting credentials
    4. Build credential payload with hashed password and encoded key/IV
    5. Encrypt payload with AES-CBC
    6. Encrypt AES key/IV with RSA public key
    7. Submit encrypted credentials
    
    Args:
        session: A configured requests Session instance.
        
    Returns:
        The HTTP response from the login POST request.
    """
    # Step 1: Request nonce and crypto parameters from router
    response = session.post(
        f"{BASE}/login_web_app.cgi?nonce", 
        data=f"userName={USER}"
    )
    challenge_data = response.json()
    
    nonce = challenge_data["nonce"]
    random_key = challenge_data["randomKey"]
    salt = challenge_data["salt"]
    public_key_pem = challenge_data["pubkey"]

    # Load the RSA public key provided by the router
    rsa_public_key = serialization.load_pem_public_key(public_key_pem.encode())

    # Step 2: Hash password using SHA-256 crypt (Linux $5$ format)
    password_hashed = sha256_crypt(PASS, salt)
    
    # URL-encode the hashed password for the form field
    password_encoded = requests.utils.quote(password_hashed, safe="")
    
    # Prepare other credential fields
    user_hash = USER          # userhash field
    random_key_hash = random_key  # RandomKeyhash field  
    no_hash_flag = "1"        # nohash flag indicating hashed password

    # Step 3: Generate random AES encryption key and IV
    aes_key = os.urandom(16)   # 128-bit AES key
    aes_iv = os.urandom(16)    # 128-bit IV for CBC mode
    
    # Encode key and IV in standard Base64 for the payload
    aes_key_b64 = base64.b64encode(aes_key).decode()
    aes_iv_b64 = base64.b64encode(aes_iv).decode()

    # Step 4: Build the plaintext credential payload
    credential_payload = (
        f"userhash={user_hash}&"
        f"RandomKeyhash={random_key_hash}&"
        f"response={password_encoded}&"
        f"nonce={url_safe_base64_encode(nonce)}&"
        f"enckey={url_safe_base64_encode(aes_key_b64)}&"
        f"enciv={url_safe_base64_encode(aes_iv_b64)}&"
        f"nohash={no_hash_flag}&"
        f"hPassword=undefined"
    )

    # Step 5: Encrypt credential payload with AES-CBC
    encrypted_credentials = aes_cbc_encrypt(aes_key, aes_iv, credential_payload.encode())

    # Step 6: Encrypt AES key and IV with RSA public key
    rsa_plaintext = f"{aes_key_b64} {aes_iv_b64}".encode()
    encrypted_key_iv = rsa_public_key.encrypt(rsa_plaintext, padding.PKCS1v15())

    # Step 7: Build final POST body with encrypted data
    post_body = (
        "encrypted=1&"
        f"ct={url_safe_base64_encode(base64.b64encode(encrypted_credentials).decode())}&"
        f"ck={url_safe_base64_encode(base64.b64encode(encrypted_key_iv).decode())}"
    )
    
    return session.post(f"{BASE}/login_web_app.cgi", data=post_body)


if __name__ == "__main__":
    # Create configured session and perform login
    session = create_session()
    login_response = login(session)
    print("status:", login_response.status_code)
    print("body:", login_response.text[:400])

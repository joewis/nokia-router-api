#!/home/carl/.winrm-venv/bin/python
"""
Nokia 3121 Cell Management - Raw Response Debug

This script queries the cell management endpoint using both GET and POST
methods to inspect the raw HTTP responses. Useful for debugging and
understanding the router's response format.

Credentials should be provided via environment variable:
- NOKIA_PASS (required, NOKIA_USER defaults to "admin")
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

# Credentials
USER = "admin"
PASS = os.environ.get("NOKIA_PASS", "")


def perform_login(session: requests.Session) -> dict:
    """
    Authenticates with the router and returns session credentials.
    
    Args:
        session: A configured requests Session instance.
        
    Returns:
        Dictionary containing 'token' (CSRF token) and 'sid' (session ID).
    """
    # Request crypto challenge from router
    challenge_response = session.post(
        f"{BASE}/login_web_app.cgi?nonce", 
        data=f"userName={USER}"
    )
    challenge_data = challenge_response.json()
    
    # Extract challenge parameters
    public_key_pem = challenge_data["pubkey"]
    salt = challenge_data["salt"]
    nonce = challenge_data["nonce"]
    random_key = challenge_data["randomKey"]
    
    # Load RSA public key
    rsa_public_key = serialization.load_pem_public_key(public_key_pem.encode())
    
    # Hash password with SHA-256 crypt
    password_hashed = sha256_crypt(PASS, salt)
    password_encoded = requests.utils.quote(password_hashed, safe="")
    
    # Generate random AES key and IV
    aes_key = os.urandom(16)
    aes_iv = os.urandom(16)
    aes_key_b64 = base64.b64encode(aes_key).decode()
    aes_iv_b64 = base64.b64encode(aes_iv).decode()
    
    # Build credential payload
    credential_payload = (
        f"userhash={USER}&"
        f"RandomKeyhash={random_key}&"
        f"response={password_encoded}&"
        f"nonce={url_safe_base64_encode(nonce.encode())}&"
        f"enckey={url_safe_base64_encode(aes_key_b64.encode())}&"
        f"enciv={url_safe_base64_encode(aes_iv_b64.encode())}&"
        f"nohash=1&"
        f"hPassword=undefined"
    )
    
    # Encrypt credentials with AES-CBC
    encrypted_credentials = aes_cbc_encrypt(aes_key, aes_iv, credential_payload.encode())
    
    # Encrypt AES key/IV with RSA public key
    rsa_plaintext = f"{aes_key_b64} {aes_iv_b64}".encode()
    encrypted_key_iv = rsa_public_key.encrypt(rsa_plaintext, padding.PKCS1v15())
    
    # Submit login request
    login_body = (
        "encrypted=1&"
        f"ct={url_safe_base64_encode(base64.b64encode(encrypted_credentials).decode().encode())}&"
        f"ck={url_safe_base64_encode(base64.b64encode(encrypted_key_iv).decode().encode())}"
    )
    
    login_response = session.post(f"{BASE}/login_web_app.cgi", data=login_body)
    return login_response.json()


# Main execution
if __name__ == "__main__":
    # Create session and authenticate
    session = create_session()
    login_data = perform_login(session)
    csrf_token = login_data["token"]
    
    # Test both GET and POST methods
    endpoint = f"{BASE}/cell_management_get_web_app.cgi"
    
    for method in ["GET", "POST"]:
        print(f"=== {method} Method ===")
        
        if method == "GET":
            # GET request with CSRF token in query string
            response = session.get(
                f"{endpoint}?csrf_token={csrf_token}", 
                timeout=15
            )
        else:
            # POST request with CSRF token in body
            response = session.post(
                endpoint, 
                data=f"csrf_token={csrf_token}", 
                timeout=15
            )
        
        # Display response details
        print(f"Status Code: {response.status_code}")
        print(f"Headers (first 6): {dict(list(response.headers.items())[:6])}")
        print(f"Content (first 400 bytes): {repr(response.content[:400])}")
        print()

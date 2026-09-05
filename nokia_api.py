#!/home/carl/.winrm-venv/bin/python
"""
Nokia 3121 (Beacon 2) Authenticated API Access

This module provides authenticated access to the Nokia router's data endpoints.
It handles the complete authentication flow and session management, allowing
you to query various router status and configuration endpoints.

Usage: python nokia_api.py [endpoint]
  endpoint: One of the predefined endpoints (clients, devices, routerinfo, 
            status, troubleshoot) or a custom endpoint name
  
Returns JSON from the router's authenticated data endpoints.

Credentials should be provided via environment variables:
- NOKIA_USER (default: "admin")
- NOKIA_PASS (required)
"""

import base64
import json
import os
import sys

import requests
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import serialization

from nokia_crypto import url_safe_base64_encode, sha256_crypt, aes_cbc_encrypt
from nokia_http import create_session, tolerant_json_decode, extract_body_content

# Router base URL
BASE = "https://192.168.18.1"

# Credentials from environment variables
USER = os.environ.get("NOKIA_USER", "admin")
PASS = os.environ.get("NOKIA_PASS", "")

# Predefined endpoint mappings - friendly names to actual CGI script names
ENDPOINTS = {
    "clients": "device_home_nw_client_status_web_app.cgi",
    "devices": "dashboard_device_status_web_app.cgi",
    "routerinfo": "main_web_app.cgi",
    "status": "dashboard_status_web_app.cgi",
    "troubleshoot": "troubleshooting_web_app.cgi",
}


def login(session: requests.Session) -> dict:
    """
    Performs authentication handshake and returns session credentials.
    
    This function executes the complete login flow:
    1. Requests nonce and crypto parameters from router
    2. Hashes password with SHA-256 crypt
    3. Encrypts credentials with AES-CBC
    4. Encrypts AES key/IV with RSA public key
    5. Submits encrypted credentials
    6. Returns session ID and CSRF token on success
    
    Args:
        session: A configured requests Session instance.
        
    Returns:
        Dictionary containing session credentials including 'sid' (session ID)
        and 'token' (CSRF token) for subsequent authenticated requests.
    """
    # Step 1: Request nonce and crypto parameters
    challenge_response = session.post(
        f"{BASE}/login_web_app.cgi?nonce", 
        data=f"userName={USER}"
    )
    challenge_data = challenge_response.json()
    
    # Extract crypto parameters from challenge
    nonce = challenge_data["nonce"]
    random_key = challenge_data["randomKey"]
    salt = challenge_data["salt"]
    public_key_pem = challenge_data["pubkey"]
    
    # Load RSA public key for encrypting AES credentials
    rsa_public_key = serialization.load_pem_public_key(public_key_pem.encode())
    
    # Step 2: Hash password using SHA-256 crypt
    password_hashed = sha256_crypt(PASS, salt)
    password_encoded = requests.utils.quote(password_hashed, safe="")
    
    # Step 3: Generate random AES key and IV
    aes_key = os.urandom(16)
    aes_iv = os.urandom(16)
    aes_key_b64 = base64.b64encode(aes_key).decode()
    aes_iv_b64 = base64.b64encode(aes_iv).decode()
    
    # Step 4: Build credential payload
    credential_payload = (
        f"userhash={USER}&"
        f"RandomKeyhash={random_key}&"
        f"response={password_encoded}&"
        f"nonce={url_safe_base64_encode(nonce)}&"
        f"enckey={url_safe_base64_encode(aes_key_b64)}&"
        f"enciv={url_safe_base64_encode(aes_iv_b64)}&"
        f"nohash=1&"
        f"hPassword=undefined"
    )
    
    # Step 5: Encrypt credentials with AES-CBC
    encrypted_credentials = aes_cbc_encrypt(aes_key, aes_iv, credential_payload.encode())
    
    # Step 6: Encrypt AES key/IV with RSA public key
    rsa_plaintext = f"{aes_key_b64} {aes_iv_b64}".encode()
    encrypted_key_iv = rsa_public_key.encrypt(rsa_plaintext, padding.PKCS1v15())
    
    # Step 7: Build and submit login request
    login_body = (
        "encrypted=1&"
        f"ct={url_safe_base64_encode(base64.b64encode(encrypted_credentials).decode())}&"
        f"ck={url_safe_base64_encode(base64.b64encode(encrypted_key_iv).decode())}"
    )
    
    login_response = session.post(f"{BASE}/login_web_app.cgi", data=login_body)
    return login_response.json()


def get(endpoint: str, extra_query: str = "") -> dict:
    """
    Makes an authenticated request to a router endpoint.
    
    This function handles the complete request flow:
    1. Creates a new session
    2. Performs authentication to get session credentials
    3. Sets session cookie and CSRF token
    4. Makes POST request to the specified endpoint
    5. Parses the response (handling malformed JSON)
    
    Args:
        endpoint: The CGI endpoint name or full path.
        extra_query: Optional additional query parameters.
        
    Returns:
        Parsed JSON response as dictionary, or raw string if parsing fails.
    """
    # Create new session for this request
    session = create_session()
    
    # Authenticate and get session credentials
    auth_data = login(session)
    
    # Set authentication cookie from login response
    session.cookies.set("sid", auth_data["sid"])
    
    # Build full URL with optional extra query parameters
    url = f"{BASE}/{endpoint}{extra_query}"
    
    # Make authenticated POST request with CSRF token
    response = session.post(
        url, 
        data=f"csrf_token={auth_data['token']}", 
        timeout=20
    )
    
    # Extract body content (strip any headers if present)
    body_bytes = extract_body_content(response)
    
    # Parse JSON response, falling back to tolerant parser for malformed JSON
    try:
        return json.loads(body_bytes)
    except json.JSONDecodeError:
        return tolerant_json_decode(body_bytes)


if __name__ == "__main__":
    # Get endpoint name from command line argument (default: "clients")
    endpoint_name = sys.argv[1] if len(sys.argv) > 1 else "clients"
    extra_params = sys.argv[2] if len(sys.argv) > 2 else ""
    
    # Resolve endpoint name to actual CGI script path
    endpoint_path = ENDPOINTS.get(endpoint_name, endpoint_name)
    
    # Fetch data from router
    result = get(endpoint_path, extra_params)
    
    # Output formatted result
    if isinstance(result, dict):
        print(json.dumps(result, indent=1)[:4000])
    else:
        print(str(result)[:4000])

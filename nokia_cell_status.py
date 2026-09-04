#!/home/carl/.winrm-venv/bin/python
"""Pull cellular/WAN state from the Nokia 3121 router.

This script authenticates with the router and retrieves:
- Cellular signal information (cell_management endpoint)
- WAN connection status and IP connection details
"""
import base64
import json
import os

import requests
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import serialization

from nokia_crypto import url_safe_base64_encode, sha256_crypt, aes_cbc_encrypt
from nokia_http import create_session, tolerant_json_decode, extract_body_content

# Router configuration
BASE_URL = "https://192.168.18.1"
USERNAME = "admin"
PASSWORD = os.environ.get("NOKIA_PASS", "")


def authenticate_router(session, base_url, username, password):
    """Perform the cryptographic handshake to authenticate with the router.
    
    Args:
        session: Requests session object
        base_url: Router base URL
        username: Admin username
        password: Admin password
        
    Returns:
        CSRF token for authenticated requests, or None if authentication fails
    """
    # Step 1: Request nonce and public key from router
    response = session.post(
        f"{base_url}/login_web_app.cgi?nonce",
        data=f"userName={username}"
    )
    auth_data = response.json()
    
    # Step 2: Load router's RSA public key
    router_public_key = serialization.load_pem_public_key(
        auth_data["pubkey"].encode()
    )
    
    # Step 3: Hash password with router-provided salt using SHA-256 crypt
    password_hashed = sha256_crypt(password, auth_data["salt"])
    
    # Step 4: URL-encode the hashed password
    password_encoded = requests.utils.quote(password_hashed, safe="")
    
    # Step 5: Generate random AES key and IV for encrypting credentials
    aes_key = os.urandom(16)
    aes_iv = os.urandom(16)
    aes_key_b64 = base64.b64encode(aes_key).decode()
    aes_iv_b64 = base64.b64encode(aes_iv).decode()
    
    # Step 6: Build form data with credentials and encryption parameters
    form_data = (
        f"userhash={username}&RandomKeyhash={auth_data['randomKey']}"
        f"&response={password_encoded}&nonce={url_safe_base64_encode(auth_data['nonce'])}"
        f"&enckey={url_safe_base64_encode(aes_key_b64)}"
        f"&enciv={url_safe_base64_encode(aes_iv_b64)}&nohash=1&hPassword=undefined"
    )
    
    # Step 7: Encrypt form data with AES-CBC
    encrypted_form = aes_cbc_encrypt(aes_key, aes_iv, form_data.encode())
    
    # Step 8: Encrypt AES key and IV with router's RSA public key
    encrypted_key = router_public_key.encrypt(
        f"{aes_key_b64} {aes_iv_b64}".encode(),
        padding.PKCS1v15()
    )
    
    # Step 9: Build final request body with encrypted payload
    request_body = (
        "encrypted=1&ct=" + url_safe_base64_encode(base64.b64encode(encrypted_form).decode())
        + "&ck=" + url_safe_base64_encode(base64.b64encode(encrypted_key).decode())
    )
    
    # Step 10: Submit authentication and extract CSRF token
    auth_response = session.post(f"{base_url}/login_web_app.cgi", data=request_body)
    return auth_response.json()["token"]


def make_authenticated_request(session, base_url, endpoint, csrf_token, method="POST"):
    """Make an authenticated request to a router endpoint.
    
    Args:
        session: Requests session object
        base_url: Router base URL
        endpoint: API endpoint path
        csrf_token: CSRF token from authentication
        method: HTTP method ("GET" or "POST")
        
    Returns:
        Parsed JSON response, or error message string on failure
    """
    try:
        if method == "GET":
            response = session.get(
                f"{base_url}/{endpoint}?csrf_token={csrf_token}",
                timeout=15
            )
        else:
            response = session.post(
                f"{base_url}/{endpoint}",
                data=f"csrf_token={csrf_token}",
                timeout=15
            )
        
        # Extract body content from response
        body_content = extract_body_content(response)
        if not body_content:
            return None
            
        # Parse potentially malformed JSON
        return tolerant_json_decode(body_content)
        
    except Exception as exception:
        return f"ERR {type(exception).__name__}: {str(exception)[:120]}"


def print_cellular_info(session, base_url, csrf_token):
    """Fetch and print cellular signal information.
    
    Args:
        session: Requests session object
        base_url: Router base URL
        csrf_token: CSRF token for authentication
    """
    print("=== CELL INFO (cellular signal) ===")
    cell_data = make_authenticated_request(
        session, base_url, "cell_management_get_web_app.cgi", 
        csrf_token, method="GET"
    )
    
    if isinstance(cell_data, dict):
        # Print first 3000 chars to avoid overwhelming output
        print(json.dumps(cell_data, indent=1)[:3000])
    else:
        print(cell_data)


def print_wan_status(session, base_url, csrf_token):
    """Fetch and print WAN connection status.
    
    Args:
        session: Requests session object
        base_url: Router base URL
        csrf_token: CSRF token for authentication
    """
    print("\n=== WAN / IP conn status ===")
    status_data = make_authenticated_request(
        session, base_url, "troubleshooting_status_web_app.cgi", 
        csrf_token
    )
    
    if isinstance(status_data, dict):
        wan_connections = status_data.get("wan_conns", [])
        for wan_connection in wan_connections:
            ip_connections = wan_connection.get("ipConns", [])
            for ip_connection in ip_connections:
                connection_name = ip_connection.get('Name')
                connection_status = ip_connection.get('ConnectionStatus')
                connection_type = ip_connection.get('ConnectionType')
                uptime_seconds = ip_connection.get('Uptime')
                
                print(
                    f"  name={connection_name} "
                    f"status={connection_status} "
                    f"type={connection_type} "
                    f"uptime={uptime_seconds}s"
                )
    else:
        print(status_data)


if __name__ == "__main__":
    # Create HTTP session with SSL verification disabled
    session = create_session()
    
    # Authenticate and get CSRF token
    csrf_token = authenticate_router(
        session, BASE_URL, USERNAME, PASSWORD
    )
    
    # Fetch and display cellular info
    print_cellular_info(session, BASE_URL, csrf_token)
    
    # Fetch and display WAN status
    print_wan_status(session, BASE_URL, csrf_token)

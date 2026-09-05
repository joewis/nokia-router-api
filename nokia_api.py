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

# Predefined endpoint mappings - friendly names to actual CGI script names.
# Read-only *_status_web_app.cgi endpoints confirmed live on this firmware
# (2026-09-06, via capabilities_status_web_app.cgi -> authorizedcgi + probe).
# Destructive / state-changing endpoints are listed at the bottom, commented out.
ENDPOINTS = {
    # --- Core / dashboard ---
    "clients": "device_home_nw_client_status_web_app.cgi",
    "devices": "dashboard_device_status_web_app.cgi",
    "routerinfo": "main_web_app.cgi",
    "device_info": "device_status_web_app.cgi?getroot",
    "status": "dashboard_status_web_app.cgi",
    "troubleshoot": "troubleshooting_web_app.cgi",
    "troubleshoot_status": "troubleshooting_status_web_app.cgi",
    "capabilities": "capabilities_status_web_app.cgi",
    "network_topology": "dashboard_ntwtopo_status_web_app.cgi",
    "home_network": "device_home_network_status_web_app.cgi",
    "check_expire": "check_expire_web_app.cgi",
    "container_management": "container_management_status_web_app.cgi",

    # --- WAN / internet ---
    "wan_internet": "wan_internet_status_web_app.cgi",
    "wan_config": "wan_config_glb_status_web_app.cgi",
    "wan_show": "show_wan_status_web_app.cgi",
    "ddns": "ddns_status_web_app.cgi",
    "sntp": "sntp_status_web_app.cgi",
    "upnp": "upnp_status_web_app.cgi",

    # --- LAN / DHCP ---
    "lan_ipv4": "lan_ipv4_status_web_app.cgi",
    "lan_ipv6": "lan_ipv6_status_web_app.cgi",
    "lan_status": "lan_status_web_app.cgi",
    "domain_route": "domain_route_status_web_app.cgi",

    # --- WiFi / mesh ---
    "wlan_config": "wlan_config_status_web_app.cgi",
    "wlan_guest": "wlan_config_guest_status_web_app.cgi",
    "mesh": "mesh_status_web_app.cgi",
    "beacon_mode": "whw_beacon_mode_app_status_web_app.cgi",

    # --- Security / filtering ---
    "macfilter": "macfilter_status_web_app.cgi",
    "ipfilter": "ipfilter_status_web_app.cgi",
    "firewall": "firewall_status_web_app.cgi",
    "parental_control": "parental_ctrl_status_web_app.cgi",

    # --- Device / admin ---
    "device_name": "device_name_status_web_app.cgi",
    "password": "password_status_web_app.cgi",
    "ledctrl": "ledctrl_status_web_app.cgi",
    "web_customization": "web_customization_web_app.cgi",

    # --- Diagnostics / stats ---
    "statistics": "statistics_status_web_app.cgi",
    "diag": "diag_status_web_app.cgi",
    "qos": "qos_status_web_app.cgi",
    "nat": "nat_glb_status_web_app.cgi",
    "log": "log_status_web_app.cgi",
    "log_info": "log_status_web_app.cgi?info",
    "log_vlog": "log_status_web_app.cgi?vlog_glb",

    # --- Destructive / state-changing endpoints (DO NOT enable without explicit need) ---
    # "reboot": "reboot_web_app.cgi",
    # "restore": "restore_web_app.cgi?restore_glb",
    # "restore_factory": "restore_web_app.cgi?deep_factory",
    # "upgrade": "upgrade_web_app.cgi",
    # "command_cat": "command_web_app.cgi?cat",
    # "command_pexist": "command_web_app.cgi?pexist",
    # "diag_ping": "diag_web_app.cgi?ping",
    # "diag_cancel": "diag_web_app.cgi?cancel",
    # "troubleshoot_ping": "troubleshooting_web_app.cgi?ping",
    # "troubleshoot_latency": "troubleshooting_web_app.cgi?latencytest",
    # "troubleshoot_dns": "troubleshooting_web_app.cgi?dnsrestest",
    # "troubleshoot_us_throughput": "troubleshooting_web_app.cgi?usthroughputtest",
    # "troubleshoot_ds_throughput": "troubleshooting_web_app.cgi?dsthroughputtest",
    # "troubleshoot_us_packetloss": "troubleshooting_web_app.cgi?uspacketloss",
    # "troubleshoot_ds_packetloss": "troubleshooting_web_app.cgi?dspacketloss",
    # "troubleshoot_port_mirror": "troubleshooting_web_app.cgi?v=port_mirror",
    # "troubleshoot_del_port_mirror": "troubleshooting_web_app.cgi?v=del_portmirror",
    # "password_set": "password_web_app.cgi?set",
    # "device_name_add": "device_name_web_app.cgi?add",
    # "device_name_del": "device_name_web_app.cgi?act=del",
    # "lan_ipv4_config": "lan_ipv4_web_app.cgi?config",
    # "lan_ipv4_bindmac": "lan_ipv4_web_app.cgi?bindmac",
    # "lan_ipv4_del": "lan_ipv4_web_app.cgi?act=del",
    # "wlan_config_glb": "wlan_config_web_app.cgi?do_config_glb",
    # "wlan_config_glb11ac": "wlan_config_web_app.cgi?do_config_glb11ac",
    # "wlan_guest_config": "wlan_config_guest_web_app.cgi?ConfigWhwGuest",
    # "wlan_wps_status": "wlan_config_web_app.cgi?wps_status",
    # "wlan_wps_pin": "wlan_config_web_app.cgi?pin_get",
    # "wlan_wps_pbc": "wlan_config_web_app.cgi?pbc",
    # "wlan_wps_sta_pin": "wlan_config_web_app.cgi?sta_pin",
    # "wlan_wps_ap_pin": "wlan_config_web_app.cgi?ap_pin",
    # "mesh_add": "mesh_web_app.cgi?add",
    # "mesh_del": "mesh_web_app.cgi?del",
    # "mesh_set": "mesh_web_app.cgi?v_glb=set",
    # "qos_add": "qos_web_app.cgi?v=add",
    # "qos_del_gfast": "qos_web_app.cgi?v=del_gfast",
    # "nat_add_vhost": "nat_glb_web_app.cgi?v=add_vhost",
    # "nat_del_vhost": "nat_glb_web_app.cgi?v=del_vhost",
    # "nat_add_thost": "nat_glb_web_app.cgi?v=add_thost",
    # "nat_del_thost": "nat_glb_web_app.cgi?v=del_thost",
    # "nat_cfg_alg": "nat_glb_web_app.cgi?v=cfg_alg",
    # "nat_cfg_dmz": "nat_glb_web_app.cgi?v=cfg_dmz",
    # "ddns_add": "ddns_web_app.cgi?add_glb",
    # "upnp_config": "upnp_web_app.cgi?config_glb",
    # "firewall_set": "firewall_web_app.cgi?fire",
    # "firewall_level": "firewall_web_app.cgi?level_name",
    # "macfilter_add_ethernet": "macfilter_web_app.cgi?add_ethernet",
    # "macfilter_del_ethernet": "macfilter_web_app.cgi?act=del_ethernet",
    # "macfilter_add_wlan": "macfilter_web_app.cgi?add_wlan",
    # "macfilter_del_wlan": "macfilter_web_app.cgi?act=del_wlan",
    # "ipfilter_set": "ipfilter_web_app.cgi?v_glb=set",
    # "ipfilter_add": "ipfilter_web_app.cgi?add_glb",
    # "ipfilter_del": "ipfilter_web_app.cgi?v_glb=delip",
    # "parental_control_set": "parental_ctrl_web_app.cgi",
    # "ledctrl_set": "ledctrl_web_app.cgi?SetLedGlb",
    # "log_set": "log_web_app.cgi?set_log_glb",
    # "domain_route_add": "domain_route_web_app.cgi?add_domainRouteData",
    # "domain_route_del": "domain_route_web_app.cgi?act=del",
    # "domain_route_enable": "domain_route_web_app.cgi?enable",
    # "lan_add_client_alias": "lan_status_web_app.cgi?add_client_alias",
    # "lan_del": "lan_status_web_app.cgi?del",
    # "lan_del_dom": "lan_status_web_app.cgi?delDom",
    # "wan_config_b": "wan_config_glb_b_web_app.cgi?config",
    # "beacon_mode_set": "whw_beacon_mode_app_web_app.cgi",
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

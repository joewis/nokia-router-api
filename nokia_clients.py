#!/home/carl/.winrm-venv/bin/python
"""
Retrieve and display connected client information from the Nokia 3121 router.

This script fetches two types of client data:
1. Known devices from the ARP/lease table (configured devices)
2. Live clients currently connected via WiFi or Ethernet

Output is formatted as tables showing hostname, MAC address, IP, and connection type.
"""
import os
import sys

# Add the script directory to path for local imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from nokia_api import get, ENDPOINTS


def build_known_devices_table(device_data):
    """
    Build a dictionary of known devices from the router's device configuration.
    
    Args:
        device_data: Raw response from the devices endpoint
        
    Returns:
        dict: Mapping of device keys (MAC or hostname) to tuples of (hostname, mac, active_status)
    """
    known_devices = {}
    
    if not isinstance(device_data, dict):
        return known_devices
    
    for device in device_data.get("device_cfg", []):
        hostname = str(device.get("HostName", "?"))
        mac_address = str(device.get("MACAddress", "?"))
        is_active = device.get("Active")
        
        # Use lowercase MAC as key if available, otherwise use hostname
        device_key = mac_address.lower() if mac_address != "?" else hostname
        known_devices[device_key] = (hostname, mac_address, is_active)
    
    return known_devices


def resolve_hostname_from_mac(mac_address, known_devices):
    """
    Resolve a hostname for a given MAC address using the known devices table.
    
    Handles various MAC formats and "Unknown_XX:XX:XX" naming patterns.
    
    Args:
        mac_address: MAC address to resolve (may contain dashes or colons)
        known_devices: Dictionary of known devices from build_known_devices_table()
        
    Returns:
        str: Resolved hostname or "?" if not found
    """
    # Normalize MAC to lowercase with colons
    normalized_mac = mac_address.replace("-", ":").lower()
    
    # Direct lookup by MAC
    if normalized_mac in known_devices:
        return known_devices[normalized_mac][0]
    
    # Search through known devices for matching MAC
    for key, (hostname, known_mac, _) in known_devices.items():
        if known_mac != "?":
            normalized_known_mac = known_mac.replace("-", ":").lower()
            # Match by configured MAC address
            if normalized_known_mac == normalized_mac:
                return hostname
            # Match by "Unknown_XX:XX:XX" pattern
            if hostname.startswith("Unknown_") and hostname[8:].replace("-", ":").lower() == normalized_mac:
                return hostname
    
    return "?"


def collect_live_clients(client_data):
    """
    Extract live client information from WiFi access points and Ethernet connections.
    
    Args:
        client_data: Raw response from the clients endpoint
        
    Returns:
        list: List of tuples (hostname, ip_address, mac_address, connection_type)
    """
    live_clients = []
    
    if not isinstance(client_data, dict):
        return live_clients
    
    # Iterate through all access points
    for access_point in client_data.get("aps", []):
        for ap_id, ap_info in access_point.items():
            if not isinstance(ap_info, dict):
                continue
            
            # Collect Ethernet clients
            ethernet_clients = ap_info.get("ethernet-clients", [])
            for client_entry in ethernet_clients:
                if isinstance(client_entry, dict):
                    for mac_address, client_info in client_entry.items():
                        hostname = client_info.get("hostname", "?")
                        ip_address = client_info.get("ip-address", "?")
                        live_clients.append((hostname, ip_address, mac_address, "eth"))
            
            # Collect WiFi clients from all radios and SSIDs
            radios = ap_info.get("radios", [])
            for radio in radios:
                ssids = radio.get("ssids", [])
                for ssid_config in ssids:
                    ssid_name = ssid_config.get("ssid", "?")
                    clients = ssid_config.get("clients", [])
                    for client_entry in clients:
                        if isinstance(client_entry, dict):
                            for mac_address, client_info in client_entry.items():
                                hostname = client_info.get("hostname", "?")
                                ip_address = client_info.get("ip-address", "?")
                                connection_type = f'wifi[{ssid_name}]'
                                live_clients.append((hostname, ip_address, mac_address, connection_type))
    
    return live_clients


def print_known_devices_table(known_devices):
    """Print the known devices table."""
    print("=== KNOWN DEVICES (ARP/lease table) ===")
    print(f"{'HOSTNAME':30s} {'MAC':20s} ACTIVE")
    
    for hostname, mac_address, is_active in known_devices.values():
        print(f"{hostname[:30]:30s} {mac_address[:20]:20s} {is_active}")


def print_live_clients_table(live_clients, known_devices):
    """Print the live clients table with resolved hostnames."""
    print(f"\n=== LIVE CLIENTS ({len(live_clients)}) ===")
    print(f"{'HOSTNAME':30s} {'IP':16s} {'MAC':20s} TYPE")
    
    for hostname, ip_address, mac_address, connection_type in live_clients:
        # Resolve hostname from MAC if not available
        resolved_hostname = hostname if hostname != "?" else resolve_hostname_from_mac(mac_address, known_devices)
        print(f"{str(resolved_hostname)[:30]:30s} {str(ip_address)[:16]:16s} {str(mac_address)[:20]:20s} {connection_type}")


def main():
    """Main entry point: fetch data and display client tables."""
    # Fetch known devices from ARP/lease table
    device_response = get(ENDPOINTS["devices"])
    known_devices = build_known_devices_table(device_response)
    
    # Fetch live clients from WiFi/Ethernet
    client_response = get(ENDPOINTS["clients"])
    live_clients = collect_live_clients(client_response)
    
    # Display results
    print_known_devices_table(known_devices)
    print_live_clients_table(live_clients, known_devices)


if __name__ == "__main__":
    main()

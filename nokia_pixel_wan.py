#!/home/carl/.winrm-venv/bin/python
"""
Retrieve WiFi client details and WAN IP information from the Nokia 3121 router.

This script fetches two types of data:
1. Live client radio/signal details (band, channel, SSID, RSSI, rate) for all
   connected clients.
2. WAN IP connection details (status, IP, uptime, gateway, DNS) for the
   double-NAT check.

Output is formatted as readable tables.
"""
import os
import sys

# Add the script directory to path for local imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from nokia_api import get, ENDPOINTS


def collect_client_radio_details(client_data):
    """
    Extract radio and signal details for all connected WiFi clients.

    Args:
        client_data: Raw response from the clients endpoint.

    Returns:
        list: List of dicts with mac, band, channel, ssid, ip, state, rssi, rate.
    """
    details = []

    if not isinstance(client_data, dict):
        return details

    for access_point in client_data.get("aps", []):
        for ap_id, ap_info in access_point.items():
            if not isinstance(ap_info, dict):
                continue
            for radio in ap_info.get("radios", []):
                band = radio.get("medium", "?")
                channel = radio.get("channel", "?")
                for ssid_config in radio.get("ssids", []):
                    ssid_name = ssid_config.get("ssid", "?")
                    for client_entry in ssid_config.get("clients", []):
                        if isinstance(client_entry, dict):
                            for mac_address, client_info in client_entry.items():
                                details.append({
                                    "mac": mac_address,
                                    "band": band,
                                    "channel": channel,
                                    "ssid": ssid_name,
                                    "ip": client_info.get("ip-address", "?"),
                                    "state": client_info.get("state", "?"),
                                    "rssi": client_info.get("rssi", client_info.get("signal", "?")),
                                    "rate": client_info.get("rate", client_info.get("phy-rate", "?")),
                                })
    return details


def collect_wan_connections(wan_data):
    """
    Extract WAN IP connection details for the double-NAT check.

    Args:
        wan_data: Raw response from the troubleshooting status endpoint.

    Returns:
        list: List of dicts with name, status, ip, uptime, gateway, dns.
    """
    connections = []

    if not isinstance(wan_data, dict):
        return connections

    for wan_conn in wan_data.get("wan_conns", []):
        for ip_conn in wan_conn.get("ipConns", []):
            connections.append({
                "name": ip_conn.get("Name", "?"),
                "status": ip_conn.get("ConnectionStatus", "?"),
                "ip": ip_conn.get("ExternalIPAddress", ip_conn.get("IPAddress", "?")),
                "uptime": ip_conn.get("Uptime", "?"),
                "gateway": ip_conn.get("DefaultGateway", ip_conn.get("DefaultGatewayIPAddress", "?")),
                "dns": ip_conn.get("DNSServers", ip_conn.get("DNS1", "?")),
            })
    return connections


def print_client_radio_table(details):
    """Print the client radio/signal details table."""
    print("=== CLIENT RADIO / SIGNAL DETAILS ===")
    print(f"{'MAC':20s} {'BAND':8s} {'CH':4s} {'SSID':16s} {'IP':16s} {'STATE':12s} {'RSSI':6s} RATE")
    for d in details:
        print(f"{d['mac'][:20]:20s} {str(d['band'])[:8]:8s} {str(d['channel'])[:4]:4s} "
              f"{str(d['ssid'])[:16]:16s} {str(d['ip'])[:16]:16s} {str(d['state'])[:12]:12s} "
              f"{str(d['rssi'])[:6]:6s} {d['rate']}")


def print_wan_table(connections):
    """Print the WAN IP connection details table."""
    print("\n=== WAN IP CONNECTIONS (double-NAT check) ===")
    for c in connections:
        print(f"  {c['name']}: status={c['status']} ip={c['ip']} "
              f"uptime={c['uptime']}s defaultgw={c['gateway']} dns={c['dns']}")


def main():
    """Main entry point: fetch and display client radio + WAN details."""
    client_response = get(ENDPOINTS["clients"])
    client_details = collect_client_radio_details(client_response)
    print_client_radio_table(client_details)

    wan_response = get(ENDPOINTS["troubleshoot_status"])
    wan_connections = collect_wan_connections(wan_response)
    print_wan_table(wan_connections)


if __name__ == "__main__":
    main()

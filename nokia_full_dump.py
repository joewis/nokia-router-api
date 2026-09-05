#!/home/carl/.winrm-venv/bin/python
"""Full client + WAN dump from Nokia 3121 router without truncation.

This script retrieves comprehensive information about:
- Access points and their configuration
- Connected WiFi clients with signal strength and state
- WAN connection details including IP addresses, gateways, and DNS
- Additional router status counters and metrics
"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import nokia_api as N


def print_access_points_and_clients(device_data):
    """Print access point information and connected WiFi clients.
    
    Args:
        device_data: Dictionary containing access point data from the router
    """
    access_points = device_data.get("aps", [])
    
    for access_point_list in access_points:
        # Each access point list contains a single dict keyed by AP ID
        for ap_id, access_point_info in access_point_list.items():
            ap_hostname = access_point_info.get('hostname')
            ap_mac = access_point_info.get('mac-address')
            ap_ip = access_point_info.get('ip-address')
            ap_uptime_seconds = access_point_info.get('uptime-sec')
            is_backhaul_connected = access_point_info.get('is-backhaul-connected')
            
            print(
                f"AP {ap_hostname} "
                f"mac={ap_mac} "
                f"ip={ap_ip} "
                f"up={ap_uptime_seconds}s "
                f"backhaul={is_backhaul_connected}"
            )
            
            # Iterate through radios on this access point
            radios = access_point_info.get("radios", [])
            for radio in radios:
                ssids = radio.get("ssids", [])
                for ssid_config in ssids:
                    ssid_name = ssid_config.get('ssid')
                    clients = ssid_config.get("clients", [])
                    
                    # Each client list contains dicts keyed by MAC address
                    for client_list in clients:
                        for mac_address, client_info in client_list.items():
                            sensing_data = client_info.get("sensing-data", {})
                            client_ip = client_info.get('ip-address')
                            client_state = client_info.get('state')
                            signal_rssi_dbm = sensing_data.get('rssi-dbm', '?')
                            disconnect_message = client_info.get('disconnect-message', '')
                            
                            print(
                                f"  CLIENT {mac_address} "
                                f"ssid={ssid_name} "
                                f"ip={client_ip} "
                                f"state={client_state} "
                                f"rssi={signal_rssi_dbm} "
                                f"disc={disconnect_message!r}"
                            )


def print_wan_details(status_data):
    """Print WAN connection details and additional status metrics.
    
    Args:
        status_data: Dictionary containing WAN and troubleshooting status data
    """
    wan_connections = status_data.get("wan_conns", [])
    
    for wan_connection in wan_connections:
        ip_connections = wan_connection.get("ipConns", [])
        
        for ip_connection in ip_connections:
            connection_name = ip_connection.get('Name')
            connection_status = ip_connection.get('ConnectionStatus')
            
            # Get external or internal IP address
            external_ip = ip_connection.get('ExternalIPAddress')
            internal_ip = ip_connection.get('IPAddress', '?')
            ip_address = external_ip if external_ip else internal_ip
            
            uptime_seconds = ip_connection.get('Uptime')
            
            # Get gateway address
            external_gateway = ip_connection.get('DefaultGateway')
            internal_gateway = ip_connection.get('DefaultGatewayIPAddress', '?')
            gateway_address = external_gateway if external_gateway else internal_gateway
            
            dns_servers = ip_connection.get('DNSServers', '?')
            
            print(
                f"  {connection_name}: "
                f"status={connection_status} "
                f"ip={ip_address} "
                f"uptime={uptime_seconds}s "
                f"gw={gateway_address} "
                f"dns={dns_servers}"
            )
    
    # Print any additional status keys that aren't wan_conns
    print("  --- other status keys ---")
    for key_name, key_value in status_data.items():
        if key_name != "wan_conns":
            print(f"  {key_name}: {key_value}")


if __name__ == "__main__":
    # Fetch device/home network client status
    device_data = N.get("device_home_nw_client_status_web_app.cgi")
    
    if isinstance(device_data, dict):
        print_access_points_and_clients(device_data)
    
    # Fetch WAN troubleshooting status
    print("\n=== WAN detail ===")
    status_data = N.get("troubleshooting_status_web_app.cgi")
    
    if isinstance(status_data, dict):
        print_wan_details(status_data)

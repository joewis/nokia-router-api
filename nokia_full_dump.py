#!/home/carl/.winrm-venv/bin/python
"""Full client + WAN dump from Nokia 3121 without truncation."""
import sys
sys.path.insert(0, "/home/carl/nokia-router")
import nokia_api as N

d = N.get("device_home_nw_client_status_web_app.cgi")
if isinstance(d, dict):
    for ap in d.get("aps", []):
        for ap_id, ap_info in ap.items():
            print(f"AP {ap_info.get('hostname')} mac={ap_info.get('mac-address')} ip={ap_info.get('ip-address')} up={ap_info.get('uptime-sec')}s backhaul={ap_info.get('is-backhaul-connected')}")
            for r_ in ap_info.get("radios", []):
                for ssid in r_.get("ssids", []):
                    for c in ssid.get("clients", []):
                        for mac, info in c.items():
                            sd = info.get("sensing-data", {})
                            print(f"  CLIENT {mac} ssid={ssid.get('ssid')} ip={info.get('ip-address')} state={info.get('state')} rssi={sd.get('rssi-dbm','?')} disc={info.get('disconnect-message','')!r}")

print("\n=== WAN detail ===")
st = N.get("troubleshooting_status_web_app.cgi")
if isinstance(st, dict):
    for wc in st.get("wan_conns", []):
        for ipc in wc.get("ipConns", []):
            print(f"  {ipc.get('Name')}: status={ipc.get('ConnectionStatus')} ip={ipc.get('ExternalIPAddress', ipc.get('IPAddress','?'))} uptime={ipc.get('Uptime')}s gw={ipc.get('DefaultGateway', ipc.get('DefaultGatewayIPAddress','?'))} dns={ipc.get('DNSServers','?')}")
    # any counters / errors
    print("  --- other status keys ---")
    for k in st:
        if k != "wan_conns":
            print(f"  {k}: {st[k]}")

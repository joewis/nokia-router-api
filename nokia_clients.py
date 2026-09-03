#!/home/carl/.winrm-venv/bin/python
"""Compact client table from the Nokia 3121."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from nokia_api import get, ENDPOINTS

# 1) known/ARP devices (hostname + MAC)
dev = get(ENDPOINTS["devices"])
known = {}
if isinstance(dev, dict):
    for d in dev.get("device_cfg", []):
        name = str(d.get("HostName", "?"))
        mac = str(d.get("MACAddress", "?"))
        known[mac.lower() if mac != "?" else name] = (name, mac, d.get("Active"))

# map MAC -> hostname from names like "Unknown_e8:c7:cf:50:e1:ce" or explicit MAC
def name_for_mac(mac):
    m = mac.replace("-", ":").lower()
    if m in known:
        return known[m][0]
    for k, (name, kmac, _) in known.items():
        if kmac != "?" and kmac.replace("-", ":").lower() == m:
            return name
        if name.startswith("Unknown_") and name[8:].replace("-", ":").lower() == m:
            return name
    return "?"

# 2) live WiFi/eth clients (MAC + connection)
live = []
cli = get(ENDPOINTS["clients"])
if isinstance(cli, dict):
    for ap in cli.get("aps", []):
        for ap_id, ap_info in ap.items():
            if not isinstance(ap_info, dict):
                continue
            for c in ap_info.get("ethernet-clients", []):
                if isinstance(c, dict):
                    for mac, info in c.items():
                        live.append((info.get("hostname", "?"), info.get("ip-address", "?"), mac, "eth"))
            for r in ap_info.get("radios", []):
                for ssid in r.get("ssids", []):
                    for c in ssid.get("clients", []):
                        if isinstance(c, dict):
                            for mac, info in c.items():
                                live.append((info.get("hostname", "?"), info.get("ip-address", "?"),
                                             mac, f'wifi[{ssid.get("ssid", "?")}]'))

print("=== KNOWN DEVICES (ARP/lease table) ===")
print(f"{'HOSTNAME':30s} {'MAC':20s} ACTIVE")
for name, mac, act in known.values():
    print(f"{name[:30]:30s} {mac[:20]:20s} {act}")
print(f"\n=== LIVE CLIENTS ({len(live)}) ===")
print(f"{'HOSTNAME':30s} {'IP':16s} {'MAC':20s} TYPE")
for host, ip, mac, t in live:
    name = host if host != "?" else name_for_mac(mac)
    print(f"{str(name)[:30]:30s} {str(ip)[:16]:16s} {str(mac)[:20]:20s} {t}")

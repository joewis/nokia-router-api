#!/home/carl/.winrm-venv/bin/python
"""Poll Pixel 10 (b0-d5-fb-cd-58-a9) signal metrics from Nokia 3121 over time.

Samples every INTERVAL seconds for DURATION, logging RSSI, tx/rx rates,
seconds-since-seen, association state and AP. Detects gaps (phone unseen),
RSSI dips and AP switches.
"""
import sys, time, json
sys.path.insert(0, "/home/carl/nokia-router")
import nokia_api as N

PHONE = "b0-d5-fb-cd-58-a9"
INTERVAL = 5   # seconds between samples
DURATION = 300 # total seconds (5 min)
MAX_SAMPLES = DURATION // INTERVAL

def sample():
    """Return phone metrics dict, or None if unseen."""
    try:
        d = N.get("device_home_nw_client_status_web_app.cgi")
        if not isinstance(d, dict):
            return None
        for ap in d.get("aps", []):
            for ap_id, ap_info in ap.items():
                for r_ in ap_info.get("radios", []):
                    for ssid in r_.get("ssids", []):
                        for c in ssid.get("clients", []):
                            for mac, info in c.items():
                                if mac.lower() == PHONE:
                                    sd = info.get("sensing-data", {})
                                    return {
                                        "ap_ip": ap_info.get("ip-address"),
                                        "bssid": ssid.get("bssid"),
                                        "ssid": ssid.get("ssid"),
                                        "state": info.get("state"),
                                        "rssi": sd.get("rssi-dbm"),
                                        "seen_s": sd.get("seconds-since-seen"),
                                        "tx_kbps": sd.get("data-rate-tx-kbps"),
                                        "rx_kbps": sd.get("data-rate-rx-kbps"),
                                        "metric": sd.get("metric"),
                                    }
        return None  # not in table at all
    except Exception as e:
        return {"error": str(e)}

print(f"Polling {PHONE} every {INTERVAL}s for {DURATION}s...", flush=True)
t0 = time.time()
rows = []
for i in range(MAX_SAMPLES):
    ts = time.time() - t0
    s = sample()
    rows.append((ts, s))
    if s:
        mark = "SEEN" if s.get("seen_s") == 0 else f"STALE({s.get('seen_s')}s)"
        print(f"[{ts:6.0f}s] {mark} rssi={s.get('rssi')}dBm tx={s.get('tx_kbps')}k rx={s.get('rx_kbps')}k "
              f"ap={s.get('ap_ip')} bssid={s.get('bssid')} state={s.get('state')}", flush=True)
    else:
        print(f"[{ts:6.0f}s] NOT IN TABLE", flush=True)
    time.sleep(INTERVAL)

# summary
print("\n=== SUMMARY ===", flush=True)
seen = [r for r in rows if r[1]]
notseen = [r for r in rows if not r[1]]
print(f"samples: {len(rows)}, seen: {len(seen)}, not-in-table: {len(notseen)}", flush=True)
if seen:
    rssis = [r[1].get("rssi") for r in seen if r[1].get("rssi") is not None]
    if rssis:
        print(f"rssi: min={min(rssis)}dBm max={max(rssis)}dBm avg={sum(rssis)/len(rssis):.1f}dBm", flush=True)
    aps = set((r[1].get("ap_ip"), r[1].get("bssid")) for r in seen if r[1].get("ap_ip"))
    print(f"APs seen: {aps}", flush=True)
    stale = [r for r in seen if r[1].get("seen_s") and r[1]["seen_s"] > 1]
    print(f"samples where phone stale (>1s since seen): {len(stale)}", flush=True)
    if stale:
        for ts, s in stale[:10]:
            print(f"  [{ts:.0f}s] seen_s={s.get('seen_s')} rssi={s.get('rssi')}", flush=True)

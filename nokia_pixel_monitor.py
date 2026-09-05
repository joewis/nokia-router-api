#!/home/carl/.winrm-venv/bin/python
"""
Poll Pixel 10 signal metrics from the Nokia 3121 router over time.

Samples every INTERVAL seconds for DURATION, logging RSSI, tx/rx rates,
seconds-since-seen, association state and AP. Detects gaps (phone unseen),
RSSI dips and AP switches.

Usage: python nokia_pixel_monitor.py [phone_mac]
  phone_mac: MAC address to monitor (default: b0-d5-fb-cd-58-a9)
"""
import os
import sys
import time

# Add the script directory to path for local imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from nokia_api import get, ENDPOINTS

PHONE = sys.argv[1] if len(sys.argv) > 1 else "b0-d5-fb-cd-58-a9"
INTERVAL = 5   # seconds between samples
DURATION = 300 # total seconds (5 min)
MAX_SAMPLES = DURATION // INTERVAL


def sample():
    """
    Return phone metrics dict, or None if unseen.

    Returns:
        dict: Phone signal metrics, or None if the phone is not in the table.
    """
    try:
        client_data = get(ENDPOINTS["clients"])
        if not isinstance(client_data, dict):
            return None
        for access_point in client_data.get("aps", []):
            for ap_id, ap_info in access_point.items():
                if not isinstance(ap_info, dict):
                    continue
                for radio in ap_info.get("radios", []):
                    for ssid_config in radio.get("ssids", []):
                        for client_entry in ssid_config.get("clients", []):
                            if isinstance(client_entry, dict):
                                for mac_address, client_info in client_entry.items():
                                    if mac_address.lower() == PHONE:
                                        sensing = client_info.get("sensing-data", {})
                                        return {
                                            "ap_ip": ap_info.get("ip-address"),
                                            "bssid": ssid_config.get("bssid"),
                                            "ssid": ssid_config.get("ssid"),
                                            "state": client_info.get("state"),
                                            "rssi": sensing.get("rssi-dbm"),
                                            "seen_s": sensing.get("seconds-since-seen"),
                                            "tx_kbps": sensing.get("data-rate-tx-kbps"),
                                            "rx_kbps": sensing.get("data-rate-rx-kbps"),
                                            "metric": sensing.get("metric"),
                                        }
        return None  # not in table at all
    except Exception as e:
        return {"error": str(e)}


def main():
    """Main entry point: poll the phone and print a summary."""
    print(f"Polling {PHONE} every {INTERVAL}s for {DURATION}s...", flush=True)
    start_time = time.time()
    rows = []
    for _ in range(MAX_SAMPLES):
        elapsed = time.time() - start_time
        metrics = sample()
        rows.append((elapsed, metrics))
        if metrics:
            mark = "SEEN" if metrics.get("seen_s") == 0 else f"STALE({metrics.get('seen_s')}s)"
            print(f"[{elapsed:6.0f}s] {mark} rssi={metrics.get('rssi')}dBm "
                  f"tx={metrics.get('tx_kbps')}k rx={metrics.get('rx_kbps')}k "
                  f"ap={metrics.get('ap_ip')} bssid={metrics.get('bssid')} "
                  f"state={metrics.get('state')}", flush=True)
        else:
            print(f"[{elapsed:6.0f}s] NOT IN TABLE", flush=True)
        time.sleep(INTERVAL)

    # summary
    print("\n=== SUMMARY ===", flush=True)
    seen = [r for r in rows if r[1]]
    not_seen = [r for r in rows if not r[1]]
    print(f"samples: {len(rows)}, seen: {len(seen)}, not-in-table: {len(not_seen)}", flush=True)
    if seen:
        rssis = [r[1].get("rssi") for r in seen if r[1].get("rssi") is not None]
        if rssis:
            print(f"rssi: min={min(rssis)}dBm max={max(rssis)}dBm "
                  f"avg={sum(rssis)/len(rssis):.1f}dBm", flush=True)
        aps = set((r[1].get("ap_ip"), r[1].get("bssid")) for r in seen if r[1].get("ap_ip"))
        print(f"APs seen: {aps}", flush=True)
        stale = [r for r in seen if r[1].get("seen_s") and r[1]["seen_s"] > 1]
        print(f"samples where phone stale (>1s since seen): {len(stale)}", flush=True)
        if stale:
            for elapsed, metrics in stale[:10]:
                print(f"  [{elapsed:.0f}s] seen_s={metrics.get('seen_s')} "
                      f"rssi={metrics.get('rssi')}", flush=True)


if __name__ == "__main__":
    main()

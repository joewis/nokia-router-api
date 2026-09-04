#!/usr/bin/env python3
"""HTTP session and JSON utilities for Nokia 3121 router API."""
import json
import re

import requests
import urllib3

urllib3.disable_warnings()


def create_session() -> requests.Session:
    """Create a configured requests Session for router communication."""
    s = requests.Session()
    s.verify = False
    s.headers["Content-Type"] = "application/x-www-form-urlencoded"
    return s


def tolerant_json(body: bytes) -> dict | str:
    """Parse router's malformed JSON (handles leading commas, etc.).
    
    The router emits TR-069-style invalid JSON with leading commas.
    Returns parsed dict on success, or raw string on failure.
    """
    txt = body.decode("utf-8", "replace")
    txt = re.sub(r"\[\s*,", "[", txt)
    txt = re.sub(r"\{\s*,", "{", txt)
    txt = re.sub(r",\s*([}\\]])", r"\1", txt)
    try:
        return json.loads(txt)
    except Exception:
        return txt


def extract_body_content(response: requests.Response) -> bytes:
    """Extract HTTP body from response, stripping headers if present."""
    content = response.content
    if b"\r\n\r\n" in content:
        return content.split(b"\r\n\r\n", 1)[1]
    return content

#!/usr/bin/env python3
"""
Nokia Beacon 2 HTTP and JSON Utilities

This module provides HTTP session management and JSON parsing utilities
for communicating with the Nokia 3121 (Beacon 2) router API. The router
has quirks like returning invalid JSON that requires special handling.
"""

import json
import re
from typing import Union

import requests
import urllib3

# Disable SSL warnings since we're connecting to a local router without valid certs
urllib3.disable_warnings()


def create_session() -> requests.Session:
    """
    Creates and configures a requests Session for router communication.
    
    The session is pre-configured with:
    - SSL verification disabled (router uses self-signed certificates)
    - Content-Type header set to application/x-www-form-urlencoded
    
    Returns:
        A configured requests.Session instance ready for use.
    """
    session = requests.Session()
    # Router uses self-signed HTTPS certificate, so disable verification
    session.verify = False
    # Default content type for form submissions to the router
    session.headers["Content-Type"] = "application/x-www-form-urlencoded"
    return session


def tolerant_json_decode(body: bytes) -> Union[dict, str]:
    """
    Parses the router's malformed JSON responses.
    
    The Nokia router emits TR-069-style invalid JSON that often contains
    syntax errors like leading commas in arrays/objects. This function
    applies regex-based fixes before attempting to parse.
    
    Fixes applied:
    - Removes leading commas in arrays: [, -> [
    - Removes leading commas in objects: {, -> {
    - Removes trailing commas before closing brackets: ,] -> ]
    
    Args:
        body: Raw bytes from the HTTP response body.
        
    Returns:
        A parsed dictionary if successful, or the raw decoded string if parsing fails.
        Returning the raw string allows callers to handle unexpected formats gracefully.
    """
    # Decode bytes to string, replacing any invalid characters
    text = body.decode("utf-8", "replace")
    
    # Fix common JSON malformations from the router
    # Remove leading commas in arrays
    text = re.sub(r"\[\s*,", "[", text)
    # Remove leading commas in objects  
    text = re.sub(r"\{\s*,", "{", text)
    # Remove trailing commas before closing brackets/braces
    text = re.sub(r",\s*([}\]])", r"\1", text)
    
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        # Return raw text if parsing fails, allowing caller to handle it
        return text


def extract_body_content(response: requests.Response) -> bytes:
    """
    Extracts the HTTP response body, handling cases where headers are included.
    
    Some router responses may include HTTP headers in the body content.
    This function strips any leading headers if present, returning only
    the actual body payload.
    
    Args:
        response: The requests Response object from an HTTP call.
        
    Returns:
        The raw bytes of the response body (without headers if they were present).
    """
    content = response.content
    
    # Check if response includes HTTP headers in the body
    # Headers end with \r\n\r\n sequence
    if b"\r\n\r\n" in content:
        # Split on header/body separator and take the body part
        return content.split(b"\r\n\r\n", 1)[1]
    
    return content

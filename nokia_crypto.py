#!/usr/bin/env python3
"""
Nokia Beacon 2 Cryptographic Utilities

This module handles the specific cryptographic operations required for the
Nokia 3121 (Beacon 2) router authentication handshake. It implements:
- SHA-256 based password hashing (Linux crypt style via openssl)
- AES-CBC encryption with PKCS7 padding
- URL-safe Base64 encoding (matching JavaScript implementation)
"""

import base64
import subprocess
from typing import Union

from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes


def url_safe_base64_encode(data: str) -> str:
    """
    Applies the JS base64url_escape character substitution to a base64 string.

    This is a PURE character substitution, NOT a base64 round-trip: it maps
    '+' -> '-', '/' -> '_', and '=' -> '.' on an already-encoded base64 string.
    The router expects this exact transformation (matching the JavaScript
    base64url_escape function). Do NOT base64-encode here — the input must
    already be a base64 string.

    Args:
        data: An already-base64-encoded string to apply the substitution to.

    Returns:
        The URL-safe base64 string with '.' instead of '=' padding.
    """
    return data.translate(str.maketrans("+/", "-_")).replace("=", ".")



def sha256_crypt(password: str, salt: str) -> str:
    """
    Generates a SHA-256 based hash compatible with Linux crypt($5$...).
    
    The Nokia router expects the password to be hashed using the SHA-256
    algorithm with a specific salt provided during the handshake.
    
    This implementation calls openssl passwd -5 to match the exact behavior
    of the Linux crypt() function with SHA-256.
    
    Args:
        password: The plain text password to hash.
        salt: The random salt string provided by the router.
        
    Returns:
        The formatted crypt string: $5${salt}${hash}
    """
    # Use openssl to generate SHA-256 crypt hash ($5$ prefix indicates SHA-256)
    result = subprocess.run(
        ["openssl", "passwd", "-5", "-salt", salt, password],
        capture_output=True, 
        text=True
    )
    return result.stdout.strip()


def aes_cbc_encrypt(key: bytes, iv: bytes, plaintext: bytes) -> bytes:
    """
    Encrypts data using AES-CBC with PKCS7 padding.
    
    This is used to encrypt the credentials payload before sending it
    to the router during authentication.
    
    Args:
        key: The 16-byte (128-bit) AES encryption key.
        iv: The 16-byte Initialization Vector for CBC mode.
        plaintext: The raw bytes to encrypt.
        
    Returns:
        The encrypted ciphertext as bytes.
    """
    # Create AES-CBC cipher instance
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv))
    encryptor = cipher.encryptor()
    
    # Apply PKCS7 padding manually to ensure compatibility
    # Padding value equals the number of padding bytes needed
    pad_length = 16 - (len(plaintext) % 16)
    padded_data = plaintext + bytes([pad_length] * pad_length)
    
    # Perform encryption
    return encryptor.update(padded_data) + encryptor.finalize()

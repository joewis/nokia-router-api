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


def url_safe_base64_encode(data: bytes) -> str:
    """
    Encodes binary data to a URL-safe Base64 string matching the JS implementation.
    
    Standard Base64 uses '+' and '/' which have special meanings in URLs.
    This function replaces them with '-' and '_' respectively, and replaces
    padding '=' characters with '.', as expected by the Nokia API.
    
    This matches the JavaScript base64url_escape function behavior.
    
    Args:
        data: The raw bytes to encode.
        
    Returns:
        A URL-safe Base64 encoded string with '.' instead of '=' padding.
    """
    # First encode to standard Base64
    encoded = base64.b64encode(data).decode('utf-8')
    # Apply JS-style URL escaping: + -> -, / -> _, = -> .
    return encoded.translate(str.maketrans("+/", "-_")).replace("=", ".")


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

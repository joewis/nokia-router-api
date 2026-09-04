#!/usr/bin/env python3
"""Cryptographic utilities for Nokia 3121 router authentication."""
import base64
import os
import subprocess

from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes


def url_escape(s: str) -> str:
    """JS base64url_escape: + -> -, / -> _, = -> . (char substitution)."""
    return s.translate(str.maketrans("+/", "-_")).replace("=", ".")


def sha256_crypt(password: str, salt: str) -> str:
    """Linux SHA-256 crypt: openssl passwd -5 -salt <salt> <password>.
    
    Returns the full crypt string including $5$salt$hash prefix.
    """
    return subprocess.run(
        ["openssl", "passwd", "-5", "-salt", salt, password],
        capture_output=True, text=True
    ).stdout.strip()


def aes_cbc_encrypt(key: bytes, iv: bytes, data: bytes) -> bytes:
    """Encrypt data using AES-CBC with PKCS7 padding."""
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv))
    encryptor = cipher.encryptor()
    pad_len = 16 - (len(data) % 16)
    padded = data + bytes([pad_len] * pad_len)
    return encryptor.update(padded) + encryptor.finalize()

from dataclasses import dataclass
import re


@dataclass(frozen=True)
class SecretFinding:
    label: str
    line_number: int


SECRET_PATTERNS: tuple[tuple[str, re.Pattern[str]], ...] = (
    ("private_key", re.compile(r"-----BEGIN [A-Z ]*PRIVATE KEY-----.*?-----END [A-Z ]*PRIVATE KEY-----", re.DOTALL)),
    ("database_url", re.compile(r"(?i)\b(?:postgres(?:ql)?|mysql|mongodb|redis)(?:\+[a-z0-9_]+)?://[^\s'\"<>]+")),
    ("jwt_secret", re.compile(r"(?i)\b(jwt[_-]?secret|jwt[_-]?key)\b\s*[:=]\s*['\"]?[^'\"\s]+['\"]?")),
    ("oauth_secret", re.compile(r"(?i)\b(oauth[_-]?(client[_-]?)?secret)\b\s*[:=]\s*['\"]?[^'\"\s]+['\"]?")),
    ("api_key", re.compile(r"(?i)\b(api[_-]?key|openai[_-]?api[_-]?key|secret[_-]?key)\b\s*[:=]\s*['\"]?[^'\"\s]+['\"]?")),
    ("password", re.compile(r"(?i)\b(password|passwd|pwd)\b\s*[:=]\s*['\"]?[^'\"\s]+['\"]?")),
    ("token", re.compile(r"(?i)\b(token|id[_-]?token|access[_-]?token|refresh[_-]?token|auth[_-]?token|bearer)\b\s*[:=]\s*['\"]?[^'\"\s]+['\"]?")),
    ("generic_secret", re.compile(r"(?i)\b(secret|client[_-]?secret)\b\s*[:=]\s*['\"]?[^'\"\s]+['\"]?")),
)


def scan_text_for_secrets(content: str) -> list[SecretFinding]:
    findings: list[SecretFinding] = []
    for label, pattern in SECRET_PATTERNS:
        for match in pattern.finditer(content):
            line_number = content.count("\n", 0, match.start()) + 1
            findings.append(SecretFinding(label=label, line_number=line_number))
    return findings


def redact_secrets(content: str) -> tuple[str, list[SecretFinding]]:
    findings = scan_text_for_secrets(content)
    redacted = content
    for label, pattern in SECRET_PATTERNS:
        redacted = pattern.sub(lambda match: _redact_match(label, match), redacted)
    return redacted, findings


def _redact_match(label: str, match: re.Match[str]) -> str:
    value = match.group(0)
    if label == "private_key":
        return "[REDACTED_PRIVATE_KEY]"
    if "=" in value:
        key = value.split("=", 1)[0].strip()
        return f"{key}=[REDACTED_{label.upper()}]"
    if ":" in value:
        key = value.split(":", 1)[0].strip()
        return f"{key}: [REDACTED_{label.upper()}]"
    return f"[REDACTED_{label.upper()}]"

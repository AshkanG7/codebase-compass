from dataclasses import dataclass


@dataclass(frozen=True)
class SecretFinding:
    label: str
    line_number: int


def scan_text_for_secrets(content: str) -> list[SecretFinding]:
    # Phase 1 placeholder. Future phases should add deterministic patterns for common secret formats.
    return []

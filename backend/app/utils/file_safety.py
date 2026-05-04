from pathlib import PurePosixPath
import re


MAX_FILES_PER_PROJECT = 50
MAX_INDIVIDUAL_FILE_SIZE_BYTES = 100 * 1024
MAX_TOTAL_PROJECT_SIZE_BYTES = 1 * 1024 * 1024

ALLOWED_FILE_EXTENSIONS = {
    ".c",
    ".cc",
    ".cpp",
    ".cs",
    ".css",
    ".env",
    ".go",
    ".h",
    ".hpp",
    ".html",
    ".java",
    ".js",
    ".json",
    ".jsx",
    ".kt",
    ".md",
    ".php",
    ".py",
    ".rb",
    ".rs",
    ".sql",
    ".swift",
    ".toml",
    ".ts",
    ".tsx",
    ".txt",
    ".xml",
    ".yaml",
    ".yml",
}

_DRIVE_PREFIX_RE = re.compile(r"^[a-zA-Z]:")
_SAFE_CONTROL_CHARS = {"\n", "\r", "\t", "\f", "\b"}


def normalize_upload_path(path: str) -> str:
    candidate = path.strip().replace("\\", "/")
    if not candidate or "\x00" in candidate or _DRIVE_PREFIX_RE.match(candidate):
        raise ValueError("Unsafe file path.")
    normalized_path = PurePosixPath(candidate)
    parts = normalized_path.parts
    if normalized_path.is_absolute() or any(part in {"", ".", ".."} for part in parts):
        raise ValueError("Unsafe file path.")
    normalized = str(normalized_path)
    return normalized


def get_allowed_extension(path: str) -> str:
    normalized_path = normalize_upload_path(path)
    filename = PurePosixPath(normalized_path).name.lower()
    suffix = PurePosixPath(normalized_path).suffix.lower()
    extension = ".env" if filename == ".env" or filename.startswith(".env.") else suffix
    extension = filename if filename in ALLOWED_FILE_EXTENSIONS else extension
    if extension not in ALLOWED_FILE_EXTENSIONS:
        raise ValueError("File type is not allowed.")
    return extension


def get_text_size_bytes(content: str) -> int:
    return len(content.encode("utf-8"))


def looks_binary(content: str) -> bool:
    if "\x00" in content or "\ufffd" in content:
        return True
    if not content:
        return False
    control_count = sum(
        1 for char in content if ord(char) < 32 and char not in _SAFE_CONTROL_CHARS
    )
    return control_count / len(content) > 0.05


def is_safe_text_file(path: str, size_bytes: int, content: str) -> bool:
    get_allowed_extension(path)
    return 0 < size_bytes <= MAX_INDIVIDUAL_FILE_SIZE_BYTES and not looks_binary(content)


def reject_executable_handling() -> str:
    return "Uploaded files must be handled as untrusted plain text and must never be executed."

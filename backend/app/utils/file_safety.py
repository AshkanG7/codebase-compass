from pathlib import PurePosixPath


MAX_FILES_PER_PROJECT = 50
MAX_INDIVIDUAL_FILE_SIZE_BYTES = 100 * 1024
MAX_TOTAL_PROJECT_SIZE_BYTES = 1 * 1024 * 1024

ALLOWED_FILE_EXTENSIONS = {
    ".c",
    ".cc",
    ".cpp",
    ".cs",
    ".css",
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


def normalize_upload_path(path: str) -> str:
    normalized = str(PurePosixPath(path.replace("\\", "/")))
    if normalized.startswith("../") or normalized == ".." or normalized.startswith("/"):
        raise ValueError("Unsafe file path.")
    return normalized


def is_safe_text_file(path: str, size_bytes: int) -> bool:
    normalized_path = normalize_upload_path(path)
    suffix = PurePosixPath(normalized_path).suffix.lower()
    return suffix in ALLOWED_FILE_EXTENSIONS and size_bytes <= MAX_INDIVIDUAL_FILE_SIZE_BYTES


def reject_executable_handling() -> str:
    return "Uploaded files must be handled as untrusted plain text and must never be executed."

from app.utils.file_safety import (
    ALLOWED_FILE_EXTENSIONS,
    MAX_FILES_PER_PROJECT,
    MAX_INDIVIDUAL_FILE_SIZE_BYTES,
    MAX_TOTAL_PROJECT_SIZE_BYTES,
)


def is_allowed_extension(extension: str) -> bool:
    normalized = extension.lower().strip()
    if normalized and not normalized.startswith("."):
        normalized = f".{normalized}"
    return normalized in ALLOWED_FILE_EXTENSIONS


def validate_file_size(size_bytes: int) -> bool:
    return 0 <= size_bytes <= MAX_INDIVIDUAL_FILE_SIZE_BYTES


def validate_project_limits(file_count: int, total_size_bytes: int) -> list[str]:
    errors: list[str] = []
    if file_count > MAX_FILES_PER_PROJECT:
        errors.append(f"Projects may include at most {MAX_FILES_PER_PROJECT} files.")
    if total_size_bytes > MAX_TOTAL_PROJECT_SIZE_BYTES:
        errors.append(f"Projects may include at most {MAX_TOTAL_PROJECT_SIZE_BYTES} bytes.")
    return errors

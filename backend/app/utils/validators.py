from app.utils.file_safety import (
    ALLOWED_FILE_EXTENSIONS,
    MAX_FILES_PER_PROJECT,
    MAX_INDIVIDUAL_FILE_SIZE_BYTES,
    MAX_TOTAL_PROJECT_SIZE_BYTES,
    get_allowed_extension,
    get_text_size_bytes,
    looks_binary,
    normalize_upload_path,
)


def is_allowed_extension(extension: str) -> bool:
    normalized = extension.lower().strip()
    if normalized and not normalized.startswith("."):
        normalized = f".{normalized}"
    return normalized in ALLOWED_FILE_EXTENSIONS


def validate_file_size(size_bytes: int) -> bool:
    return 0 < size_bytes <= MAX_INDIVIDUAL_FILE_SIZE_BYTES


def validate_project_limits(file_count: int, total_size_bytes: int) -> list[str]:
    errors: list[str] = []
    if file_count > MAX_FILES_PER_PROJECT:
        errors.append(f"Projects may include at most {MAX_FILES_PER_PROJECT} files.")
    if total_size_bytes > MAX_TOTAL_PROJECT_SIZE_BYTES:
        errors.append(f"Projects may include at most {MAX_TOTAL_PROJECT_SIZE_BYTES} bytes.")
    return errors


def validate_uploaded_file(path: str, content: str) -> tuple[str, str, int]:
    normalized_path = normalize_upload_path(path)
    extension = get_allowed_extension(normalized_path)
    size_bytes = get_text_size_bytes(content)
    if size_bytes == 0:
        raise ValueError("File content is required.")
    if size_bytes > MAX_INDIVIDUAL_FILE_SIZE_BYTES:
        raise ValueError("File is too large.")
    if looks_binary(content):
        raise ValueError("Binary files are not allowed.")
    return normalized_path, extension, size_bytes

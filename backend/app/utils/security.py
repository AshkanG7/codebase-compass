from secrets import token_urlsafe


def create_placeholder_token() -> str:
    return token_urlsafe(32)

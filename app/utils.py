import re


def clean_spaces(value: str) -> str:
    if value is None:
        return value
    return re.sub(r'\s+', ' ', value.strip())
import re
import secrets

from sqlalchemy import inspect


def clean_spaces(value: str | list[str]) -> str | list[str]:
    if type(value) == list:
        return [re.sub(r"\s+", " ", i.strip()) for i in value]

    if value is None:
        return value
    return re.sub(r"\s+", " ", value.strip())


def generate_random_hex_string(length: int) -> str:
    return secrets.token_hex(length)


def object_as_dict(obj):
    return {c.key: getattr(obj, c.key) for c in inspect(obj).mapper.column_attrs}

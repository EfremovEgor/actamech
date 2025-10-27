import re
import secrets

def clean_spaces(value: str|list[str]) -> str|list[str]:
    if type(value) == list:
        return [re.sub(r'\s+', ' ', i.strip()) for i in value]
    
    if value is None:
        return value
    return re.sub(r'\s+', ' ', value.strip())


def generate_random_hex_string(length: int)->str:
    return secrets.token_hex(length)



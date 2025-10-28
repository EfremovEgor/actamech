FROM python:3.12-slim as builder

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

FROM builder

WORKDIR /app
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY . .

RUN apt-get update && apt-get install -y dos2unix && \
    dos2unix ./scripts/entrypoint.sh && \
    chmod +x ./scripts/entrypoint.sh

EXPOSE 8000

ENTRYPOINT [ "/bin/bash", "./scripts/entrypoint.sh" ]
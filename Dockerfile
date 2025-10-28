FROM python:3.12-slim AS builder

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

FROM builder

WORKDIR /app
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY . .

# Install bash and fix permissions
RUN apt-get update && \
    apt-get install -y bash && \
    chmod +x ./scripts/entrypoint.sh

EXPOSE 8000

ENTRYPOINT [ "/bin/bash", "./scripts/entrypoint.sh" ]
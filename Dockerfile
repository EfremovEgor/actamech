FROM python:3.12-slim as builder

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

FROM builder

WORKDIR /app
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY . .


EXPOSE 8000

ENTRYPOINT [ "./scripts/entrypoint.sh" ]
# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
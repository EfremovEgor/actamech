#!/bin/sh

echo "Starting migrations..."
alembic -c app/database/alembic.ini upgrade head
echo "Migrations complete"
echo "Starting server"
uvicorn app.main:app --host 0.0.0.0 --port 8000
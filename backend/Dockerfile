FROM ghcr.io/astral-sh/uv:debian-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
  PYTHONUNBUFFERED=1 \
  UV_NO_DEV=1
# Install build deps for mysqlclient
RUN apt-get update && apt-get install -y --no-install-recommends \
  pkg-config \
  default-libmysqlclient-dev \
  gcc \
  && rm -rf /var/lib/apt/lists/*

COPY backend/pyproject.toml backend/uv.lock ./
RUN uv sync --locked
COPY backend/ ./backend


EXPOSE 8000

CMD ["uv", "run", "uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
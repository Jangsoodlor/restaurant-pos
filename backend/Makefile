.PHONY: install install-dev dev test prod lint format sync clean

install:
	uv sync

install-dev:
	uv sync --dev

dev:
	uv run --env-file .env.dev fastapi dev main.py

test:
	uv run --env-file .env.test pytest -v

prod:
	uv run --env-file .env.prod uvicorn main:app --host 0.0.0.0 --port 8000

lint:
	uv run ruff check .

format:
	uv run ruff format .

sync:
	uv sync

clean:
	rm -rf .venv
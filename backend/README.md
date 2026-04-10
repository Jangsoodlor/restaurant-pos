# How to Install?

1. Install the required packages:
    - [Python 3.14](https://www.python.org/downloads/) or newer
    - [uv](https://docs.astral.sh/uv/)
    - [GNU Make](https://www.gnu.org/software/make/) (Optional)

2. Make sure your current working directory is `<project-root>/backend` and run
the following command to install the required Python dependencies.
    ```bash
    uv sync --dev
    ```

3. Copy `.env.example` into `.env.prod`, `.env.test`, and `.env.dev`. See instructions
in `.env.example` for more details.


# How to Run Locally?

You need to install first.

## Development Mode

```bash
make dev
```

## Production Mode

```bash
make prod
```

## Unit Tests

```bash
make test
```

Alternatively, if you don't have GNU Make installed, you can run the command for `dev`, `prod`, and `test`
listed in the `Makefile` manually.

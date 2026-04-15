# Restaurant POS System

A simple Restaurant POS system.

## Project Description

Restaurant Point-of-Sales system is a simple point-of-sales web application with restaurant management features, such as seeing order status of each table, managing menus, and managing food orders.

## System Architecture Overview
The project follows **Service-Based architecture style** organised into a single architectural quantum consisting of 1 database, 1 user interface instance, and 4 services. The overall architecture of the project is represented using the diagram below:
<!-- TODO: add diagram -->

### CodeCharta Analysis
<!-- TODO: add them here -->

## User Roles & Permissions
<!-- TODO: add user roles here -->

## Technology Stack

- Frontend: React.
- Backend: FastAPI.
- Database: SQLite (for production), MariaDB (for deployment).


## Installation

### Using Docker

```bash
docker compose build
```

### Using Podman

```bash
podman-compose build
```

### Manually

1. Install the [Backend](backend/README.md)
1. Install the [Frontend](frontend/README.md)

## How to Run?

### Using Docker

```bash
docker compose up -d
```

### Using Podman

```bash
podman-compose up -d
```

### Manually

1. Run the backend:
    ```bash
    cd <project-root>/backend
    make dev
    ```
2. Run the frontend:
    ```bash
    cd <project-root>/frontend
    bun dev
    ```

See "How to Run" section in the installation guides for more details.

## Screenshots

### Home Page
![Home](/images/screenshot-home.png)

### Table Status
![Table](/images/screenshot-table.png)

### Menu Management
![Menu](/images/screenshot-menu.png)

### User Management
![User](/images/screenshot-user.png)

### Order Creation
![Order Creation](/images/screenshot-order-create.png)

### Order Tracking
![Order Tracking](/images/screenshot-order.png)

# Restaurant POS System

A simple Restaurant POS system.

## Project Description

Restaurant Point-of-Sales system is a simple point-of-sales web application with basic restaurant management features, including table management, menu management, and managing food orders.

## System Architecture Overview
The project follows **Service-Based architecture style** organised into a single architectural quantum consisting of 1 database, 1 user interface instance, and 4 services, which are:

1. User service: Deals with User CRUD operations, as well as user authentication and registration.
2. Table service: Deals with tables in the restaurant
3. Menu service: Deals with restaurant menu, as well as menu modifiers (e.g., fried egg, extra rice, etc.).
4. Order service: Deals with restaurant orders.

The overall architecture of the project is represented using the diagram below:

![diagram](/images/diagram.png)

The `Common` module contains utilities, such as database connection function.

### CodeCharta Analysis

Excluding test codes
![diagram](/images/codecharta-isometric.png)

## User Roles & Permissions

Each role have the following permissions:

| Role/Service | Menu | Table | Order | User |
| :--- | :--- | :--- | :--- | :--- |
| **Cook** | R | R | C, R, U, D | - |
| **Waiter** | R | R, U | C, R, U, D | - |
| **Manager** | C, R, U, D | C, R, U, D | C, R, U, D | R, U, D |

**Legend:**
C = Create, R = Retrieve, U = Update, D = Delete
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

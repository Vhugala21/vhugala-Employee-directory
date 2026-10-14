# Employee Directory

A full-stack employee management application with a Java Spring Boot backend and Angular frontend.

## Tech Stack

**Backend:**
- Java 21
- Spring Boot 3.x
- Spring Data JPA
- PostgreSQL
- Maven

**Frontend:**
- Angular 18+
- TypeScript
- RxJS
- Angular Material / Bootstrap

**DevOps:**
- Docker & Docker Compose
- GitHub Actions CI/CD
- GitLab CI (alternative)

## Project Structure

```
├── backend/                 # Spring Boot application
│   ├── src/
│   │   ├── main/java/...    # Controllers, Services, Repositories, Entities
│   │   └── test/            # Unit & integration tests
│   ├── pom.xml
│   └── Dockerfile
├── frontend/                # Angular application
│   ├── src/
│   │   ├── app/             # Components, services
│   │   └── assets/
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml       # Local development stack
├── .github/workflows/ci.yml # GitHub Actions CI pipeline
└── .gitlab-ci.yml           # GitLab CI pipeline (alternative)
```

## Prerequisites

- Java 21+
- Node.js 20+
- Docker & Docker Compose (for containerized setup)
- PostgreSQL 15+ (for local non-Docker setup)

## Quick Start (Docker Compose)

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your values
# POSTGRES_DB=employees
# POSTGRES_USER=postgres
# POSTGRES_PASSWORD=yourpassword

# Start all services
docker-compose up -d

# Access:
# Frontend: http://localhost:4200
# Backend API: http://localhost:8080/api
# Database: localhost:5432
```

## Local Development (Without Docker)

### Backend

```bash
cd backend

# Run with Maven wrapper
./mvnw spring-boot:run

# Or with IDE: Run EmployeeDirectoryApplication.java
# API at http://localhost:8080/api
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm start
# App at http://localhost:4200 (proxies API to backend)
```

### Database

```bash
# Start PostgreSQL
docker run -d \
  --name postgres \
  -e POSTGRES_DB=employees \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:15-alpine
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `POSTGRES_DB` | Database name | `employees` |
| `POSTGRES_USER` | Database user | `postgres` |
| `POSTGRES_PASSWORD` | Database password | Required |
| `SPRING_DATASOURCE_URL` | JDBC URL | Auto from above |
| `SPRING_DATASOURCE_USERNAME` | DB username | Auto from above |
| `SPRING_DATASOURCE_PASSWORD` | DB password | Auto from above |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees` | List all employees |
| GET | `/api/employees/{id}` | Get employee by ID |
| POST | `/api/employees` | Create employee |
| PUT | `/api/employees/{id}` | Update employee |
| DELETE | `/api/employees/{id}` | Delete employee |

## Testing

```bash
# Backend tests
cd backend && ./mvnw test

# Frontend tests
cd frontend && npm test -- --watch=false --browsers=ChromeHeadless

# All tests via Docker
docker-compose -f docker-compose.yml -f docker-compose.test.yml up --abort-on-container-exit
```

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every push/PR:

1. **Build Backend** - Compile with Maven
2. **Test Backend** - Unit + integration tests with PostgreSQL
3. **Test Frontend** - Unit tests with Karma/Jasmine
4. **Build Docker Images** - On main branch only

View runs: [Actions tab](https://github.com/Vhugala21/vhugala-Employee-directory/actions)

## Deployment

### Docker Production Build

```bash
# Build images
docker build -t employee-directory/backend:latest ./backend
docker build -t employee-directory/frontend:latest ./frontend

# Run with production compose (add reverse proxy, SSL, etc.)
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Cloud Platforms

- **Render/Railway/Fly.io**: Connect repo, auto-deploys on push
- **AWS ECS/Fargate**: Use GitHub Actions to push to ECR, deploy to ECS
- **Google Cloud Run**: Build and deploy via Cloud Build
- **Azure Container Apps**: Deploy from GitHub Actions

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details.
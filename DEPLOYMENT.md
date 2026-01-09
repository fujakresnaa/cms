# Deployment Guide for MRC Club Admin

This guide covers deployment strategies for the MRC Club Admin application, focusing on Docker (recommended for production) and manual deployment.

## Prerequisites

- **Docker & Docker Compose** (for containerized deployment)
- **Node.js 20+** (for manual/local deployment)
- **PostgreSQL Database** (Containerized or External)
- **Supabase Account** (for Authentication only)

---

## 1. Environment Configuration

Regardless of the deployment method, you must configure your environment variables.

1.  Create a `.env` file in the root directory (copy from `.env.example` if available).
2.  Add the following required variables:

```env
# Database Connection (Required)
# If using Docker, the host is 'db'. If local, it's usually 'localhost'.
DATABASE_URL=postgresql://user:password@hostname:5432/cms_mercy

# Node Environment
NODE_ENV=production
```

---

## 2. Docker Deployment (Recommended)

This project is optimized for Docker with a multi-stage `Dockerfile` and `docker-compose.yml`.

### Setup
Ensure your `docker-compose.yml` and `Dockerfile` are present in the root.

### Running the Application

1.  **Build and Start Containers**:
    ```bash
    docker-compose up -d --build
    ```
    This command will:
    - Build the Next.js application (standalone mode).
    - Start a PostgreSQL container (`db`).
    - Start the Application container (`app`) on port 3000.
    - Setup volume persistence for database (`postgres_data`) and file uploads (`uploads_data`).

2.  **Verify Running Services**:
    ```bash
    docker-compose ps
    ```

3.  **Run Database Migrations**:
    After the containers are up, initialize the database schema.
    ```bash
    # Run the migration script inside the app container
    docker-compose exec app npm run migrate
    ```

### Managing Data Persistence
- **Database**: Data is stored in the Docker volume `postgres_data`.
- **File Uploads**: User uploads are stored in `public/uploads`, which is mapped to the Docker volume `uploads_data`. This ensures images persist even if you rebuild the container.

### Stopping the Application
- Stop containers: `docker-compose down`
- **WARNING**: To delete all data (database and uploads), run `docker-compose down -v`.

---

## 3. Production Deployment (Dokploy / VPS)

For production environments (like Hostinger VPS with Dokploy), use the optimized `docker-compose.prod.yml`.

1.  **Configuration**:
    - Ensure your Dokploy or VPS uses `docker-compose.prod.yml` instead of the default file.
    - Set the environment variables in your VPS dashboard or create a `.env.production` file based on the template.

2.  **Key Differences**:
    - **Restart Policy**: Services restart `always`.
    - **Resource Limits**: CPU and Memory limits are defined to prevent server crashes.
    - **Health Checks**: Integrated health checks for auto-healing.
    - **Logging**: JSON logging with rotation to save disk space.
    - **External Database**: The file is configured to connect to your external Postgres database, not an internal container.

3.  **Command**:
    ```bash
    docker-compose -f docker-compose.prod.yml up -d --build
    ```


## 3. Manual / VPS Deployment

If you prefer running without Docker:

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Build the Project**:
    ```bash
    npm run build
    ```

3.  **Database Setup**:
    - Ensure you have a running PostgreSQL instance.
    - Update `DATABASE_URL` in your `.env` file.
    - Run migrations:
      ```bash
      npm run migrate
      ```

4.  **Start the Server**:
    ```bash
    npm start
    ```
    The app will be available at `http://localhost:3000`.

---

## 4. Troubleshooting

### Issue: "Failed to connect to database"
- **Docker**: Ensure the `DATABASE_URL` uses `db` as the hostname (e.g., `postgresql://fuja:password@db:5432/cms_mercy`).
- **Local**: Ensure the hostname is `localhost` and the port matches your local Postgres instance.

### Issue: "Uploads missing after restart"
- Verify that your `docker-compose.yml` correctly mounts the `uploads_data` volume to `/app/public/uploads` in the `app` service, NOT the `db` service.

### Issue: "Build fails"
- Run `npm install` to ensure lockfiles are synced.
- Check for TypeScript errors with `npm run type-check`.

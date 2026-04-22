# KGMAO Multi-tenant Enterprise Backend

KGMAO is a scalable, state-of-the-art multi-tenant Maintenance Management System (GMAO) built for scalability across different industries.

## Tech Stack
- **Node.js** & **Express.js**
- **MySQL2** (with Connection Pooling)
- **JWT** (Authentication)
- **Bcrypt** (Password Hashing)
- **Joi** (Input Validation)

## Directory Structure
- `/src/config`: MySQL setup.
- `/src/middlewares`: Security (JWT logic), RBAC (`authorize`), Error Handling.
- `/src/routes`: Express Routers defining API endpoints.
- `/src/controllers`: Request/Response HTTP logic.
- `/src/services`: Core business logic interacting with DB securely.
- `/src/validations`: Input schemas mapping req.body to safely validated objects.
- `/database/schema.sql`: Contains the fully normalized Database architecture script natively built for Multi-Tenancy.

## Multi-Tenancy Security Approach
The database utilizes a **Shared Database / Shared Schema** multi-tenancy model. Every tenant-affiliated table features a `company_id` column.
The `src/middlewares/auth.middleware.js` automatically binds the `company_id` to `req.user`. Every model query mandates `WHERE company_id = ?` dynamically locking tenants to their native data.

## Getting Started

1. Set up Environment:
   ```bash
   cp .env.example .env
   # Update the database credentials properly
   ```

2. Initialize DB:
   Execute `database/schema.sql` into your target MySQL instance.

3. Install and Run:
   ```bash
   npm install
   npm run dev
   ```

## Sample Endpoints Flow

1. **Register Admin/Company** (`POST /api/v1/auth/register`)
2. **Login Admin** (`POST /api/v1/auth/login`) -> Extract `token`
3. **Add Asset** (`POST /api/v1/assets`) -> With Bearer Token.
4. **Create Work Order** (`POST /api/v1/work-orders`) -> Maps out to specific `assetId`.

# Snapper Project Setup

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Docker](https://www.docker.com/)
- [Task](https://taskfile.dev/)
- MongoDB (optional if using Docker)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (for running the frontend on mobile devices)

Ensure you have environment variables set up for development by creating a `.env` file.


## Project Structure

The project is divided into two main parts:

1. **Frontend** (located in the `frontend` directory):
   - Built using React Native + Expo.
   - Cross-platform support for iOS, Android, and web.

2. **Backend** (located in the `backend` directory):
   - Built using Node.js + Express.
   - MongoDB for database operations.
   - Supabase for authentication.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-repo/snapper.git
cd snapper
```

### 2. Install Dependencies
We use Taskfile to streamline setting up the project.

```bash
task install
```
This command will install dependencies for both frontend and backend.

### 3. Set up your .env
Create a .env in the root directory containing the following:

```
NODE_ENV=development
SERVER_PORT=3000
MONGO_URL=mongodb+srv://user:dbUserPassword@snappercluster.i3fur.mongodb.net/?retryWrites=true&w=majority&appName=SnapperCluster;
MONGO_USERNAME="user"
MONGO_PASSWORD="dbUserPassword"
SUPABASE_PASSWORD="9waZ2NQKum6FmP$"
SUPABASE_URL="https://xcgzrcnpyoxwxbjwnfnn.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjZ3pyY25weW94d3hianduZm5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU1NTMxOTUsImV4cCI6MjA0MTEyOTE5NX0.NgMdOTtSCbMdxkrzCgNYCyKBSLpzPuyARB8qnn3NKNo"
```

### 4. Running the Application
You can start the frontend and backend simultaneously by running:

```bash
task start
```

Or, you can start each service separately:

- Frontend (React Native):
```bash
task frontend:start
```

- Backend (Express):
```bash
task backend:start
```

### 5. Running in Development Mode
For development, where you may want auto-reload features:

```bash
task backend:dev
```

### 6. MongoDB with Docker
We are using Docker to run MongoDB locally. To start MongoDB, run:

```bash
docker-compose up
```
Mongo Express is available at http://localhost:3000 for database management.

### 7. Testing
To run the backend tests, use:

```bash
task backend:test
```
We use Jest for testing the backend.
#### Backend Routes Overview
Here’s an overview of the important backend routes:

Auth Routes:
POST /auth/register: Register a new user.

POST /auth/login: Log in an existing user.

POST /auth/logout: Log out the user.

Healthcheck:

GET /ping: Check server status, requires authentication.

#### Contribution Guidelines

Please make sure to create a new branch for every feature you work on, and always create a pull request for code review. Ensure that all tests pass locally before submitting your PR.

#### Questions or Issues?
If you run into any problems, feel free to slack me!

Happy coding! 🐠

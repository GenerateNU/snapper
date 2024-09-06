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

### 3. Running the Application
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

### 4. Running in Development Mode
For development, where you may want auto-reload features:

```bash
task backend:dev
```

### 5. MongoDB with Docker
We are using Docker to run MongoDB locally. To start MongoDB, run:

```bash
docker-compose up
```
Mongo Express is available at http://localhost:3000 for database management.

### 6. Testing
To run the backend tests, use:

```bash
task backend:test
```
We use Jest for testing the backend.

#### Code Formatting
We follow strict formatting rules for both frontend and backend. Ensure that your code is properly formatted before pushing:

```bash
task format-check
```

To auto-format the code, use:

```bash
task format
```

#### MongoDB Debugging
You can start MongoDB with Nodemon for hot-reloading the database:

```bash
task mongo:start
```

#### Backend Routes Overview
Here’s an overview of the important backend routes:

Auth Routes:
POST /auth/register: Register a new user.
POST /auth/login: Log in an existing user.
POST /auth/logout: Log out the user.
Healthcheck:
GET /ping: Check server status, requires authentication.
Task Commands Overview
Here are some additional Task commands that you might find useful:

#### Install Dependencies:

task install: Installs all necessary dependencies for both frontend and backend.

Frontend-specific Tasks:

task frontend:start: Starts the frontend development server.
task frontend:ios: Runs the frontend on an iOS simulator.
task frontend:android: Runs the frontend on an Android emulator.
task frontend:web: Runs the frontend in a web browser.
Backend-specific Tasks:

task backend:start: Starts the backend server.
task backend:build: Builds the backend for production.
task backend:test: Runs backend tests.

#### Contribution Guidelines

Please make sure to create a new branch for every feature you work on, and always create a pull request for code review. Ensure that all tests pass locally before submitting your PR.

#### Questions or Issues?
If you run into any problems, feel free to slack me!

Happy coding! 🐠

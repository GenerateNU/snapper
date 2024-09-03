# Snapper
Snapper's purpose is to connect and educate Scuba Divers through virtual dive logging, real time marine life reporting and fish identification through a mobile app. It designed to be social, so you can see what your friends and people are the area are seeing.

## Set Up Your Development Environment
First, understand the tech stack:

- The back end is written in [Typescript](https://www.typescriptlang.org) and uses [Express.js](https://expressjs.com) for routes.
- The database is [MongoDB]([https://www.postgresql.org/](https://www.mongodb.com)), and it simply stores data and gives it to the back end upon request
- The front end is [React Native](https://reactnative.dev/) written with [TypeScript](https://www.typescriptlang.org/) and uses [Expo](https://expo.dev/) as a build tool. Users on iOS and Android will use the mobile app to interact with our core service while the app makes requests to our back end

Before we can compile and run our application, we need to install several languages, package managers, and various tools.
The installation process can vary by tool and operating system, so follow the provided installation instructions for each item below

## Development
Use `task` to check, test, build, and execute the project locally, as targets have already been defined for efficient development. Consider investigating the Taskfiles to learn how everything works! To get started, run `task install` to download all frontend/backend dependencies.

# Environment Setup
This guide assumes that you are using Linux/MacOS. If you are using Windows, please install [WSL](https://learn.microsoft.com/en-us/windows/wsl/install).

Clone the repository by running `git clone https://github.com/GenerateNU/platnm.git`.

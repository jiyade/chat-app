# MERN Stack Chat App

## Overview

This chat app, built with the MERN (MongoDB, Express.js, React.js, Node.js) stack and socket.io, allows users to create accounts, log in, and delete accounts. Users can engage in real-time messaging, initiate new chats, and delete messages. Additionally, users have the ability to change their name, username, and password.

## Project Structure

- **`chat-app` (Root Folder):**
  - `client` (Frontend)
  - `server` (Backend)

## Features

- **Account Management:**
  - Create accounts
  - Log in
  - Delete accounts
  - Change name, username, and password

- **Messaging:**
  - Real-time messaging
  - Start new chats
  - Delete messages

## Front-End Framework

The front-end of this application is built with [Vite](https://vitejs.dev/), a fast web development build tool. It utilizes the Tailwind CSS framework for styling.

## Installation

1. Clone the repository: `git clone https://github.com/jiyade/chat-app.git`
2. Navigate to the project directory: `cd chat-app`
3. Install dependencies:
   - Frontend: `cd client && npm install`
   - Backend: `cd server && npm install`

## Environment Variables

### Server (Backend)

In the `server` directory, the server expects the following environment variables:

- **`MONGO_URI`**: URI for MongoDB connection (connection string).
- **`JWT_SECRET`**: Secret for JSON Web Token.
- **`REACT_URL`**: URL of the React app (frontend).

Create a `.env` file in the `server` directory and add these variables.

### Client (Frontend)

In the `client` directory (frontend), the React app expects the following environment variable:

- **`VITE_SERVER_BASE_URL`**: URL of the server (backend).

Create a `.env` file in the `client` directory and add this variable.

## Usage

1. Run the app:
   - Frontend: `cd client && npm run dev`
   - Backend: `cd server && npm start`
2. Visit [http://localhost:5173](http://localhost:5173) in your browser.

## Working Preview

Check out the working preview of the app at [https://chat-app-jiyade.netlify.app/](https://chat-app-jiyade.netlify.app/).

## Technologies Used

- MongoDB
- Express.js
- React.js
- Node.js
- Socket.io
- Vite
- Tailwind CSS


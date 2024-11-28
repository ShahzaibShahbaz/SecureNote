# SecureNote

SecureNote is a secure note-taking application that uses **end-to-end encryption** to protect your data. The backend handles the encryption and decryption processes, while the database only stores encrypted data. The frontend provides a seamless interface for managing your notes.

---

## Features

- **End-to-End Encryption**: Ensures your notes remain private and secure.
- **Secure Data Storage**: Only encrypted data is stored in the database.
- **Responsive Frontend**: Built with React and styled using TailwindCSS.
- **RESTful Backend**: Developed with Express.js and MongoDB for efficient data handling.

---

## Tech Stack

### Frontend:

- **React**: UI development.
- **React Router DOM**: For routing.
- **TailwindCSS**: For styling.

### Backend:

- **Express.js**: API development.
- **MongoDB**: Database for storing encrypted notes.
- **bcryptjs, crypto-js**: For encryption and secure data handling.
- **jsonwebtoken**: For user authentication.

---

## Prerequisites

- **Node.js** (v14.x or higher)
- **MongoDB** (Ensure you have a running instance or use MongoDB Atlas)
- **npm**

---

## Installation

### 1. Clone the Repository

- git clone https://github.com/ShahzaibShahbaz/SecureNote.git
- cd SecureNote

### 2. Set Up the Backend

- cd back-end
- npm install
- node app.js

---

### 3. Set Up the Frontend

- cd ../front-end
- npm install
- npm run start

---

## Development Notes

- Ensure both the frontend (http://localhost:3000) and backend (http://localhost:5000) servers are running during development.
- For production, configure the servers and database appropriately.

---

## Author

- Developed by [Shahzaib Shahbaz & Ahmed Shaheer].

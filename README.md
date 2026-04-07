# 🏠 EstateHub — Fullstack Real Estate Platform

**EstateHub** is a web application for searching, renting, and selling real estate. The project is implemented as a client-server application with a robust role-based access control (RBAC) system.

## Key Features
The application supports three main types of users, each with unique permissions:
- **🏠 Owner:** Can create, edit, and manage their own property listings.
- **💼 Realtor:** Manages the overall property database and updates deal statuses.
- **👤 Client:** Browses available listings, uses advanced filtering, and saves properties to "Favorites."

## 🛠 Technology Stack

### Frontend (`/client`)
- **React.js** (Vite) — For building the user interface.
- **UI Kit:** (Ant Design / MUI) — For professional and consistent component styling.
- **React Router:** For seamless client-side navigation.
- **CSS/SCSS:** Custom styling for a unique look and feel.

### Backend (`/server`)
- **Node.js & Express:** For handling server-side logic and API requests.
- **Database:** MongoDB — To store user data and property listings.
- **JWT (JSON Web Tokens):** For secure user authentication and authorization.

## 📂 Repository Structure

```text
EstateHub/
├── client/           # Client-side (React)
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components (Home, Login, Dashboard)
│   │   └── App.jsx      # Main application component
│   └── package.json
├── server/           # Server-side (Node.js)
│   ├── controllers/  # API request handling logic
│   ├── models/       # Database schemas
│   └── index.js      # Server entry point
└── README.md


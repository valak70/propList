
# 🏠 PropList – Property Listing Platform

PropList is a full-stack real estate platform that lets users browse, list, favorite, and recommend properties. It includes role-based access, advanced search filter, pagination, and caching for performance optimization.

---

## 🚀 Features

- 🔍 **Browse properties** with advanced filtering
- 💖 **Favorite** properties
- 📤 **Recommend** properties to other users via email
- 🧑‍💼 **List & Manage** your own properties
- ✍️ **Edit/Delete** your listings
- 🧾 **User auth** (register, login, logout)
- ⚡ **Optimized with Redis** caching for fast response

---

## 🧱 Tech Stack

### Frontend:
- React + TypeScript
- Tailwind CSS

### Backend:
- Node.js + Express
- TypeScript
- MongoDB (with Mongoose)
- Redis (for caching)
- JWT for authentication

---

## 📦 Setup Instructions

### 🔧 Backend

1. Clone the repo:
   ```bash
   git clone https://github.com/valak70/propList.git
   cd proplist/server
   ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Create .env file:
    ```env
    MONGO_URI=your_mongo_uri                                  // MongoDB Atlas connect url
    JWT_SECRET=your_jwt_secret
    ```
4. Populate CSV data into MongoDB
    ```bash
    npx ts-node-dev src/scripts/createDummyUser.ts            // Create a dummy user
    npx ts-node-dev src/scripts/importCsv.ts                  // CSV to MongoDB
    ```
5. Start the server
    ```bash
    npm start
    ```
** If running server in Windows install redis using wsl

### 🌐 Frontend

1. Go to the frontend folder:
    ```bash
    cd ../client
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Create .env file:
    ```bash
    VITE_API_URL=http://localhost:5000/api
    ```
4. Start the app:
    ```bash
    npm run dev
    ```
## API Highlights
- **GET** /properties?{filter_query} — List paginated properties with advanced filtering
- **POST** /properties — Add property
- **GET** /properties/:propertyId — Get property by its id
- **PUT** /properties/:propertyId — Update your own property
- **DELETE** /properties/:propertyId — Delete your own property
- **GET** /favorites — Get favorites
- **POST** /favorites/:propertyId — Add to favorites
- **DELETE** /favorites/:propertyId — Remove from favorites
- **POST** /recommendations — Recommend to a user by email
- **GET** /recommendations — View received recommendations
- **POST** /auth/register, /login, /me — Auth endpoints


## 🤝 Contributions
PRs welcome! Please fork the repo and make a pull request.


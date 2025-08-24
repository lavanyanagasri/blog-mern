# MERN Blog App 📝

A full-stack blogging platform built using the **MERN** stack (MongoDB, Express.js, React, Node.js) that allows users to register, log in, create and read stories, bookmark posts, and manage their profiles.

## ✨ Features

- ✅ User Registration & Login (JWT Authentication)
- 🔒 Protected Routes (Access control for creating stories, viewing bookmarks, etc.)
- 📝 Add, Edit, Delete Blog Posts
- 🔍 Search Functionality
- 📚 Bookmark Stories
- 🧑‍💼 User Profile with Avatar
- 💬 Toast notifications (on login/register/etc.)
- 🔍 Responsive UI using **Tailwind CSS**
- 🧠 Skeleton loading UI
- 🔐 AuthContext for global authentication state
---

## 🧰 Tech Stack

| Frontend | Backend | Database |
|----------|---------|----------|
| React    | Node.js / Express | MongoDB (Mongoose) |

- State Management: React Context API
- Styling: Tailwind CSS
- Toast: `react-toastify`
- Icons: `react-icons`

---
## Screenshots of My Project
<img width="1898" height="886" alt="image" src="https://github.com/user-attachments/assets/b7e42482-38e5-484d-bd68-06dcc9876a40" />
<img width="1899" height="892" alt="image" src="https://github.com/user-attachments/assets/f1a69213-adea-4463-9833-b88e41c5427d" />
<img width="1903" height="914" alt="image" src="https://github.com/user-attachments/assets/0d54e05a-5a43-48ef-b407-e00a009432f6" />
<img width="1895" height="920" alt="image" src="https://github.com/user-attachments/assets/52bb16a2-db58-40f8-bddc-ddbb912d3f42" />

## 🚀 Getting Started

### 📦 Clone the Repo

```bash
git clone https://github.com/<your-username>/blog-mern.git
cd blog-mern
```
## ⚙️ Backend Setup
```bash
cd Backend
npm install
```
## Create .env file in backend/ folder:
```bash
PORT=5000
MONGO_URI=your_mongo_uri_here
JWT_SECRET=your_jwt_secret_here
```
## Start the backend server:
```bash
npm start
```
##  Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```
## Folder Structure
```bash
mern-blog/
│
├── Backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── helpers/
│   └── server.js
│
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── App.jsx
│   │   └── main.jsx
```
## 🚀 Deployment
Frontend: Vercel / Netlify

Backend: Render / Railway

Database: MongoDB Atlas

## 🙌 Contributing
Contributions are welcome! Feel free to fork the repository and submit a pull request.

# 📋 To-Do List - A Feature-Packed CRUD Application 🚀

Welcome to **To-Do List**, a dynamic task management app designed to conquer your chaos! This project is a full CRUD (Create, Read, Update, Delete) application built with a sleek front-end (HTML, CSS, JavaScript) and a robust back-end (Node.js, Express.js, MongoDB, Redis). Ready to prioritize, organize, and dominate your day? Let’s dive in! 🌟

---

## 🚀 Project Overview

To-Do List empowers you to:
- **Create** tasks with customizable priorities (High, Medium, Low).
- **Read** your tasks, sorted by priority or completion status.
- **Update** tasks via a stylish modal editor.
- **Delete** tasks with ease and keep your list lean.

Built as Task 2, it blends functionality with flair—featuring dark mode, search/filter options, and a secure, scalable backend. Perfect for productivity buffs and code enthusiasts!

---

## 💡 Features

- ✅ **Task Creation:** Add tasks with priority levels and instant UI updates.
- ✅ **Priority Grouping:** High, Medium, and Low tasks neatly organized.
- ✅ **Search & Filter:** Find tasks by text or priority in real-time.
- ✅ **Edit Modal:** Pop-up editor for quick task tweaks.
- ✅ **Completion Tracking:** Move tasks to "Completed" with a checkbox.
- ✅ **Dark Mode:** Toggle between light and dark themes.
- ✅ **Task Counter:** Live count of pending tasks.
- ✅ **Persistent Storage:** MongoDB keeps your tasks safe.
- ✅ **Caching:** Redis speeds up data retrieval.

---

## 🛠️ Tech Stack

### Frontend:
- **HTML5**: Structured layout with modal support.
- **CSS3**: Custom styles, priority colors, and dark-mode toggle.
- **JavaScript**: DOM magic, fetch API for CRUD, and event handling.
- **Font Awesome**: Icons for a polished look.

### Backend:
- **Node.js**: Server runtime.
- **Express.js**: RESTful API framework.
- **MongoDB**: Persistent database with Mongoose ORM.
- **Redis**: Caching for lightning-fast reads.
- **Helmet**: Security headers for protection.
- **Morgan**: Request logging for debugging.

### Tools:
- **Visual Studio Code**: Code editor of choice.
- **Git**: Version control.
- **dotenv**: Environment variable management.

---

## 📂 Project Structure
```bash
to-do-list/
├── public/
│   ├── index.html       # Main HTML file
│   ├── style.css        # Custom styles
│   └── script.js        # Frontend logic
├── config/
│   ├── database.js      # MongoDB connection
│   └── redis.js         # Redis connection
├── controllers/
│   └── middleware/
│       └── errorHandler.js  # Error handling middleware
├── routes/
│   └── todoRoutes.js    # API routes
├── server.js            # Backend server
├── .env                 # Environment variables
├── package.json         # Dependencies
└── README.md            # You’re here!
```

## 🎥 Demo Video
Check out the To-Do List in action!  
![To-Do List Demo](./assets/Demo.webm)

---

## 📋 Prerequisites

- **Node.js**: v16+ recommended.
- **MongoDB**: Local instance or MongoDB Atlas.
- **Redis**: Local instance or Redis Cloud.
- **npm**: For package management.
- **Git**: To clone the repo.

---

## 🚀 Setup & Installation

### 1️⃣ Clone the Repository:
```bash
git clone https://github.com/sureshbarach2001/Todo-Application.git
cd Todo-Application
```
### 2️⃣ Install Dependencies:
```
npm install
```
### 3️⃣ Set Up Environment Variables:
Create a .env file in the root and add:
```
PORT=5000
ACCESS_TOKEN_SECRET=your-access-secret
REFRESH_TOKEN_SECRET=your-refresh-secret
DB_URI_PRODUCTION=your-mongo-uri
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
NODE_ENV=development
```
- Generate secure secrets with openssl rand -hex 32.
- Replace your-mongo-uri with your MongoDB connection string.
- Update Redis settings as needed.
### 4️⃣ Start the Server:
```
node server.js
```
- Runs on http://localhost:5000.
### 5️⃣ Open the Frontend:
- Open public/index.html in a browser or use a local server (e.g., npx live-server public).
---
## 🌐 API Endpoints
- **GET /api/todos:** Fetch all todos.
- **GET /api/todos/:id:** Fetch a single todo.
- **POST /api/todos:** Create a new todo.
- **PUT /api/todos/:id:** Update a todo.
- **DELETE /api/todos/:id:** Delete a todo.
- **GET /api/health:** Check server status.
---
## 📊 Project Status
Current Status: Complete (Task 2 MVP).
Version: 1.0.0
Last Updated: March 16, 2025
---
- ⚠️ Known Issues
- Search Lag: Heavy task lists might slow filtering (Redis helps, but UI could optimize).
- Modal Focus: Rare focus issues on modal open (to be polished).
---
## 🔧 Future Enhancements
- **Notifications:** Add alerts for high-priority tasks.
- **Categories:** Group tasks beyond priority.
- **Cloud Hosting:** Deploy to Vercel/Render.
- **User Auth:** Add login for personal task lists.
---

## 🛠️ Contributing
- Fork this repo.
- Create a branch: git checkout -b feature/your-feature.
- Commit: git commit -m "Add cool stuff".
- Push: git push origin feature/your-feature.
- Open a Pull Request with details!
---
# 📞 Contact
**GitHub:** SureshBarach2001

**Email:** saink4831@gmail.com

## 🎨 Design Highlights
- **Priority Colors:** High (red), Medium (yellow), Low (green) for instant recognition.
- **Dark Mode:** Smooth toggle with a sun/moon icon.
- **Modal Magic:** Clean, centered edit pop-up with glow effects.

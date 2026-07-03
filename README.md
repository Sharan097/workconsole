# 🚀 WorkConsole - Full Stack Task Manager

A modern full-stack task management application built with **React (Vite), Node.js, Express, and MongoDB**.

---

## 🌐 Live Demo

* 🔗 Frontend: https://workconsole.vercel.app
* 🔗 Backend API: https://workconsole-x14d.onrender.com

---

## ✨ Features

- User Authentication with JWT-based secure login/signup flow.
- Create, Read, Update, and Delete tasks with priority and completion tracking.
- AI Suggest feature integrated using Groq AI to automatically generate professional task descriptions and suggest priority levels.
- Global Dark/Light mode implemented using React Context API with persistent user preference.
- Fully responsive UI optimised for desktop, tablet, and mobile devices.


---

## 🛠 Tech Stack

**Frontend:** React.js, Vite, Tailwind CSS, Context API  
**Backend:** Node.js, Express.js, MongoDB, Mongoose  
**Authentication:** JWT Authentication  
**AI Integration:** Groq SDK with Llama model  
**Deployment:** Vercel (Frontend) + Render (Backend)

---

## Why this Tech Stack?

React with Vite was selected for fast development, reusable components, and better performance.  
Node.js and Express provide a lightweight and scalable backend API structure.  
MongoDB was chosen for flexible document-based storage suitable for task data.  
Groq AI was integrated to improve productivity by converting rough task ideas into structured task details.

## ⚙️ Environment Variables

### Frontend (.env)

VITE_API_URL=https://workconsole-x14d.onrender.com

### Backend (.env)

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GROQ_API_KEY=your_groq_api_key

---

## 🚀 How to Run Locally

```bash
# Clone repo
git clone https://github.com/Sharan097/workconsole.git

# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

---

## 👨‍💻 Author

Sharan

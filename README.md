# Store Rating Application

A full-stack web application built with **React (Frontend)**, **Express.js (Backend)**, and **MySQL (Database)**.

## 🚀 Features

- User Registration & Login (with JWT Authentication)
- Role-Based Access Control (Admin, Store Owner, Normal User)
- Submit and Update Store Ratings
- Admin Dashboard to manage Users and Stores
- Store Owner Dashboard to view ratings and users
- Data filtering and sorting
- Password update functionality

## 🛠️ Tech Stack

- Frontend: React, Axios
- Backend: Express.js, Node.js
- Database: MySQL
- Authentication: JWT

## ⚡ Installation

## 1. Clone the repo:

```bash
git clone https://github.com/Mayur1028/StoreRatingApplication1.git
```

## 2. Install dependencies:

### Frontend

```bash
cd frontend
```

```bash
npm install
```

### Backend

```bash
cd backend
```

```bash
npm install
```

## 3. 🛠 Database Setup

This project uses Sequelize for database management, so you do not need XAMPP or phpMyAdmin unless you prefer to use them.

###Requirements

Install MySQL Server (standalone version) on your system.

[MySQL Community Server Download](https://dev.mysql.com/downloads/mysql/)

Configure .env file with your MySQL credentials:

DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=reviewapp

🔹 Make sure to replace your_mysql_username and your_mysql_password with your MySQL user credentials.

Optional: You can still use XAMPP if you prefer, just make sure the credentials match your .env file.

## 4. Configure Environment Variables If Needed:

```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=reviewapp
JWT_SECRET=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30
PORT=5000
```

## 5. Run the App:

### Backend

```bash
npm run dev
```

### Frontend

```bash
npm run dev
```

## ✅ Pre-Registered Users (For Testing)

### Admin

Email: admin@admin.com

Password: Admin@123

### Store Owner

Email: raju12@gmail.com

Password: Mayur@123

### Normal User

Email: mayur@gmail.com

Password: Mayur@123

## ⚠️ Important Note

In this application, a Store Owner cannot register themselves.

The challenge specification only mentions that Normal Users can register via the registration page.

There is no mention of Store Owners being able to self-register.

👉 Therefore, to follow the specification and keep the system secure:

An extra field role was added in the Admin → Add User functionality.

This allows the Admin to manually create a user with the role store_owner.

✅ Additionally, when the Admin assigns a store to a Normal User, that user’s role is automatically updated to store_owner.
This ensures proper role management in the system.

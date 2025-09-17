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
- Database: MySQL (managed via phpMyAdmin)
- Authentication: JWT

## ⚡ Installation

## 1. Clone the repo:

```bash
git clone https://github.com/Mayur1028/StoreRatingApplication.git
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

## 3. Setup MySQL Database:

Install XAMPP (includes MySQL and phpMyAdmin):
Download from https://www.apachefriends.org/index.html

Start Apache and MySQL from XAMPP control panel.

Open phpMyAdmin at http://localhost/phpmyadmin

Create a new database named:

```bash
reviewapp
```

Import the SQL schema file:

In phpMyAdmin → Select the reviewapp database → Click “Import” tab → Choose the file database_import_file.sql → Click “Go” to import tables and initial schema.

## 4. Configure Environment Variables If Needed:

```bash
PORT=5000
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=reviewapp
JWT_SECRET=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30
```

## 5. Run the App:

### Backend

```bash
npm run dev
```

### Frontend

```bash
npm start
```

## ✅ Pre-Registered Users (For Testing)

### Admin

Email: admin@admin.com

Password: Admin@123

### Store Owner

Email: ranchor@gmail.com

Password: #Ranchor@123

### Normal User

Email: mayur@gmail.com

Password: #Mayur@123

## ⚠️ Important Note

In this application, a Store Owner cannot register themselves.

The challenge specification only mentions that Normal Users can register via the registration page.

There is no mention of Store Owners being able to self-register.

👉 Therefore, to follow the specification and keep the system secure:

An extra field role was added in the Admin → Add User functionality.

This allows the Admin to manually create a user with the role store_owner.

✅ This ensures that only the Admin can register Store Owners in the system.

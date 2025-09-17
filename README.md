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
npm install
```

### Backend

```bash
cd backend
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
Create a .env file in the backend folder:
PORT=5000
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=reviewapp
JWT_SECRET=your_jwt_secret
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

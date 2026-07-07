# Habit Tracker REST API

A full-stack **Habit Tracker** application built with **Express.js**, **SQLite (better-sqlite3)**, and **React + Vite**.

This project helps users create, manage, and track daily habits. Users can add new habits, update existing ones, mark habits as completed, track streaks, search habits, and browse records with pagination.

---

# Features

## Backend (Express + SQLite)

* Express.js REST API
* SQLite database using better-sqlite3
* Automatic database and table creation
* Create Habit
* Read Habits
* Update Habit
* Delete Habit
* Mark Habit as Complete
* Automatic streak tracking
* Search habits by title
* Pagination support
* Habit summary endpoint
* CORS enabled
* JSON request handling
* Proper HTTP status codes

---

## Frontend (React + Vite)

* Add Habit Form
* Edit Habit
* Delete Habit
* Mark Habit Complete
* Search Habits
* Pagination
* Habit Summary Cards
* Avatar with Habit Initial
* Character Counter for Title
* Loading Indicator
* Last Updated Timestamp
* Dark Mode Toggle
* Responsive Design
* API Error Handling

---

# Project Structure

```text
Project Folder
│
├── backend
│   └── server
│       ├── index.js
│       └── data.db
│
├── frontend
│   └── apiDemo
│       └── src
│           ├── App.jsx
│           └── App.css
│
└── postman
    ├── Habit-Tracker-API.postman_collection.json
    └── Habit-Tracker.postman_environment.json
```

---

# Technologies Used

## Backend

* Node.js
* Express.js
* SQLite
* better-sqlite3
* CORS

## Frontend

* React
* Vite
* CSS

---

# Installation

## 1. Clone the Repository

```bash
git clone <repository-url>
```

Open the project folder.

---

## 2. Backend Setup

Navigate to the backend folder.

```bash
cd backend/server
```

Install dependencies.

```bash
npm install
```

Required packages:

```text
express
cors
better-sqlite3
```

Start the backend server.

```bash
node index.js
```

Server runs at:

```text
http://localhost:5000
```

---

## 3. Frontend Setup

Open another terminal.

```bash
cd frontend/apiDemo
```

Install dependencies.

```bash
npm install
```

Start the Vite development server.

```bash
npm run dev
```

Usually available at:

```text
http://localhost:5173
```

---

# Database

The application automatically creates:

```text
data.db
```

and the following table:

```text
habits
```

| Column      | Type      |
| ----------- | --------- |
| id          | INTEGER   |
| title       | TEXT      |
| description | TEXT      |
| frequency   | TEXT      |
| completed   | INTEGER   |
| streak      | INTEGER   |
| created_at  | TIMESTAMP |

---

# REST API Endpoints

## Create Habit

```http
POST /habits
```

Required fields:

* title
* frequency

Returns:

* 201 Created
* 400 Bad Request

---

## Get All Habits

```http
GET /habits
```

Query Parameters

```text
?page=1
?limit=5
?search=exercise
```

Example

```http
GET /habits?page=1&limit=5&search=reading
```

Example Response

```json
{
  "data": [],
  "page": 1,
  "limit": 5,
  "total": 10,
  "totalPages": 2
}
```

---

## Get Habit by ID

```http
GET /habits/:id
```

Returns:

* Habit details
* 404 if not found

---

## Update Habit

```http
PUT /habits/:id
```

Update any of the following:

* title
* description
* frequency
* completed
* streak

---

## Mark Habit Complete

```http
PATCH /habits/:id/complete
```

Marks a habit as completed and increases its streak.

---

## Delete Habit

```http
DELETE /habits/:id
```

Response

```json
{
  "message": "Habit deleted successfully"
}
```

---

## Habit Summary

```http
GET /summary
```

Example Response

```json
{
  "totalHabits": 12,
  "completedHabits": 8,
  "longestStreak": 15
}
```

---

# Frontend Features

### Habit Form

* Title
* Description
* Frequency

---

### Validation

Required:

* Title
* Frequency

Displays validation and API error messages.

---

### Character Counter

Example

```text
Title

18 / 40
```

---

### Habit List

Displays:

* Avatar
* Title
* Description
* Frequency
* Completion Status
* Current Streak

---

### Search

Search habits by title.

---

### Pagination

Navigate using:

* Previous
* Next
* Page Numbers

---

### Edit Habit

Loads the selected habit into the form for editing.

---

### Delete Habit

Deletes a habit after user confirmation.

---

### Mark Complete

Marks a habit as completed and updates its streak.

---

### Dark Mode

Switch between Light Mode and Dark Mode using the toggle button.

---

### Loading Indicator

Displays:

```text
Loading habits...
```

while data is being fetched.

---

### Last Updated

Displays the last time the habit list was refreshed.

---

# Postman

The project includes:

```text
Habit-Tracker-API.postman_collection.json
```

Requests include:

* Create Habit
* Get All Habits
* Search Habits
* Get Habit by ID
* Update Habit
* Mark Habit Complete
* Delete Habit
* Habit Summary

Environment file:

```text
Habit-Tracker.postman_environment.json
```

Variables

```text
base_url
```

Default value

```text
http://localhost:5000
```

---

# HTTP Status Codes

| Status | Meaning               |
| ------ | --------------------- |
| 200    | OK                    |
| 201    | Created               |
| 400    | Bad Request           |
| 404    | Not Found             |
| 500    | Internal Server Error |

---

# Example Habit

```json
{
  "title": "Morning Exercise",
  "description": "30 minutes of jogging",
  "frequency": "Daily"
}
```

---

# Future Improvements

* User Authentication (JWT)
* User Accounts
* Habit Categories
* Calendar View
* Reminder Notifications
* Progress Charts
* Export to CSV
* Mobile App Support
* Weekly and Monthly Reports

---

# Learning Outcomes

By completing this project, you will learn:

* REST API development
* CRUD operations
* SQLite database integration
* Express.js routing
* React Hooks
* API integration using Fetch
* Form validation
* Search functionality
* Pagination
* State management
* Dark mode implementation
* Habit tracking concepts

---

# Author

**Habit Tracker REST API**

Built using:

* Express.js
* SQLite
* better-sqlite3
* React
* Vite

This project was developed for educational and learning purposes.

# Personal Expense Tracker

A web-based expense tracking application built with **React, PHP, and MySQL**. It helps users monitor their income and expenses, organize transactions by category, and understand their spending habits through a centralized dashboard.

## Features

- **Dashboard** – View total income, total expenses, and current balance.
- **Transaction Management** – Add, view, edit, and delete income and expense records.
- **Category Management** – Organize transactions into categories.
- **Transaction History** – Review recorded financial transactions.
- **Database Integration** – Store and retrieve transaction data using MySQL.
- **Responsive Interface** – Access the application across different screen sizes.

## Tech Stack

| Technology | Purpose |
|---|---|
| React | Frontend user interface |
| PHP | Backend and API |
| MySQL | Database management |
| HTML5 | Page structure |
| CSS3 | Styling and layout |
| JavaScript | Application functionality |
| Git & GitHub | Version control |

## Project Structure

```text
personal-expense-tracker/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── backend/
│   ├── config/
│   │   └── database.php
│   ├── api/
│   │   ├── transactions/
│   │   └── categories/
│   └── index.php
│
├── database/
│   └── schema.sql
│
├── .gitignore
└── README.md
```

## Getting Started

Follow these instructions to run the project locally.

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [PHP](https://www.php.net/)
- [MySQL](https://www.mysql.com/) or XAMPP
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/Azra-el08/expense-tracker
cd personal-expense-tracker
```

### 2. Set Up the Database

1. Start MySQL through XAMPP or your local MySQL environment.
2. Open phpMyAdmin.
3. Create a database named `expense_tracker`.
4. Import the `database/schema.sql` file.
5. Configure your database connection in `backend/config/database.php`.

### 3. Set Up the Backend

Navigate to the backend directory:

```bash
cd backend
```

Start the PHP development server:

```bash
php -S localhost:8000
```

The backend API will be available at:

```text
http://localhost:8000
```

### 4. Set Up the Frontend

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install the dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm run dev
```

Open the local URL provided by Vite in your browser.

## Application Workflow

1. The user interacts with the React frontend.
2. React sends HTTP requests to the PHP backend.
3. PHP processes the requests and communicates with MySQL.
4. MySQL stores or retrieves the requested transaction data.
5. PHP returns the response to React.
6. React updates the interface with the latest information.

## Learning Objectives

This project is intended to practice and improve skills in:

- Building user interfaces with React components.
- Managing application state and handling user input.
- Performing CRUD operations.
- Creating backend APIs using PHP.
- Connecting a frontend application to a MySQL database.
- Writing SQL queries and managing relational data.
- Using Git and GitHub for version control.

## Future Improvements

- User authentication and account management.
- Monthly and yearly expense summaries.
- Spending charts and visual reports.
- Budget limits and spending alerts.
- Transaction search, filtering, and pagination.
- Export transactions to CSV or PDF.

## Project Status

**Status:** In Development

This project is a learning and portfolio project focused on strengthening frontend development, backend integration, and database management skills.

## License

This project is intended for educational and personal portfolio purposes.

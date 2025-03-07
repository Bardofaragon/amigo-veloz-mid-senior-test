# Personal Loan Application Technical Test

Welcome to the **Personal Loan Application** backend technical test! This project is designed to assess your ability to build a backend application using **Node.js**, **Express.js**, and **PostgreSQL** while implementing features for user authentication, loan management, and loan payments. The app should also be containerized using **Docker**.

---

## Context

You will develop a backend API that:
1. Allows users to register and apply for personal loans.
2. Allows authenticated users to manage their loans and make payments.
3. Includes payments management, loan balance tracking, and loan history.

Your solution should demonstrate your expertise in:
- Backend development using **Node.js**.
- API design and implementation.
- Database design and management with **PostgreSQL**.
- Dockerization of the application for easy deployment.
- Writing modular, clean, and testable code.

---

## Requirements

### Core Features

1. **User Registration and Authentication**
    - Users must be able to register by providing their `name`, `email`, and `password`.
    - Authentication should be implemented using **JWT (JSON Web Tokens)**.
    - Secured endpoints should be accessible only to authenticated users.

2. **Loan Management**
    - Users should be able to:
        - Apply for a loan by specifying:
            - Loan amount.
            - Purpose of the loan.
            - Duration of the loan (in months).
        - View the status of their loans.
        - Loan statuses: **Pending**, **Approved**, or **Rejected**.
    - An endpoint should allow a loan's status to be updated to **Approved** or **Rejected** (e.g., simulating administrative approval).

3. **Payments Management**
    - Users must be able to make payments toward their loan balance.
    - Payment details should include:
        - Loan ID.
        - Amount paid.
        - Payment date.
    - The loan's updated remaining balance should be calculated and stored after each payment.
    - A user's loan payment history should be retrievable via an API endpoint.

4. **Summary of Loan Details**
    - Users should be able to retrieve:
        - Loan total amount.
        - Total paid so far.
        - Remaining balance.
        - Loan status.

---

## Database Schema

You should use **PostgreSQL** to design and implement the database for the application. The following schema is recommended:

### 1. User Table
| Column Name        | Type           | Description                       |
|--------------------|----------------|-----------------------------------|
| `id`               | Integer (PK)   | User's unique identifier.         |
| `name`             | String         | User's full name.                 |
| `email`            | String (Unique)| User's email address.             |
| `password`         | String         | Hashed password.                  |
| `created_at`       | Timestamp      | Time of user registration.        |

### 2. Loan Table
| Column Name        | Type           | Description                       |
|--------------------|----------------|-----------------------------------|
| `id`               | Integer (PK)   | Loan's unique identifier.         |
| `user_id`          | Integer (FK)   | Foreign key referencing a user.   |
| `amount`           | Float          | Total loan amount.                |
| `purpose`          | String         | Purpose of the loan.              |
| `duration`         | Integer        | Loan duration in months.          |
| `status`           | String         | Loan status (`Pending`, `Approved`, `Rejected`). |
| `total_paid`       | Float          | Sum of all payments.              |
| `remaining_balance`| Float          | Outstanding balance of the loan.  |
| `created_at`       | Timestamp      | Time of loan application.         |

### 3. Payment Table
| Column Name       | Type           | Description                       |
|-------------------|----------------|-----------------------------------|
| `id`              | Integer (PK)   | Payment's unique identifier.      |
| `loan_id`         | Integer (FK)   | Foreign key referencing a loan.   |
| `amount_paid`     | Float          | Payment amount.                   |
| `payment_date`    | Date           | Date of payment.                  |
| `created_at`      | Timestamp      | Timestamp of when this record was created. |

---

## API Endpoints

You are expected to implement the following RESTful API endpoints:

### User Authentication
| HTTP Method | Endpoint               | Description                            | Auth Required |
|-------------|------------------------|----------------------------------------|---------------|
| POST        | `/api/users/register`  | Register a new user.                   | No            |
| POST        | `/api/users/login`     | Authenticate and retrieve a JWT token. | No            |

### Loan Management
| HTTP Method | Endpoint                  | Description                                        | Auth Required |
|-------------|---------------------------|----------------------------------------------------|---------------|
| POST        | `/api/loans`              | Submit a new loan application.                    | Yes           |
| GET         | `/api/loans`              | Retrieve all loans for the logged-in user.         | Yes           |
| GET         | `/api/loans/:id`          | Retrieve details of a specific loan.              | Yes           |
| PATCH       | `/api/loans/:id/status`   | Update the status of a loan (Pending → Approved/Rejected). | Yes (Admin only) |

### Payments
| HTTP Method | Endpoint                  | Description                                        | Auth Required |
|-------------|---------------------------|----------------------------------------------------|---------------|
| POST        | `/api/payments`           | Make a payment for a loan.                        | Yes           |
| GET         | `/api/loans/:id/payments` | Retrieve the payment history of a specific loan.  | Yes           |

---

## Deliverables

The following items must be part of the submission:

1. **Source Code**:
    - The backend application, organized and modular.
    - Implementation of the required API endpoints.

2. **Database Management**:
    - Include SQL scripts or migrations for creating the database schema.

3. **Docker Setup**:
    - A `Dockerfile` to containerize the Node.js application.
    - A `docker-compose.yml` to orchestrate the app with a PostgreSQL database.

4. **Testing**:
    - Write at least 3 unit tests covering the key features of the application (e.g., loan creation, payment processing, or JWT authentication).

5. **Documentation**:
    - Include a `README.md` (this file) with:
        - **Setup Instructions**: Steps to build and run the application using Docker Compose.
        - **Explanation of API Endpoints**: Include example requests and responses.
        - **Assumptions**: Clarify any assumptions made during implementation.

---

## Evaluation Criteria

You will be evaluated based on the following:

1. **API Design**:
    - RESTful conventions, consistency, and correctness.
    - Proper HTTP status codes and detailed error handling.

2. **Code Quality**:
    - Modular, maintainable, and well-documented code.
    - Use of best practices such as validation, middleware, environment variables, and security practices.

3. **Database Design**:
    - Efficient schema design and relationships between entities.
    - Correct calculations for loan balances and payments.

4. **Docker and Deployment**:
    - Functional Dockerfile and Docker Compose setup.
    - Ease of local deployment using containers.

5. **Documentation**:
    - Clear `README.md` with well-explained setup and usage instructions.

6. **Bonus Points**:
    - Database migrations with tools like Sequelize or Knex.js.
    - Advanced security features, such as bcrypt for password hashing or rate limiting.
    - Pagination for listing loans or payments.
    - Logging mechanisms for user actions.

---

## Getting Started

Here are the steps to get started:

Here are the steps to get started:

1. Fork the repository.
2. Send the email with the repository URL to me after you completed the solution.

---

Good luck, and happy coding! 🚀

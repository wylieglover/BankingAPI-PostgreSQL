# BankingAPI-PostgreSQL

[![run-docker-compose](https://github.com/wylieglover/BankingAPI-PostgreSQL/actions/workflows/deploy.yml/badge.svg)](https://github.com/wylieglover/BankingAPI-PostgreSQL/actions/workflows/deploy.yml)

![image](https://github.com/user-attachments/assets/6107bf1b-252f-478e-a76f-8866955d7a37)

A robust banking API developed using TypeScript, Node.js, and PostgreSQL, designed to manage core banking operations securely and efficiently.


## Git Hooks

This project uses mandatory git hooks for code quality. They are automatically set up when you clone the repository.

If you're not seeing the hooks work:
1. Check that your git config is correct:
   ```bash
   git config --local --list | grep include.path
2. If needed, manually set it:
    ```bash
   git config --local include.path ../.gitconfig
## Features

- **User Authentication**: Secure user login and registration utilizing JWT tokens.
- **Account Management**: Capabilities to create, update, and manage user bank accounts.
- **Transactions**: Support for deposits, withdrawals, and inter-account transfers.
- **Transaction History**: Access to detailed statements of account activities.

## Technologies Used

- **Backend**: Node.js with Express framework.
- **Database**: PostgreSQL for data storage and management.
- **ORM**: Prisma for database interactions.
- **Authentication**: JSON Web Tokens (JWT) for secure authentication.

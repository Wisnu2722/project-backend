# API DOCUMENTATION

## Overview
This Backend application is using express.js to manage API, and Prisma to manage databases. The application builts was an E-commerce with only one seller and multiple buyer (regular user)

## Project Backend Installation Guide

This guide provides instructions on how to set up the project backend.

## Installation Steps

### 1. Clone the Repository

Clone the project repository from GitHub using the following command:

```bash
git clone https://github.com/Wisnu2722/project-backend.git
```
### 2. Navigate to the Project Folder

After successfully cloning the repository, navigate to the project folder using the `cd` command:

```bash
cd project-backend
```
### 3. Install Dependencies

Install all project dependencies by running the following command:

```bash
npm install
```
## 4. Configuration

### Environment Variables

The project may require certain environment variables to be set for configuration. Check the `.env.example` file for a list of required environment variables and their default values. Create a `.env` file in the project root directory and set the necessary variables.

### Database Configuration

Ensure that the database connection details are correctly configured in the `prisma/schema.prisma` file. Update the database URL, username, password, etc., as required for your environment.

### 5. Database Migration (Optional)

If you need to migrate the database that has been created in the Prisma schema, execute the following command:

```bash
npx prisma migrate dev
```



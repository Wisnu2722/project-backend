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
### 4. Configuration

### Environment Variables

The project may require certain environment variables to be set for configuration. Check the `.env.example` file for a list of required environment variables and their default values. Create a `.env` file in the project root directory and set the necessary variables.

### Database Configuration

Ensure that the database connection details are correctly configured in the `prisma/schema.prisma` file. Update the database URL, username, password, etc., as required for your environment.

### 5. Database Migration (Optional)

If you need to migrate the database that has been created in the Prisma schema, execute the following command:

```bash
npx prisma migrate dev
```
## Running the Server

To start the server, run the following command:

```bash
npm start
```
By default, the server will run on port 4200. You can specify a different port by setting the APP_PORT variable in `.env` file.

## API ENDPOINTS


### Login

The purpose of login is to authenticate user and generate token. Based on information given in login process, the role of user can be identified based on their `role_id`, it could be either a seller or regular user. The login endpoint can be accessed at ```http://localhost:4200/login ```

Example :
- *Request Method :* `POST`
- *Request Body :*
  ```json
  {
    "email": "example@example.com",
    "password": "password"
  }
  ```
- *Response :*
  ```json
  
    {
        "token": "xcxgahbabsgashjgahsgahsajmanaxkja==",
    "user": {
        "id": 1,
        "email": "example@example.com",
        "name": "Smithy Werber Jager Man Jensen"
        }
    }

## user role and permission
### Regular User Role

user with `regular_user` role, have permission:
- can manage their account
- browse products
- add product to cart
- display cart
- checkout order
- display order items
- pay order

### Seller
user with `seller` role, have permission:
- can manage their account
- browse categories
- add categories
- edit categories
- delete categories
- browse products
- add products
- edit products
- delete products
- display carts
- display orders
- display order items


## Categories Endpoints
### browse category
*Request Method :* `GET`

api endpoint : `http://localhost:4200/categories`

## Products Endpoints
### browse product
*Request Method :* `GET`

api endpoint : `http://localhost:4200/products`

*example response :*
```json
{
    "message": "data products",
    "products": [
        {
            "id": 2,
            "name": "Electronic Rubber Computer",
            "category_id": 1,
            "price": 650,
            "in_stock": true,
            "description": "Boston's most advanced compression wear technology increases muscle oxygenation, stabilizes active muscles",
            "created_at": "2024-02-18T09:13:24.000Z",
            "updated_at": "2024-02-18T09:13:23.969Z",
            "category": {
                "name": "gadget"
            }
        },
        {
            "id": 3,
            "name": "Modern Plastic Salad",
            "category_id": 1,
            "price": 728,
            "in_stock": true,
            "description": "The slim & simple Maple Gaming Keyboard from Dev Byte comes with a sleek body and 7- Color RGB LED Back-lighting for smart functionality",
            "created_at": "2024-02-18T09:13:24.000Z",
            "updated_at": "2024-02-18T09:13:23.973Z",
            "category": {
                "name": "gadget"
            }
        }
    ]
}
```

## Cart Endpoints
### browse cart
*Request Method :* `GET`

api endpoint : `http://localhost:4200/cart`

## Orders Endpoints
### browse order
*Request Method :* `GET`

api endpoint : `http://localhost:4200/orders`


## Pay Endpoints
*Request Method :* `Post`

api endpoint : `http://localhost:4200/pay`


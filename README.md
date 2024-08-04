Product Dashboard Application Documentation
===========================================
Overview of the Project:
========================
The Product Dashboard Application is built with React that allows users to manage products effectively. Users can view a list of products, add new products, edit existing ones, and delete products. The application communicates with a mock API server to simulate data fetching and manipulation, providing a realistic development environment.

Features:
===========
View Products: Display a list of products with details such as title, category, price, and brand.

Add Product: A form to add new products to the list.

Edit Product: Inline editing of product details.

Delete Product: Remove products from the list.

Validation: Ensure all fields are filled before submitting the form.


Instructions on How to Set Up and Run the Application Locally:
===============================================================
Prerequisites:
================
Node.js (version 14 or higher) 

npm (Node package manager)


Steps to Set Up the Application:
=================================

1. Clone the Repository: 
git clone https://github.com/Monisha-Vijayakumar/React-Products-App.git

2. Install Dependencies: 
npm install

3. Start the Mock API Server: 
json-server --watch db.json --port 3000

4. Run the Application: 
npm start

5. Access the Application: 
http://localhost:8080/

6. To run the test suite: 
npm test

7. To build the application: 
npm build

Code Structure and Design Choices:
=================================
Code Structure:
================
The application follows a modular approach, organizing code into components and utilities:

src/: Main source folder containing all application files.

components/: Contains React components such as AddProduct, ProductList, etc.

styles/: SCSS files for styling components.

tests/: Unit tests for components.

App.js: Main application component that renders the router and layout.


Design Choices:
===============
State Management: Utilizes React's built-in hooks (useState, useEffect) for managing component state and side effects.

API Communication: Uses Axios for making API requests to the mock server.

Routing: Implements React Router for navigation between the product list and the add product pages.

Styling: SCSS is used for styling, providing a modular and organized way to manage styles.

Responsive designs are achieved with Media Queries and by defining the breakpoints for different screensizes.


Error Handling:
================
The application includes error handling for API calls to ensure a smooth user experience. Appropriate messages are displayed for both success and error scenarios.





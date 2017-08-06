# BAMAZON - NODE CLI/MySQL application with below categories

1. Customer app that allows the customers to buy products

2. Manager app with below options

    * View Products for Sale
    
    * View Low Inventory
    
    * Add to Inventory
    
    * Add New Product

3. Supervisor app with below options

   * View Product Sales by Department
   
   * Create New Department


## Customer App Functionalities

1. Display list of all products whose stock quantity is > 0
2. Prompts the user to enter item id and quantity they want to purchase 
3. If there was NOT enough quantity then displays message as such
4. If there were sufficient quantity, then it displays the current sub total of their bill amount (also at backend it updates the product sales for that product)
5. Then the app asks the user if they want to continue shopping
6. If Yes, repeat from step 1
7. If No, displays the final bill amount and exits the app

## Manager App Functionalities

1. Displays manager menu with below options
    1.1 View Products for Sale - Displays all the products in the inventory
    1.2 View Low Inventory - Displays ONLY the products whose stock is less than 5
    1.3 Add Product - Displays prompts to get details for new product and adds it to the products db
    1.4 Add Inventory - Displays "View Products for Sale" and then prompts for user to enter the item_id and quantity to be added, then updates the db
    1.5 Exit - to exit the app
2. When user selects option  1 - 4 the app performs that function and then displays the menu again
3. With option 5 exits the app

## Supervisor App Functionalities

1. Displays the supervisor menu with below options
    1.1 View Product Sales by Department - Displays summary of sales by department calculating the Profit as (Product Sales for that department - Over Head Costs for that department)
    1.2 Create New Department - Displays prompts to get details for new product and adds it to the departments db
    1.3 Exit - to exit the app
2. When user selects option  1 - 2 the app performs that function and then displays the menu again
3. With option 3 exits the app




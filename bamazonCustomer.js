//importing required modules

var mysql = require('mysql');
var inquirer = require('inquirer');
//config has MySql credentials and it is gitignored
var config = require('./config.js');
//npm package to console log table
require('console.table');

//create a connection object to bamazon db
var connection = mysql.createConnection(config.sqlConfig);

var total = 0;

//connect to the db and call function to display the available products
connection.connect(function(err){
    if (err) throw err;
    displayProducts();
});


//function to display the list of all available products
function displayProducts(){
        //create a query to select all the products
        var displayquery = connection.query(
        'select item_id, product_name, price from products', 
        function(err, res){
            if(err){
                throw err;
            }
            else{
                    console.log('\n');
                    console.table(res);

                    inquirer.prompt([
                        {
                            type: "input",
                            message: "Enter the Item_Id you want to place order for:",
                            name: "itemid"                        
                        },
                        {
                            type: "input",
                            message: "Enter the quantity you want to order:",
                            name: "qty"                        
                        }
                        //call the function to place the order
                    ]).then(function(order){
                        placeOrder(order);

                    });                
                }
        });
}


//function to place the order
function placeOrder(order){
    /*create a query to update the products table to reduce the stock qty by ordered qty and increase product sale for order price
    for the record that matches the user entered id and if the stock is available for the user entered qty*/
    var updatequery = connection.query(
        'update products set stock_qty=stock_qty-'+order.qty+', product_sales=product_sales+'+order.qty+'*price where item_id='+order.itemid+' and stock_qty-'+order.qty+' > 0',
        function(err, upd){
            if(err){
                throw err;
            }
            //if no records were updated then it means insufficient qty display error message
            else if(upd.affectedRows===0) {
                console.log('Sorry cannot place your order due to Insufficient Quantity');
                continueOrder();
            }
            //display the order price if there was sufficient qty and the table was updated
            else{
                var orderquery = connection.query(
                    'select * from products where item_id='+order.itemid,
                    function(err, amount){
                        if(err){
                            throw err;
                        }
                        else{
                            total+=amount[0].price*order.qty;
                            console.log("\nYour current order sub-total is "+total+"\n");
                            continueOrder();

                        }
                    }
                )
            }
        });
        
}

function continueOrder(){
    inquirer.prompt(
            {
                type: "confirm",
                message: "Do you want to continue shopping?",
                default: false,
                name: "continue"                        
            }
    ).then(function(response){
        if(response.continue){
            displayProducts();
        }
        else{
            console.log("\nYour order is placed, your total bill amount is "+total+"\n");
            console.log("Thank you for shopping with BAMAZON!!\n");
            connection.end();
        }
    });

}



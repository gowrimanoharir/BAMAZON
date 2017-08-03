//importing required modules

var mysql = require('mysql');
var inquirer = require('inquirer');
//config has MySql credentials and it is gitignored
var config = require('./config.js')
var close = require('./closeConnection.js')

//create a connection object to bamazon db
var connection = mysql.createConnection(config.sqlConfig);

//connect to the db and call function to display the available products
connection.connect(function(err){
    if (err) throw err;
    displayProducts();
});


//function to display the list of all available products
function displayProducts(){
        //create a query to select all the products
        var displayquery = connection.query(
        'select * from products', 
        function(err, res){
            if(err){
                throw err;
            }
            else{
                console.log("   Item_ID    | Item_Name                         | Item_Price");
                console.log("--------------------------------------------------------------");
                //loop through to display the product ONLY if the stock qty is greater than 0
                for(i=0; i<res.length;i++){
                    if(res[i].stock_qty>0){
                        console.log(res[i].item_id+"    | "+res[i].product_name+"   | "+res[i].price);
                    }
                }
                //once the display is complete then prompt the user to ask for item id and qty they want to buy
                if(i===res.length){
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
            }
    });
}


//function to place the order
function placeOrder(order){
    /*create a query to update the products table to reduce the stock qty by ordered qty 
    for the record that matches the user entered id and if the stock is available for the user entered qty*/
    var updatequery = connection.query(
        'update products set stock_qty=stock_qty-'+order.qty+' where item_id='+order.itemid+' and stock_qty-'+order.qty+' > 0',
        function(err, upd){
            if(err){
                throw err;
            }
            //if no records were updated then it means insufficient qty display error message
            else if(upd.affectedRows===0) {
                console.log('Sorry cannot place your order due to Insufficient Quantity');

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
                            console.log("Your order is placed, your bill amount is "+amount[0].price*order.qty);

                        }
                    }
                )
            }
            //close the connection
            close.closeConnection(connection);
        });
        
}



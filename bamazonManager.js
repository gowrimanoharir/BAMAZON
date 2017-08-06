//importing required modules

var mysql = require('mysql');
var inquirer = require('inquirer');
//config has MySql credentials and it is gitignored
var config = require('./config.js')
//npm to console log a table
require('console.table');

//create a connection object to bamazon db
var connection = mysql.createConnection(config.sqlConfig);

//connect to the db and call function to create products
connection.connect(function(err){
    //call the init function
    managerMenu();
});

//function to display the actions available for a manager to perform
function managerMenu(){
    inquirer.prompt([
		{
			  type: "list",
		      message: "Select an operation to perform",
              name: "mgrmenu",
              choices: ['1 - View Products', '2 - View Low Inventory', '3 - Add to Inventory', '4 - Add New Product', '5 - Exit']
		},
	]).then(function(response){
        if(response.mgrmenu.includes(1)){
            viewSaleProducts();
        }
        else if(response.mgrmenu.includes(2)){
            viewLowInvetory();
        }
        else if(response.mgrmenu.includes(3)){
            viewSaleProducts(addInventory);
        }
        else if(response.mgrmenu.includes(4)){
            addProduct();
        }
        else{
            //close the connection
            connection.end();
        }
    });
}

//function to add new products into the db
function addProduct(){
    inquirer.prompt([
        {
            type: "input",
            message: "Enter the Product Name:",
            name: "prodname"                        
        },
        {
            type: "input",
            message: "Enter the Department Id:",
            name: "deptid"                        
        },
        {
            type: "input",
            message: "Enter the Product Price:",
            name: "prodprice"                        
        }, 
        {
            type: "input",
            message: "Enter the Stock quantity:",
            name: "prodstock"                        
        }                
    ]).then(function(add){
        //create a query to insert user input to db
        var query = connection.query(
            'insert into products set ?', 
            {
                product_name: add.prodname,
                department_id: add.deptid,
                price: add.prodprice,
                stock_qty: add.prodstock
            },
            function(err, res){
                if(err) throw err;
                if(res.affectedRows>0){
                    console.log("\nNew product has been added successfully!\n");
                    //call the init function
                    managerMenu();
                }
        });

    });
}

//function to get all the products that are being sold from db and calls display function
//also has a callback which will be used for add invetory function if that action is selected
function viewSaleProducts(callback){
        //create a query to select all the products
        var allprods = connection.query(
        'select item_id, product_name, department_id, price, stock_qty, product_sales from products', 
        function(err, res){
            if(err){
                throw err;
            }
            else{
                console.log('\n');
                console.table(res);
                //if call back exists call that function
                if(callback){
                    callback();
                }
                //else display the products
                else{
                    managerMenu();
                }
            }
    });
}

//function to get all the products whose stock qty < 5 from db and calls display function
function viewLowInvetory(){
        //create a query to select products with stock qty < 5
        var lowprods = connection.query(
        'select item_id, product_name, department_id, price, stock_qty, product_sales from products where stock_qty < 5', 
        function(err, res){
            if(err){
                throw err;
            }
            else{
                console.log('\n');
                console.table(res);
                managerMenu();
            }
    });
}

//function to add items to existing stock qty for a selected item by the manager
function addInventory(){
    
        inquirer.prompt([
            {
                type: "input",
                message: "Enter the Item_Id you want to add stock for:",
                name: "itemid"                        
            },
            {
                type: "input",
                message: "Enter the quantity you want to add:",
                name: "qty"                        
            }
            
        ]).then(function(add){
            //query to update the stock qty
                var updatequery = connection.query(
                    'update products set stock_qty=stock_qty+'+add.qty+' where item_id='+add.itemid,
                    function(err, upd){
                        if(err){
                            throw err;
                        }
                        //display the updated qty
                        else{
                            var addquery = connection.query(
                                'select * from products where item_id='+add.itemid,
                                function(err, curqty){
                                    if(err){
                                        throw err;
                                    }
                                    else{
                                        console.log("\nCurrent stock quantity for the product "+curqty[0].product_name+" is "+curqty[0].stock_qty+"\n");
                                        managerMenu();
                                    }
                                }
                            )
                        }
                    });
                    
                });                
}




//importing required modules

var mysql = require('mysql');
var inquirer = require('inquirer');
//config has MySql credentials and it is gitignored
var config = require('./config.js')

//create a connection object to bamazon db
var connection = mysql.createConnection(config.sqlConfig);

//connect to the db and call function to create products
connection.connect(function(err){
    //addProduct();
    //viewSaleProducts();
    //viewLowInvetory();
    addInventory();
});

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
            message: "Enter the Department Name:",
            name: "deptname"                        
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
                department_name: add.deptname,
                price: add.prodprice,
                stock_qty: add.prodstock
            },
            function(err, res){
                if(err) throw err;
                if(res.affectedRows>0){
                    console.log("New product has been added successfully!");
                }
        });
    });
}

function viewSaleProducts(){
        //create a query to select all the products
        var allprods = connection.query(
        'select * from products', 
        function(err, res){
            if(err){
                throw err;
            }
            else{
                displayMgrview(res);
            }
    });
}

function viewLowInvetory(){
        //create a query to select all the products
        var lowprods = connection.query(
        'select * from products where stock_qty < 5', 
        function(err, res){
            if(err){
                throw err;
            }
            else{
                displayMgrview(res);
            }
    });
}


function displayMgrview(res){
        console.log("   Item_ID    | Item_Name                         | Item_Price | Stock_Quantity");
        console.log("-------------------------------------------------------------------------------");
        //loop through to display the product ONLY if the stock qty is greater than 0
        for(i=0; i<res.length;i++){
                console.log(res[i].item_id+"    | "+res[i].product_name+"   | "+res[i].price+"  | "+res[i].stock_qty);
        }
        if(i===res.length){
            return true;
        }
}

let p = new Promise((resolve, reject) => {
    var results=viewSaleProducts();
    if(!results){
        reject('error');
    }
    else{
        resolve(results);
    }
});

function addInventory(){
    p.then(function(){
        inquirer.prompt(
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
    });
                    
}




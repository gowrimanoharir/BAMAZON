//importing required modules

var mysql = require('mysql');
var inquirer = require('inquirer');
//config has MySql credentials and it is gitignored
var config = require('./config.js');
require('console.table');

//create a connection object to bamazon db
var connection = mysql.createConnection(config.sqlConfig);

//connect to the db and call function to create products
connection.connect(function(err){
    superMenu();
});

function superMenu(){
    inquirer.prompt([
		{
			  type: "list",
		      message: "Select an operation to perform",
              name: "sprmenu",
              choices: ['1 - View Product Sales by Department', '2 - Create New Department', '3 - Exit']
		},
	]).then(function(response){
        if(response.sprmenu.includes(1)){
            viewSalebyDept();
        }
        else if(response.sprmenu.includes(2)){
            createDept();
        }
        else{
            //close the connection
            connection.end();
        }
    });
}

function createDept(){
    inquirer.prompt([
        {
            type: "input",
            message: "Enter the Department Name:",
            name: "deptname"                        
        },
        {
            type: "input",
            message: "Enter the Over Head Costs:",
            name: "ocosts"                        
        }             
    ]).then(function(add){
        //create a query to insert user input to db
        var query = connection.query(
            'insert into departments set ?', 
            {
                department_name: add.deptname,
                over_head_costs: add.ocosts
            },
            function(err, res){
                if(err) throw err;
                if(res.affectedRows>0){
                    console.log("\nNew Department has been added successfully!\n");
                    superMenu();
                }
        });

    });
}


function viewSalebyDept(){
        //create a query to select all the products
        var dispProds=[];
        var displayquery = connection.query(
        'select d.department_id, d.department_name, d.over_head_costs, sum(p.product_sales) as product_sales, (p.product_sales-d.over_head_costs) as profit from bamazon_db.products p inner join bamazon_db.departments d on p.department_id = d.department_id group by p.department_id',         
        function(err, res){
            if(err){
                throw err;
            }
            else{
                //loop through to build the product array ONLY if the stock qty is greater than 0 and with only required display columns
                console.table(res);
                superMenu();
            }
    });    
}
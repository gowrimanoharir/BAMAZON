var mysql = require('mysql');
var inquirer = require('inquirer');
var config = require('./config.js')

console.log(config.sqlConfig);

var connection = mysql.createConnection(config.sqlConfig);

connection.connect(function(err){
    createProduct();
});

function createProduct(){
    var query = connection.query(
        'insert into products set ?', 
        {
            product_name: 'Harry Potter - Sorcerers Stone',
            department_name: 'Books',
            price: 2.50,
            stock_qty: 50
        },
        function(err, res){
            console.log(res.affectedRows);
    });
}
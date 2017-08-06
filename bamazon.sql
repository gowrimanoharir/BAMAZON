create database bamazon_db;

use bamazon_db;

create table products (
	item_id integer(10) not null auto_increment,
    product_name varchar(100) null,
    department_name varchar(100) null,
    price decimal(10,2) null,
    stock_qty integer(10) null,
    primary key (item_id)
);

update products set stock_qty=stock_qty-1, 
product_sales=product_sales+(1*price) where item_id=1 and stock_qty-1 > 0;


alter table products add product_sales decimal(10,2) default 0 after stock_qty;

alter table products drop column department_name;

alter table products add department_id integer(10) not null after product_name;


insert into bamazon_db.products (product_name, department_name, price, stock_qty) values ('Wonder Woman - Blu Ray', 'Entertainment', 34.99, 150);

create table departments (
	department_id integer(10) not null auto_increment,
    department_name varchar(100) null,
    over_head_costs decimal(10,2) null,
    primary key (department_id)
);

select d.department_id, d.department_name, d.over_head_costs, 
sum(p.product_sales) as product_sales, (p.product_sales-d.over_head_costs) as profit
from bamazon_db.products p right join 
bamazon_db.departments d on p.department_id = d.department_id group by p.department_id
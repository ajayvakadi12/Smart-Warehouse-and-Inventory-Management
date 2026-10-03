const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("../config/database");

const Product = require("../models/Product");
const Warehouse = require("../models/Warehouse");
const Supplier = require("../models/Supplier");
const Order = require("../models/order");
const Shipment = require("../models/Shipment");
const StockTransaction = require("../models/StockTransaction");


async function generateData(){

try{

await connectDB();

console.log("Database Connected");


// Clear old dummy data

await Product.deleteMany({});
await Warehouse.deleteMany({});
await Supplier.deleteMany({});
await Order.deleteMany({});
await Shipment.deleteMany({});
await StockTransaction.deleteMany({});



// ---------------- Warehouses ----------------


const warehouses = await Warehouse.insertMany([

{
warehouseName:"Delhi Main Warehouse",
location:"Delhi",
managerName:"Rahul Sharma",
capacity:5000
},

{
warehouseName:"Mumbai Storage",
location:"Mumbai",
managerName:"Amit Verma",
capacity:4000
},

{
warehouseName:"Bangalore Hub",
location:"Bangalore",
managerName:"Karan Singh",
capacity:6000
},

{
warehouseName:"Pune Distribution Center",
location:"Pune",
managerName:"Rohit Kumar",
capacity:3500
}

]);




// ---------------- Suppliers ----------------


const suppliers = await Supplier.insertMany([

{
supplierName:"Tech Supplies Pvt Ltd",
contactPerson:"Raj Mehta",
email:"tech@gmail.com",
phone:"9876543210",
address:"Delhi"
},

{
supplierName:"Global Electronics",
contactPerson:"Vikas Sharma",
email:"global@gmail.com",
phone:"9876543211",
address:"Mumbai"
}

]);





// ---------------- Products ----------------


// ---------------- Products ----------------


let products=[];


for(let i=1;i<=50;i++){


products.push({

productName:`Warehouse Product ${i}`,

sku:`SKU-${1000+i}`,

category:
i%2===0
?
"Electronics"
:
"Accessories",


description:"Inventory product",


price:
Math.floor(Math.random()*50000)+1000,


quantity:
i % 15 === 0
?
0
:
i % 5 === 0
?
5
:
Math.floor(Math.random()*200)+10,


warehouse:
warehouses[
i%warehouses.length
]._id,


status:
i % 15 === 0
?
"Out of Stock"
:
i % 5 === 0
?
"Low Stock"
:
"Available"


});


}


products = await Product.insertMany(products);




// ---------------- Orders ----------------


let orders=[];


for(let i=1;i<=30;i++){


orders.push({

customerName:`Customer ${i}`,

customerEmail:`customer${i}@gmail.com`,

customerPhone:"9999999999",

shippingAddress:"India",


products:[{

product:
products[i%products.length]._id,

quantity:5,

price:
products[i%products.length].price

}],


totalAmount:
products[i%products.length].price*5,


status:
i % 5 === 0
?
"Pending"
:
i % 3 === 0
?
"Delivered"
:
"Shipped"


});


}


await Order.insertMany(orders);





// ---------------- Shipments ----------------


let shipments=[];


for(let i=1;i<=20;i++){


shipments.push({

supplier:
suppliers[
i%suppliers.length
]._id,


warehouse:
warehouses[
i%warehouses.length
]._id,


products:[{

product:
products[
i%products.length
]._id,


quantity:50

}],


status:
"Received"


});


}


await Shipment.insertMany(shipments);






// ---------------- Stock Transactions ----------------


let transactions=[];


for(let i=1;i<=100;i++){


transactions.push({

product:
products[
i%products.length
]._id,


warehouse:
warehouses[
i%warehouses.length
]._id,


transactionType:
i%4===0?
"Stock Out":
"Stock In",


quantity:
Math.floor(Math.random()*50)+10,


remarks:
"Dummy transaction"


});


}


await StockTransaction.insertMany(transactions);



console.log("Dummy Data Created Successfully 🚀");


process.exit();


}
catch(error){

console.log(error);

process.exit();

}


}



generateData();
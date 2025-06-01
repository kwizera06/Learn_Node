const express = require('express');
const app = express();
const mysql = require('mysql2');
const dotenv = require('dotenv').config();
const port = process.env.port;


const connection = mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME
})

connection.connect((error,result)=>{
    if (error){
        console.error("error to connect to database",error.message);
    }else{
        console.log("connected to database successfull");
    }
})

const createquery =`CREATE TABLE IF NOT EXISTS exxpenses(
    id INT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );`

    connection.query(createquery,(error,result)=>{
        if(error){
            console.error("error to create expense table".error.message);
        }else{
            console.log("expense table succesfull created");
        }
    })




app.listen(port,()=>{
    console.log(`server listeng on port ${port}`);
})


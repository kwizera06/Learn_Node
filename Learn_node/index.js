
const express = require('express');
const app = express();
const mysql = require('mysql2');
const dotenv = require('dotenv').config();


const port= process.env.port
app.use(express.json());

const db = mysql.createConnection({
    host:process.env.DB_host,
    user:process.env.DB_user,
    password:process.env.DB_password,
    database:process.env.DB_name

})


db.connect((error,results)=>{
    if(error)
    {
        console.error("failed to connect ",error.message)
    }else{
        console.log("successfull connected")
    }
})

const queryCreate =`CREATE TABLE IF NOT EXISTS expenses(
    id INT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );`


db.query(queryCreate,(error,results)=>{
    if(error){
        console.error("failed to create table " .error.message);
    }else{
        console.log(" Table successfull created");
    } 
})


app.get('/signin',(req,res)=>{
    const sql = 'SELECT * FROM expenses'
    console.log("headers received",req.headers)
    db.query(sql,(error,results)=>{
        if(error){
            
           return res.status(500).json({
                error:'enternal server error'

            })


        }

        if(results.length === 0){
           return res.status(404).json({
            message:"no expenses found"
           })

        }
        return res.status(200).json(results)
            
        
    })
})

app.get('/expenses/:id', (req, res) => {
    const id = req.params.id;
  
    const sql = 'SELECT * FROM expenses WHERE id = ?';
    db.query(sql, [id], (err, results) => {
      if (err) {
        console.error('Error fetching expense:', err.message);
        return res.status(500).json({ error: 'Failed to fetch expense' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: 'Expense not found' });
      }
  
      res.json(results[0]); 
    });
  });

// app.get('/expenses/:id',(req,res)=>{
//     const id=req.params.id;
//     const sql = 'SELECT * FROM expenses WHERE id=?'

//     db.query(sql,[id],(error,results)=>{
//         if(error){
//             return res.status(500).json({
//                 error:"failed to retrieve"
//             })
//         }
//         if(results === 0){
//             return res.status(404).json({
//                 message:"expense not found"
//             })
//         }
//         return res.status(200).json(results[0])
//     })
// })


app.post('/add-expenses',(req,res)=>{
    const {description,amount} = req.body;
    
    if(!description || !amount){
        return res.status(400).json({
            error: "all field are required"
        })

    }
    if(isNaN(amount)){
        return res.status(400).json({
            error: "amount must a number"
        })
    }
    if(!isNaN(description)){
        return res.status(400).json({
            error:"description must be string"
        })
    }
      const sql ='INSERT INTO expenses (description,amount)VALUES (?,?)'

      db.query(sql,[description,amount],(error,results)=>{
        if(error){
            return res.status(500).json({
                error:"failed to add the data in the table"
            }) 
        }
            
            return res.status(200).json({
                message:"successful added"
            })
      })
})

app.delete('/delete/:id',(req,res)=>{
    const id = req.params.id;
    const sql = 'DELETE FROM expenses WHERE id=?'
    db.query(sql,[id],(error,results)=>{
        if(error){
            return res.status(500).json({
                error:"failed to delete data"
            })
        }
        if(results.length ===0){
            return res.status(404).json({
                message:"no data found"
            })
        }
        return res.status(200).json({
            results:" data deleted"
        })
    })
})

app.put('/change/:id',(req,res)=>{

    const id = req.params.id;
    const {description,amount}=req.body;

    if(!description || !amount){
        return res.status(400).json({
            error:"all feild are required"
        })
    }
    if(!isNaN(description)){
 
        return res.status(400).json({
            error:"description must be string"
        })
    }
    if(isNaN(amount)){
        return res.status(400).json({
            error:"amount must be a number"
        })
    }
    const sql ='UPDATE expenses SET description=?,amount=? WHERE id=?';

    db.query(sql,[description,amount,id],(error,results)=>{
        if(error){
            return res.status(500).json({
                error:"failed to update the data"
            })
        }
        return res.status(200).json({
            results:"data updated"
        })
    })

})

app.listen(port,()=>{
    console.log('the server will listen in ', port)

    
})

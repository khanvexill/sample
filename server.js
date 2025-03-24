const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;
const mysql = require("mysql2");

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))


const db = mysql.createConnection({
  host: "mysql-service", // mysql-service = clusterIP ของ mysql
  user: "root",
  password: "root",
  database: "hqproduction",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to MySQL from another Node!");
});

app.get("/createtables",(req,res)=>{
    const sql = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    db.query(sql, (err) => {
      if (err) {
        console.error("❌ Failed to create users table:", err);
        return;
      }
      console.log("✅ Users table created or already exists");
    });


    const sql2 = `INSERT INTO users (name, email) VALUES 
    ('John Doe', 'john@example.com'),
    ('Jane Doe', 'jane@example.com');
    `;
    db.query(sql2, (err) => {
      if (err) {
        console.error("❌ Failed to insert users:", err);
        return;
      }
      console.log("✅ insert Users");
    });

    res.send("Hello, khanchai");
});

//const initMySQL = async () => {
//    conn = await mysql.createConnection({
//      host: 'db', // หรือใส่เป็น localhost ก็ได้
//      user: 'root',
//      password: 'root',
//      database: 'hqproduction'
//    })
//  }
  
// 📌 Show Users (GET /users)
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// 📌 Add User (POST /users)
app.post("/users", (req, res) => {
  const { name, email } = req.body;
  console.log(req.body);
  if (!name || !email) {
    return res.status(400).json({ error: "Name and Email are required" });
  }

  db.query("INSERT INTO users (name, email) VALUES (?, ?)", [name, email], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: "User added successfully!" });
  });
});

app.get('/adduser',(req,res)=>{

  const name = req.params.name;
  const email = req.params.email;

  console.log(req.body);
  if (!name || !email) {
    return res.status(400).json({ error: "Name and Email are required" });
  }

  db.query("INSERT INTO users (name, email) VALUES (?, ?)", [name, email], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: "User added successfully!" });
  });

});




app.get("/", (req, res) => {
  res.send("Hello, Docker + Node.js + Express! 🚀");
});

app.get("/name",(req,res) => {
    res.send("Hello, khanchai");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

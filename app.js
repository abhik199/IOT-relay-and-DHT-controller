require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the 'public' folder
app.use(express.static("public"));

// MySQL setup
// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "", // Your MySQL password
//   database: "test12", // Your MySQL database name
// });
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL");
});

// API to get LED status
app.get("/getLedStatus", (req, res) => {
  connection.query("SELECT * FROM led_status WHERE id=1", (error, results) => {
    if (error) {
      console.error("Error fetching LED status:", error);
      res.status(500).send("Error fetching LED status");
    } else {
      res.json(results[0]);
    }
  });
});

// API to update LED status
app.post("/updateLedStatus", (req, res) => {
  const { led, status } = req.body;

  const query = `UPDATE led_status SET ${led} = ? WHERE id = 1`;
  connection.query(query, [status], (error) => {
    if (error) {
      console.error("Error updating LED status:", error);
      res.status(500).send("Error updating LED status");
    } else {
      res.sendStatus(200);
    }
  });
});

// API to get sensor data (simulated data for now)
app.get("/getSensorData", (req, res) => {
  const sensorData = {
    temperature: 25, // Simulated temperature value
    humidity: 60, // Simulated humidity value
  };
  res.json(sensorData);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

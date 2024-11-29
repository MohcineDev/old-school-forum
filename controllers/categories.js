const { db } = require("../db/init");

const getCategories = (req, res) => {
  const query = "SELECT id, name FROM categories"; // Fetch all categories

  db.all(query, (err, rows) => {
    if (err) {
      console.error("Database Error:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Database error" }));
      return;
    }

    // Send the categories as a response
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(rows)); // Send categories in JSON format
  });
};

module.exports = getCategories;

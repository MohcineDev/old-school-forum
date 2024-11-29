const { db } = require("../db/init"); // Import the db from the database initialization

const registerUser = (req, res) => {
    let body = "";
    req.on("data", (chunk) => {
        body += chunk;
    });

    req.on("end", () => {
        try {
            const { username, email, password } = JSON.parse(body);

            // Check if email is already used
            db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
                if (err) {
                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "Database error" }));
                    return;
                }

                if (row) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "User already exists" }));
                    return;
                }

                // Insert new user into the database
                db.run(
                    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
                    [username, email, password],
                    function (err) {
                        if (err) {
                            res.writeHead(500, { "Content-Type": "application/json" });
                            res.end(JSON.stringify({ message: "Database error" }));
                            return;
                        }

                        res.writeHead(201, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ message: "User registered successfully" }));
                    }
                );
            });
        } catch (error) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Invalid JSON format" }));
        }
    });
};

module.exports = registerUser;

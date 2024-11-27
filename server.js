const http = require("http");

const fs = require("fs");
const path = require("path");



// Mock database
let users = [];

// Utility function to handle JSON body parsing
function parseJSON(req) {
    return new Promise((resolve, reject) => {
        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", () => {
            try {
                resolve(JSON.parse(body));
            } catch (err) {
                reject(err);
            }
        });
    });
}

// Create the server
const server = http.createServer(async (req, res) => {
    if (req.method === "GET" && req.url === "/") {
        const filePath = path.join(__dirname, "public", "index.html");

        fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Internal Server Error");
                return;
            }

            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(data);
        });
    }
    else if (req.method === "GET" && req.url === "/register") {
        const filePath = path.join(__dirname, "public", "register.html");

        fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Internal Server Error");
                return;
            }

            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(data);
        });
    }
    else if (req.method === "GET" && req.url === "/login") {
        const filePath = path.join(__dirname, "public", "login.html");

        fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Internal Server Error");
                return;
            }

            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(data);
        });
    }
    else if (req.method === "POST" && req.url === "/register") {
        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", () => {
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

                // Insert new user
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
        });
    }
    else if (req.method === "POST" && req.url === "/login") {
        if (req.headers["content-type"] !== "application/json") {
            res.writeHead(400, { "Content-Type": "application/json" });

            res.end(JSON.stringify({ message: "Content-Type must be application/json" }));
            return;
        }

        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", () => {
            try {
                if (!body) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "Empty body received" }));
                    return;
                }
                const { email, password } = JSON.parse(body);
                console.log(JSON.parse(body));

                // Check credentials
                // db.get(
                //     "SELECT * FROM users WHERE email = ? AND password = ?",
                //     [email, password],
                //     (err, row) => {
                        // if (err) {
                        //     res.writeHead(500, { "Content-Type": "application/json" });
                        //     res.end(JSON.stringify({ message: "Database error" }));
                        //     return;
                        // }

                                // if (!row) {
                                //     res.writeHead(401, { "Content-Type": "application/json" });
                                //     res.end(JSON.stringify({ message: "Invalid credentials" }));
                                //     return;
                                // }

                        res.writeHead(200, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ message: "Login successful" }));
                //     }
                // );
            } catch (error) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Invalid JSON" }));
            }
        });
    }
    else if (req.method === "POST" && req.url === "/posts") {
        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", () => {
            const { userId, content } = JSON.parse(body);

            db.run(
                "INSERT INTO posts (user_id, content) VALUES (?, ?)",
                [userId, content],
                function (err) {
                    if (err) {
                        res.writeHead(500, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ message: "Database error" }));
                        return;
                    }

                    res.writeHead(201, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "Post created successfully" }));
                }
            );
        });
    }
    else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Endpoint not found" }));
    }
});

// Start the server
const PORT = 5000;
server.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
});

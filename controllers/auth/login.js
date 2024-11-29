const { db } = require("../../db/init"); 

const loginUser = (req, res) => {
    if (req.headers["content-type"] !== "application/json") {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Content-Type must be application/json" }));
        return;
    }

    let body = "";
    req.on("data", (chunk) => {
        body += chunk;
    });

    req.on("end", () => {
        try {
            if (!body) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Empty body received" }));
                return;
            }

            const { email, password } = JSON.parse(body);

            // Check credentials in the database
            db.get(
                "SELECT * FROM users WHERE email = ? AND password = ?",
                [email, password],
                (err, user) => {
                    if (err) {
                        res.writeHead(500, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ message: "Database error" }));
                        return;
                    }

                    if (!user) {
                        res.writeHead(401, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ message: "Invalid credentials" }));
                        return;
                    }

                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({
                        message: "Login successful",
                        user: {
                            id: user.id,
                            username: user.username,
                            email: user.email,
                        },
                    }));
                }
            );
        } catch (error) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Invalid JSON" }));
        }
    });
};

module.exports = loginUser;

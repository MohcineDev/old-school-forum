const http = require("http");

const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("database.db");


// Initialize tables
db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      )
    `);

    db.run(`
    CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT, -- Unique ID for each post
  user_id INTEGER NOT NULL,             -- ID of the user who created the post
  title TEXT NOT NULL,                  -- Title of the post
  content TEXT NOT NULL,                -- Content of the post
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- Timestamp for when the post was created
  FOREIGN KEY (user_id) REFERENCES users (id)    -- Links to the users table
);
    `);
    db.run(
        `CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  post_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (post_id) REFERENCES posts(id)
);
`
    )
    db.run(`CREATE TABLE IF NOT EXISTS dislikes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  post_id INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (post_id) REFERENCES posts(id)
);
`
    )
    db.run(`CREATE TABLE IF NOT EXISTS likes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  post_id INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (post_id) REFERENCES posts(id)
);
`
    )
});

console.log("Database initialized.");
 

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
    } else if (req.method === "GET" && req.url === "/posts") {
        const query = `
    SELECT posts.id, posts.title, posts.content,
           COUNT(likes.id) AS likes,
           COUNT(dislikes.id) AS dislikes,
           COUNT(comments.id) AS comments
    FROM posts
    LEFT JOIN likes ON posts.id = likes.post_id
    LEFT JOIN dislikes ON posts.id = dislikes.post_id
    LEFT JOIN comments ON posts.id = comments.post_id
    GROUP BY posts.id
  `;
        db.all(query, (err, rows) => {
            if (err) {
                console.error("Database Error:", err);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Database error" }));
                return;
            }

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(rows)); // Send posts as JSON
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
    //auth register
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
                        res.end(JSON.stringify({ message: "Login successful", user: {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                          }, }));
                    }
                );
            } catch (error) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Invalid JSON" }));
            }
        });
    }
    else if (req.method === "POST" && req.url === "/create-post") {
        let body = "";
      
        req.on("data", (chunk) => {
          body += chunk;
        });
      
        req.on("end", () => {
          try {
            const { user_id, title, content } = JSON.parse(body);
      
            // Validate input
            if (!user_id || !title || !content) {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ message: "All fields are required" }));
              return;
            }
      
            // Insert into the posts table
            const query = `INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)`;
            db.run(query, [user_id, title, content], function (err) {
              if (err) {
                console.error("Database Error:", err);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Database error" }));
                return;
              }
      
              res.writeHead(201, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  message: "Post created successfully",
                  post_id: this.lastID,
                })
              );
            });
          } catch (err) {
            console.error("JSON Parsing Error:", err.message);
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Invalid JSON format" }));
          }
        });
      } else if (req.method === "POST" && (req.url === "/like" || req.url === "/dislike")) {
        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", () => {
          try {
            const { user_id, post_id } = JSON.parse(body);
            const table = req.url === "/like" ? "likes" : "dislikes";
      
            db.run(
              `INSERT INTO ${table} (user_id, post_id) VALUES (?, ?)`,
              [user_id, post_id],
              function (err) {
                if (err) {
                  console.error("Database Error:", err);
                  res.writeHead(500, { "Content-Type": "application/json" });
                  res.end(JSON.stringify({ message: "Database error" }));
                  return;
                }
                res.writeHead(201, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({ message: `${table.slice(0, -1)} recorded.` })
                );
              }
            );
          } catch (err) {
            console.error("JSON Parsing Error:", err.message);
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Invalid JSON format" }));
          }
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

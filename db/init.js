const sqlite3 = require("sqlite3").verbose();

// Initialize the database and create tables
const db = new sqlite3.Database("database.db");
/*
.mode column
sqlite3 database.db
PRAGMA TABLE_info(dislikes);
//display exist columns // avoiding sqlite schema cache after altering the table
PRAGMA table_info(likes);
DROP TABLE IF EXISTS likes;
*/

// Initialize tables 

const initializeDatabase = () => {
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
            CREATE TABLE IF NOT EXISTS categories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE NOT NULL,
                description TEXT
            )
        `);
        db.run(`
            CREATE TABLE IF NOT EXISTS posts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        `);
        db.run(`
            CREATE TABLE IF NOT EXISTS post_categories (
                post_id INTEGER NOT NULL,
                category_id INTEGER NOT NULL,
                FOREIGN KEY (post_id) REFERENCES posts (id),
                FOREIGN KEY (category_id) REFERENCES categories (id),
                PRIMARY KEY (post_id, category_id)
            )
        `);
        db.run(`
            CREATE TABLE IF NOT EXISTS comments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                post_id INTEGER NOT NULL,
                content TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (post_id) REFERENCES posts(id)
            )
        `);

        db.run(`
          CREATE TABLE IF NOT EXISTS dislikes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    post_id INTEGER NOT NULL, -- Use post_id for both posts and comments
    comment_id INTEGER, -- Add comment_id column for comments
    is_comment INTEGER DEFAULT 0, -- 0 for posts, 1 for comments
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (post_id) REFERENCES posts(id),
    FOREIGN KEY (comment_id) REFERENCES comments(id) -- Add foreign key reference for comments
)
        `);

        db.run(`
         CREATE TABLE IF NOT EXISTS likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    post_id INTEGER NOT NULL, -- Use post_id for both posts and comments
    comment_id INTEGER, -- Add comment_id column for comments
    is_comment INTEGER DEFAULT 0, -- 0 for posts, 1 for comments
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (post_id) REFERENCES posts(id),
    FOREIGN KEY (comment_id) REFERENCES comments(id) -- Add foreign key reference for comments
)
        `);
    });

    console.log("Database initialized.");
};

// Export the database and the initialization function
module.exports = {
    db,
    initializeDatabase,
};

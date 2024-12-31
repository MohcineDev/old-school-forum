const http = require("http")
const fs = require("fs")
const path = require("path")
const swaggerUiDist = require('swagger-ui-dist');
const { parse } = require('yaml');

const PORT = process.env.PORT || 5000;
// Read and parse swagger.yaml file

let swaggerSpec;
try {
  const swaggerDocument = fs.readFileSync(path.join(__dirname, 'swagger.yaml'), 'utf8');
  console.log('Raw YAML content:', swaggerDocument); // Debug the raw YAML
  swaggerSpec = parse(swaggerDocument);
  console.log('Parsed Swagger Spec:', swaggerSpec); // Debug the parsed object
} catch (error) {
  console.error('Error loading or parsing swagger.yaml:', error);
  process.exit(1);
}

// Import the database initialization and the db instance
const { db, initializeDatabase } = require("./db/init")
const authRoutes = require("./routes/authRoutes");
const createPost = require("./controllers/createPost")
const getPosts = require("./controllers/posts")
const categoryRoutes = require("./routes/categoryRoutes");
const likeDislikeRoutes = require("./routes/likeDislikeRoutes");
const getPostDetails = require("./controllers/postDetails");
const deletePost = require("./controllers/handlePostDelete");
const profileRoute = require('./routes/profileRoute');
const addComment = require("./controllers/addComment");
const interactComment = require('./routes/interactCommentRoutes');
const getUserPosts = require("./routes/getUserPosts");

// Initialize the database tables
initializeDatabase()

// Helper function to determine content type
function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.json': 'application/json'
  };
  return contentTypes[ext] || 'text/plain';
}

// Create the server
const server = http.createServer((req, res) => {

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  // Serve Swagger UI at /api-docs
  if (req.url === '/api-docs' || req.url === '/api-docs/') {
    const indexHtml = fs.readFileSync(
      path.join(swaggerUiDist.getAbsoluteFSPath(), 'index.html'),
      'utf-8'
    );

    // Create the modified HTML with proper SwaggerUI configuration
    const html = indexHtml.replace(
      '<div id="swagger-ui"></div>',
      `<link rel="stylesheet" type="text/css" href="/swagger-ui-dist/swagger-ui.css" />
      <link rel="stylesheet" type="text/css" href="/swagger-ui-dist/index.css" />
      <div id="swagger-ui"></div>
      <script src="/swagger-ui-dist/swagger-ui-bundle.js"></script>
      <script src="/swagger-ui-dist/swagger-ui-standalone-preset.js"></script>
      <script>
          window.onload = function() {
              const ui = SwaggerUIBundle({
                  spec: ${JSON.stringify(swaggerSpec)},
                  dom_id: '#swagger-ui',
                  deepLinking: true,
                  presets: [
                      SwaggerUIBundle.presets.apis,
                      SwaggerUIStandalonePreset
                  ],
                  plugins: [
                      SwaggerUIBundle.plugins.DownloadUrl
                  ],
                  layout: "BaseLayout"
              });
          };
      </script>`
    );

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
    return;
  }

  // Improved static file serving for Swagger UI assets
  if (req.url.startsWith('/swagger-ui-dist/')) {
    const requestedFile = req.url.replace('/swagger-ui-dist/', '');
    console.log('Requested Swagger file:', requestedFile);
    const filePath = path.join(swaggerUiDist.getAbsoluteFSPath(), requestedFile);

    // List of allowed files to serve
    const allowedFiles = [
      'swagger-ui.css',
      'index.css',
      'swagger-ui-bundle.js',
      'swagger-ui-standalone-preset.js',
      'swagger-ui.js',
      'absolute-path.js',
      'swagger-initializer.js'
      // Add any other required files here
    ];

    if (allowedFiles.includes(requestedFile)) {
      try {
        const content = fs.readFileSync(filePath);
        const contentType = getContentType(filePath);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      } catch (error) {
        console.error(`Error serving ${requestedFile}:`, error);
        res.writeHead(404);
        res.end('Not Found');
      }
    } else {
      console.warn(`Attempted to access unauthorized file: ${requestedFile}`);
      res.writeHead(404);
      res.end('Not Found');
    }
    return;
  }
  //end swagger
  const staticFiles = ["css", "js", "imgs", 'components'];

  for (const fileType of staticFiles) {
    const fileRegex = new RegExp(`^\/${fileType}\/(.*)`);
    const match = req.url.match(fileRegex);

    if (match) {
      const filePath = path.join(__dirname, "public", fileType, match[1]);
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("File not found");
          return;
        }

        let contentType = "text/plain";
        if (fileType === "css") {
          contentType = "text/css";
        } else if (fileType === "js" || fileType === 'components') {
          contentType = "application/javascript";
        } else if (fileType === "yaml") {
          contentType = "application/x-yaml";
        }

        res.writeHead(200, { "Content-Type": contentType });
        res.end(data);
      });
      return;
    }
  }

  if (req.method === "GET" && req.url === "/") {
    const filePath = path.join(__dirname, "public/views", "index.html")

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" })
        res.end("Internal Server Error")
        return
      }

      res.writeHead(200, { "Content-Type": "text/html" })
      res.end(data)
    })
  }
  else if (req.method === "GET" && req.url === "/posts") {
    getPosts(req, res)
  }

  ///for single post
  else if (req.url.startsWith("/post/")) {
    const filePath = path.join(__dirname, "public/views", "post.html")

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" })
        res.end("Internal Server Error")
        return
      }

      res.writeHead(200, { "Content-Type": "text/html" })
      res.end(data)
    })
  }
  else if (req.method === "GET" && req.url === "/register") {
    const filePath = path.join(__dirname, "public/views", "register.html")

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" })
        res.end("Internal Server Error")
        return
      }

      res.writeHead(200, { "Content-Type": "text/html" })
      res.end(data)
    })
  }
  else if (req.method === "GET" && req.url === "/login") {
    const filePath = path.join(__dirname, "public/views", "login.html")

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" })
        res.end("Internal Server Error")
        return
      }

      res.writeHead(200, { "Content-Type": "text/html" })
      res.end(data)
    })
  }
  ///
  ////serve profile page
  else if (req.method === "GET" && req.url === "/profile") {
    const filePath = path.join(__dirname, "public/views", "profile.html")
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" })
        res.end("Internal Server Error")
        return
      }

      res.writeHead(200, { "Content-Type": "text/html" })
      res.end(data)
    })
  }
  else if (req.url.startsWith('/user/')) {
    // Handle fetching user profile
    const userId = req.url.split("/user/")[1];

    profileRoute(req, res, userId)
  }
  ///update user
  else if (req.method === 'PUT' && req.url.startsWith("/update")) {
    profileRoute(req, res, userId)
  }
  //AUTH
  else if (req.url.startsWith("/register") || req.url.startsWith("/login")) {
    authRoutes(req, res);
  }
  else if (req.method === "POST" && req.url === "/create-post") {
    createPost(req, res) // Call the createPost function
  }
  else if (req.url === "/categories") {
    categoryRoutes(req, res);
  }
  else if (req.url === "/like" || req.url === "/dislike") {
    likeDislikeRoutes(req, res);
  }
  ///req.method === "POST" && 
  else if (req.url.startsWith("/get-post/")) {
    // Extract post ID from the URL
    const postId = req.url.split("/get-post/")[1];

    // Fetch and serve the post details
    getPostDetails(req, res, postId);
  }
  else if (req.method === 'DELETE' && req.url.startsWith("/post_delete")) {
    deletePost(req, res);  // Call the deletePost function
  }

  ///add comment
  else if (req.method === 'POST' && req.url.startsWith("/add-comment")) {
    addComment(req, res);  // 
  }
  else if (req.method === 'POST' && (req.url.startsWith("/like-comment") || req.url.startsWith("/dislike-comment"))) {
    interactComment(req, res);  //  

  }
  else if (req.method === "POST" && req.url.startsWith('/get-user-posts')) {

    getUserPosts(req, res)
  }
  else {
    res.writeHead(404, { "Content-Type": "application/json" })
    res.end(JSON.stringify({ message: "---Endpoint not found", msg: "---Endpoint not found" }))
  }
})

// Start the server
server.listen(PORT, "0.0.0.0", () => {
  console.log(`API running on http://localhost:${PORT}`)
  console.log(`Swagger UI at http://localhost:${PORT}/api-docs`);
})

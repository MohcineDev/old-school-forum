// Check if user is logged in
const userId = localStorage.getItem("user_id");
const logoutButton = document.getElementById("logoutButton");
// Check if user is logged in

const loginLink = document.getElementById("loginLink");
const registerLink = document.getElementById("registerLink");
const profile = document.querySelector('.profile')

logoutButton.addEventListener("click", function () {
    // Clear user data from localStorage
    localStorage.clear();

    // Redirect to the login page
    window.location.href = "/";
});
if (userId) {
    ///set the usrename
    profile.querySelector('p').textContent = localStorage.getItem("username");
    // Hide Login and Register, show Logout
    loginLink.style.display = "none";
    registerLink.style.display = "none";
    logoutButton.style.display = "inline-block";
    // Show logout button
    logoutButton.style.display = "inline-block";

    // Add post form for logged-in users
    // Add post form for logged-in users
    document.getElementById("postFormContainer").innerHTML = `
<h2>Create a Post</h2>
<form id="createPostForm">
  <label for="title">Title:</label><br>
  <input type="text" id="title" name="title" required><br>

  <label for="content">Content:</label><br>
  <textarea id="content" name="content" required></textarea><br>

  <label for="categories">Categories:</label><br>
  <select id="categories" name="categories" multiple required>
  
  </select><br>

  <button type="submit">Submit Post</button>
</form>
`;

    // Fetch categories from the backend and populate the dropdown
    fetch('http://localhost:5000/categories')
        .then(response => response.json())
        .then(categories => {
            const categoriesSelect = document.getElementById("categories");
            console.log(categories);
            
            categories.forEach(category => {
                const option = document.createElement("option");
                option.value = category.id;
                option.textContent = category.name;
                categoriesSelect.appendChild(option);
            });
        })
        .catch(error => console.error("Error fetching categories:", error));

    // Handle post submission
    document.getElementById("createPostForm").addEventListener("submit", function (event) {
        event.preventDefault();

        const title = document.getElementById("title").value.trim();
        const content = document.getElementById("content").value.trim();
        const categoriesSelect = document.getElementById("categories");
        const selectedCategories = Array.from(categoriesSelect.selectedOptions).map(option => option.value);

        const userId = localStorage.getItem("user_id");

        fetch("http://localhost:5000/create-post", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userId, title, content, categories: selectedCategories })
        })
            .then((response) => response.json())
            .then((data) => {
                alert(data.message);
                window.location.reload();
            })
            .catch((error) => alert("Error creating post: " + error.message));
    });


    // Logout functionality
    logoutButton.addEventListener("click", function () {
        localStorage.clear();
        window.location.reload();
    });
}
else {
    // Show Login and Register, hide Logout
    loginLink.style.display = "inline-block";
    registerLink.style.display = "inline-block";
    logoutButton.style.display = "none";
}
// Import formatDistanceToNow from date-fns

// Fetch and display posts

fetch("http://localhost:5000/posts")
    .then((response) => response.json())
    .then((posts) => {
        console.log(posts);

        const postsContainer = document.getElementById("postsContainer");
        postsContainer.innerHTML = posts.length
            ? posts
                .map((post) => {

                    return `
               <div class="post">
                   <h3><a href="/post/${post.id}">${post.title}</a></h3>

                   <p>${post.content}</p>
                   <p><em>Posted By ${post.username} ON ${post.created_at}</em></p> 
                   <p><em> ${post.categories != null ? `categories : ${post.categories}` : `-`}</em></p> 
                        
                   <p>
                       <strong>Likes:</strong> ${post.likes} | 
                       <strong>Dislikes:</strong> ${post.dislikes} | 
                       <strong>Comments:</strong> ${post.comments}
                   </p>
                   ${userId
                            ? `<button onclick="interact('like', ${post.id})">Like</button>
                          <button onclick="interact('dislike', ${post.id})">Dislike</button>`
                            : ""
                        }
               </div>
               `;
                })
                .join("")
            : "<p>No posts available. Be the first to create one!</p>";
    })
    .catch((error) => console.error("Error fetching posts:", error));


// Interaction functions for like/dislike
function interact(action, postId) {
    fetch(`http://localhost:5000/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, post_id: postId }),
    })
        .then((response) => response.json())
        .then((data) => {
            alert(data.message);
            window.location.reload();
        })
        .catch((error) => alert("Error interacting with post: " + error.message));
}
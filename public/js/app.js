if (userId) {
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
    fetch('/categories')
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

        fetch("/create-post", {
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

    console.log('What...!!')

}
// Import formatDistanceToNow from date-fns

// Fetch and display posts

fetch("/posts")
    .then((response) => response.json())
    .then((posts) => {
        console.log(posts);

        const postsContainer = document.getElementById("postsContainer");
        postsContainer.innerHTML = posts.length
            ? posts
                .map((post) => {

                    return `
               <div class="post">
               <p class="author"><em>Posted By ${post.username} ON ${post.created_at}</em></p> 
                   <h3><a href="/post/${post.id}">${post.title}</a></h3>

                   <p>${post.content}</p>
                   <p><em> ${post.categories != null ? `categories : ${post.categories}` : `-`}</em></p> 
                        
                   <p>
                       <strong>Likes:</strong> ${post.likes} | 
                       <strong>Dislikes:</strong> ${post.dislikes} | 
                       <strong>Comments:</strong> ${post.comments}
                   </p>
                   <hr/>
                   ${userId
                            ? `<div class="btns">
                            <div>
                            <button onclick="interact('like', ${post.id})">Like</button>
                            <button onclick="interact('dislike', ${post.id})">Dislike</button>                          
                          </div>
                            <div> ${post.user_id == userId ? `
                                <button onclick="interact('delete', ${post.id})">Delete</button>`
                                : ""}
                          </div>
                          
                          </div>`
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
    if (action === 'delete') {

        fetch(`/post_delete/${postId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userId, post_id: postId }),
        })
            .then((response) => response.json())
            .then((data) => {
                alert(data.message);
                window.location.reload();
            })
            .catch((error) => alert("Error interacting with post: " + error.message));

    } else {

        fetch(`/${action}`, {
            method: action == 'delete' ? "DELETE" : "POST",

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
}
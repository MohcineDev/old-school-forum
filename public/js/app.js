if (userId) {
    // Add post form for logged-in users
    document.getElementById("postFormContainer").innerHTML = `
<h2>Create a Post</h2>
<form id="createPostForm">
  <label for="title">Title:</label><br>
  <input type="text" id="title" name="title" placeholder="Post Title" required><br>

  <label for="content">Content:</label><br>
  <textarea id="content" name="content" rows="4" placeholder="Post Content" required></textarea><br>

  <label for="categories">Categories:</label><br>
  <div class="category-tags"> 
    </div>

  <button type="submit " class="btn">Submit Post</button>
</form>
`

    // Fetch categories from the backend
    fetch('/categories')
        .then(response => response.json())
        .then(categories => {
            const categoryTags = document.querySelector(".category-tags")

            categories.forEach(category => {
                const label = document.createElement('label')
                label.setAttribute("for", category.name)
                label.textContent = category.name

                const check = document.createElement('input')
                check.type = "checkbox"
                check.id = category.name
                check.value = category.id
                categoryTags.appendChild(check)
                categoryTags.appendChild(label)
            })

        })
        .catch(error => console.error("Error fetching categories:", error))
    console.log(document.querySelectorAll('.category-tags'))
    console.log(document.querySelectorAll('#categories'))

    //
    ////create post 
    // Handle post submission
    //
    document.getElementById("createPostForm").addEventListener("submit", function (event) {
        event.preventDefault()


        const title = document.getElementById("title").value.trim()
        const content = document.getElementById("content").value.trim()
        const categoriesSelect = document.getElementById("categories")
        const selectedCategories = Array.from(document.querySelectorAll('input[type=checkbox]:checked'), elem => elem.value)

        const userId = localStorage.getItem("user_id")

        fetch("/create-post", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userId, title, content, categories: selectedCategories })
        })
            .then((response) => response.json())
            .then((data) => {
                alert(data.message)
                window.location.reload()
            })
            .catch((error) => alert("Error creating post: " + error.message))
    })



}
else {

    console.log('Whaaat...!!')

}
// Import formatDistanceToNow from date-fns

// Fetch and display posts

fetch("/posts")
    .then((response) => response.json())
    .then((posts) => {

        const postsContainer = document.getElementById("postsContainer")
        postsContainer.innerHTML = posts.length
            ? posts
                .map((post) => {
                    return `
               <article class="post">
               <p class="author"><em>Posted By ${post.username} ON ${post.created_at}</em></p> 
                   <h3><a href="/post/${post.id}">${post.title}</a></h3>

                   <p>${post.content}</p>
                   <p><em> ${post.categories != null ? `categories : ${post.categories}` : `-`}</em></p> 
                        
                   <div class="stats">
                       <strong>Likes:</strong> ${post.likes} | 
                       <strong>Dislikes:</strong> ${post.dislikes} | 
                       <strong>Comments:</strong> ${post.comments}
                   </div>
                   <hr/>
                   ${userId
                            ? `<div class="btns">
                            <div>
                            <button class="btn" onclick="interact('like', ${post.id})">Like</button>
                            <button class="btn" onclick="interact('dislike', ${post.id})">Dislike</button>                          
                          </div>
                            <div> ${post.user_id == userId ? `
                                <button class="btn" onclick="interact('delete', ${post.id})">Delete</button>`
                                : ""}
                          </div>
                          
                          </div>`
                            : ""
                        }
               </article>
               `
                })
                .join("")
            : "<p>No posts available. Be the first to create one!</p>"
    })
    .catch((error) => console.error("Error fetching posts:", error))


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
                alert(data.message)
                window.location.reload()
            })
            .catch((error) => alert("Error interacting with post: " + error.message))

    } else {

        fetch(`/${action}`, {
            method: action == 'delete' ? "DELETE" : "POST",

            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userId, post_id: postId }),
        })
            .then((response) => response.json())
            .then((data) => {
                alert(data.msg)
                window.location.reload()
            })
            .catch((error) => alert("Error interacting with post: " + error.msg))
    }
}
import { postForm } from '../components/postForm.js';

const postsContainer = document.getElementById("postsContainer")
const createPost = document.getElementById("postFormContainer")
let asideCategories = document.querySelector("aside .categories")
let aside = document.querySelector("aside ")



if (userId) {
    // Add post form for logged-in users
    //
    ////create post 
    // Handle post submission
    createPost.innerHTML = postForm([])
    // 
}
else {
    console.log('Whaaat...!!')
}
// Import formatDistanceToNow from date-fns
// Fetch and display posts
let postsData = {}


function getPosts() {

    fetch("/posts")
        .then((response) => response.json())
        .then(({ posts, likesIds, dislikesIds }) => {
            postsData = { posts, likesIds, dislikesIds };
            document.getElementById('loader').style.display = 'none';

            listPosts(posts)
        })
        .catch((error) => console.error("Error fetching posts:", error))
}


// Fetch categories from the backend
fetch('/categories')
    .then(response => response.json())
    .then(categories => {
        ////category Tags used in the form for post creation 
        const categoryTags = document.querySelector(".category-tags")
        ///categories used for filtering posts
        //  asideCategories = document.querySelector(".categories")

        appendBtns(asideCategories, 'button', [{ onclick: ['btnDown(event)'] }, { class: ['active'] }], 'All')
        categories.forEach(category => {
            appendBtns(asideCategories, 'button', [{ onclick: ['btnDown(event)'] }], category.name)

            if (userId) {
                const label = document.createElement('label')
                label.setAttribute("for", category.name)
                label.textContent = category.name

                const check = document.createElement('input')
                check.type = "checkbox"
                check.id = category.name
                check.value = category.id
                categoryTags.appendChild(check)
                categoryTags.appendChild(label)
            }
        })
        appendBtns(asideCategories, 'button', [{ onclick: ['btnDown(event)'] }], 'uncategorised')
    })
    .catch(error => console.error("Error fetching categories:", error))
// Interaction functions for like/dislike
function interact(action, postId) {
    console.log('hi from interact');

    if (action === 'delete') {
        confirm("Are you sure? This post might haunt you!") ?
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
                .catch((error) => alert("Error interacting with post: " + error.message)) : null
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
///// Make it the interact function available globally so it can be used with the onclick event
window.interact = interact;

function handleFormSubmition(z) {
    // document.getElementById("createPostForm").addEventListener("submit", function (event) {
    z.preventDefault()

    let title = document.getElementById("title")
    let content = document.getElementById("content")
    const selectedCategories = Array.from(document.querySelectorAll('input[type=checkbox]:checked'), elem => elem.value)

    let postTitle = title?.value.trim()
    let postDesc = content?.value.trim()

    if (!postTitle || !postDesc) {
        alert('please enter post title and description!!')
        return
    }
    fetch("/create-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, postTitle, postDesc, categories: selectedCategories })
    })
        .then((response) => response.json())
        .then((data) => {
            alert(data.message)
            ///implementation of SPA
            //window.location.reload()
            getPosts()

            title.value = ""
            content.value = ""
        })
        .catch((error) => alert("Error creating post: " + error.message))
    // })
}
window.handleFormSubmition = handleFormSubmition

const btnDown = (e) => {
    removeClass(aside.querySelectorAll('button'))
    e.target.classList.add('active')

    e.target.textContent === "ASC" ? listPosts(postsData.posts.sort((a, b) => a.likes - b.likes))
    : e.target.textContent === "DESC" ? listPosts(postsData.posts.sort((a, b) => b.likes - a.likes))
        : e.target.textContent === 'All' ?
            listPosts(postsData.posts) : e.target.textContent === 'uncategorised' ? listPosts(postsData.posts.filter(post => post.categories == null ? post : null)) :
                listPosts(postsData.posts.filter(post => post.categories ? post.categories.includes(e.target.textContent) : null))
}

const aa = () => {
    console.log("postsData : ",);
    //postsData.posts, postsData.likesIds, postsData.dislikesIds
}

window.btnDown = btnDown

function listPosts(posts) {
    console.log(posts)
    postsContainer.innerHTML = ''
    postsContainer.innerHTML = posts.length
        ? posts
            .map((post) => {
                return `
           <article class="post">
               <p class="author"><em>Posted By ${post.username} ON ${post.created_at}</em></p> 
               <h3><a href="/post/${post.id}">${post.title}</a></h3>
               <p>${post.content}</p>
               <p><em> ${post.categories != null ? `categories : ${post.categories}` : `this still haven't been already setting or in a specifiiilkk catergorieos...:) read this also m`}</em></p> 
               <div class="stats">
                   <strong>Likes:</strong> ${post.likes} | 
                   <strong>Dislikes:</strong> ${post.dislikes} | 
                   <strong>Comments:</strong> ${post.comments}
               </div>
               <hr/>
               ${userId
                        ? `<div class="btns">
                                <div>
                                    <button class="btn ${postsData.likesIds.some(elem => elem.user_id == userId && elem.post_id === post.id) ? 'liked' : ''}"   
                                    onclick="interact('like', ${post.id})">Like</button>
                                    <button class="btn ${postsData.dislikesIds.some(elem => elem.user_id == userId && elem.post_id === post.id) ? 'disliked' : ''}" 
                                    onclick="interact('dislike', ${post.id})">Dislike</button>                          
                                </div>
                                <div> ${post.user_id == userId ?
                            `<button class="btn" onclick="interact('delete', ${post.id})">Delete</button>` : ""}
                              </div>
                          </div>`
                        : ""
                    }
           </article>
           `
            })
            .join("")
        : "<p>No posts available. Be the first to create one!</p>"
}

///remove active category classsss
const removeClass = (btns) => {
    btns.forEach(btn => btn.classList.remove('active'))
}

getPosts()

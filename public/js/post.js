const article = document.querySelector('article')
const postId = document.location.pathname.split('/post/')[1]
const addComment = document.querySelector('.add-comment button')
const textarea = document.querySelector('.add-comment textarea')

fetch(`/get-post/${postId}`, {
    method: 'post',
    body: JSON.stringify({ userId })
})
    .then(res => res.json())
    .then(data => injectData(data))
    .catch(err => alert("somethingg internal went wrong!! :(", err))

function injectData(data) {
    console.log(data)

    article.querySelector('.post-author em').textContent = `Posted by ${data.post.username} on ${data.post.created_at}`
    article.querySelector('h2').textContent = data.post.title
    article.querySelector('.post-content p').textContent = data.post.content
    article.querySelector('.stats>p:nth-child(1) span').textContent = data.post.likes
    article.querySelector('.stats>p:nth-child(2) span').textContent = data.post.dislikes
    article.querySelector('.stats>p:nth-child(3) span').textContent = data.post.comments
    //add like onclick
    addBtns(data.post)
    // data.liked ? article.querySelector('.post-details .like').classList.add('liked') : null
    //    post.querySelector('.post-details .dislike').setAttribute('onclick', `interact('dislike', ${data.post.id})`)
    // onclick="interact('', post.id)"
    // Inject the comments HTML here

    // Generate the comments HTML
    const commentSection = document.querySelector('#commentSection')
    data.comment.length > 0 ?
        data.comment.forEach(com => {
            commentSection.innerHTML += `
          <div class="comment">
            <p class="author">${com.username}
            <span>${com.created_at}</span>
            </p>
            <p>${com.content}</p>
            <div class="interact">
                <button class="like">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#fff" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
</svg>
<span></span>
</button>
                <button class="dislike">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#fff" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M7.498 15.25H4.372c-1.026 0-1.945-.694-2.054-1.715a12.137 12.137 0 0 1-.068-1.285c0-2.848.992-5.464 2.649-7.521C5.287 4.247 5.886 4 6.504 4h4.016a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23h1.294M7.498 15.25c.618 0 .991.724.725 1.282A7.471 7.471 0 0 0 7.5 19.75 2.25 2.25 0 0 0 9.75 22a.75.75 0 0 0 .75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 0 0 2.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384m-10.253 1.5H9.7m8.075-9.75c.01.05.027.1.05.148.593 1.2.925 2.55.925 3.977 0 1.487-.36 2.89-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398-.306.774-1.086 1.227-1.918 1.227h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 0 0 .303-.54" />
</svg>
<span></span>
                </button>
            </div>
          </div>
        `
        }) : commentSection.innerHTML = "<span>no comments!!</span>"
}

addComment.addEventListener('click', () => {
    if (textarea.value) {
        console.log("1000")
        fetch("/add-comment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, content: textarea.value, postId })
        })
            .then((response) => response.json())
            .then((data) => {
                alert(data.message)
                window.location.reload()
            })
            .catch((error) => alert("add comment Error : " + error.message))
    }
})

// Interaction functions for like/dislike
function interact(action, postId) {
    console.log(action, postId)
    fetch(`/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, post_id: postId }),
    })
        .then((response) => response.json())
        .then((data) => {
            alert(data.msg)
            window.location.reload()
        })
        .catch((error) => alert("Error interacting with post: " + error.message))

}

/// inject like btns if the user logged in

function addBtns(post) {

    if (userId) {


        //    article.querySelector('.post-details .like').setAttribute('onclick', `interact('like', ${data.post.id})`)

        appendBtns(article.querySelector('.interact div'), 'button',
            [{ class: [ 'like btn'] }, { onclick: [`interact('like', ${post.id})`] }], 'like')
        article.querySelector('.interact .remove button').style.display = 'block'
        ///dislike
        // post.querySelector('.post-details .dislike').setAttribute('onclick', `interact('dislike', ${data.post.id})`)
        appendBtns(article.querySelector('.interact div'), 'button',
            [{ class: ['btn dislike'] }, { onclick: [`interact('dislike', ${post.id})`] }], 'dislike')
    }

}

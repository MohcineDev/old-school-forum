const post = document.querySelector('.post-container')
const postId = document.location.pathname.split('/post/')[1]

fetch(`/get-post/${postId}`)
    .then(res => res.json())

    .then(data => injectData(data))
    .catch(err => alert(err))

function injectData(data) {
    console.log(data)

    post.querySelector('.author em').textContent = `Posted by ${data.post.username} on ${data.post.created_at}`
    post.querySelector('h2').textContent = data.post.title
    post.querySelector('.post-content p').textContent = data.post.content
    post.querySelector('.post-details>p:nth-child(1) span').textContent = data.post.likes
    post.querySelector('.post-details>p:nth-child(2) span').textContent = data.post.dislikes
    post.querySelector('.post-details>p:nth-child(3) span').textContent = data.post.comments
    // Inject the comments HTML here

      // Generate the comments HTML
      const commentSection = document.querySelector('#commentSection')
      data.comment.forEach(com => {
        commentSection.innerHTML += `
          <div class="comment">
          <p class="author">${com.username}</p>
          <p>${com.content}</p>
          <span>${com.created_at}</span>
          </div>
        `;
      });

}
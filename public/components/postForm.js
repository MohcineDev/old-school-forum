// postForm.js
function postForm() {
  return (
    `
        <h2>Create a Post</h2>
        <form id="createPostForm">
          <label for="title">Title:</label><br>
          <input type="text" id="title" name="title" placeholder="Post Title" required><br>

          <label for="content">Content:</label><br>
          <textarea id="content" name="content" rows="4" placeholder="Post Content" required></textarea><br>

          <label for="categories">Categories:</label><br>
          <div class="category-tags"></div>
          <button type="submit" class="btn">Submit Post</button>
        </form>
        `
  );
}

export { postForm }

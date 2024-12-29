// postForm.js

function postForm(myCats) {

  return (
    `
        <h2 class="heading">Create a Post</h2>
        <form id="createPostForm" onsubmit="handleFormSubmition(event)">
          <label for="title">Title:</label><br>
          <input type="text" id="title" value="for testing purposes" name="title" placeholder="Post Title" required><br>

          <label for="content">Content:</label><br>
          <textarea id="content" name="content" rows="4"  placeholder="Post Content" required>something here just for testing purposes again </textarea><br>

          <label for="categories">Categories:</label><br>
          <div class="category-tags">
          ${myCats.map(cat => `
            <input type="checkbox" id="${cat.name}" value="${cat.id}">        
              <label for="${cat.name}" title="${cat.description}">${cat.name}</label>
              `
    ).join('')}
          </div>
          <button type="submit" class="btn">Submit Post</button>
        </form>
        `
  );
}

export { postForm }
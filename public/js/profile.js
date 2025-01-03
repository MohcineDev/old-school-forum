const edit = document.querySelector('#edit')
const save = document.querySelector('.save')
const postsWrapper = document.querySelector('.posts .wrapper')

if (!userId) {
    alert('You must be logged in to access this page')
    window.location.href = '/'
} else {
    document.title = `${localStorage.getItem('username')} Profile`
    const profileContainer = document.querySelector('#profileContainer .wrapper')
    console.log("from profile.js ")
    // Fetch user details
    fetch(`/user/${userId}`, {
        method: "post"
    })
        .then(response => response.json())
        .then(user => {
            profileContainer.querySelector('#username').value = user.username
            profileContainer.querySelector('#email').value = user.email
            profileContainer.querySelector('#password').value = user.password
            profileContainer.querySelector('#posts span').textContent = user.posts
        })
        .catch(error => {
            console.log("from catch")
            console.error('Error fetching profile details:', error)
            alert('Error loading profile details')
        })
}

edit.addEventListener('change', (e) => {
    console.log("edit infos");
    if (e.target.checked) {

        document.querySelectorAll('input').forEach(input => input.removeAttribute('readonly'))
    } else {
        document.querySelectorAll('input').forEach(input => input.setAttribute('readonly', ""))

    }
})

save.onclick = () => {
    ////for now only the username can change
    ///TODO : add other fields  
    let newName = document.querySelector('#username').value

    fetch(`/update/${userId}`, {
        method: "PUT",
        body: JSON.stringify({ newName })
    })
        .then(res => res.json())
        .then(data => {
            localStorage.setItem('username', newName)
            alert(data.message)
        })
}


function getPosts() {
    fetch(`/get-user-posts/${userId}`, {
        method: 'POST'
    }).then(res => res.json())
        .then(data => injectPosts(data))

}

////only user posts
function injectPosts(posts) {
    console.log(posts);

    posts.length ?
        posts.forEach(post => {

            const card = document.createElement('div')
            card.classList.add('post')
            const h3 = document.createElement('h3')
            const p = document.createElement('p')
            const span = document.createElement('span')
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            svg.setAttribute('fill', 'red');
            svg.setAttribute('id', post.id);
            svg.setAttribute('stroke', 'currentColor');
            svg.setAttribute('viewBox', '0 0 24 24');
            svg.setAttribute('stroke-width', '1.5');
            svg.setAttribute('title', 'delete post');
            svg.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"></path>`

            const details = document.createElement('div')
            const interaction = document.createElement('div')
            const like = document.createElement('span')

            details.classList.add('details')

            like.textContent = post.T_likes
            const svgLike = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svgLike.setAttribute('fill', "none");
            svgLike.setAttribute('viewBox', "0 0 24 24");
            svgLike.setAttribute('stroke-width', '1.5');
            svgLike.setAttribute('stroke', '#fff');
            svgLike.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />`
            interaction.appendChild(svgLike)
            interaction.appendChild(like)
            span.textContent = post.created_at

            details.appendChild(interaction)
            details.appendChild(span)

            const head = document.createElement('div')
            h3.textContent = post.title
            p.textContent = post.content
            head.appendChild(h3)
            head.appendChild(p)

            card.appendChild(head)
            card.appendChild(svg)
            card.appendChild(details)
            postsWrapper.appendChild(card)
        }) : postsWrapper.innerHTML = `<p>You don't have any posts yet!! <br><a href="/">Create One.</a> <p/>`

    deleteEvent()

}

getPosts()

///delete a post
const deleteEvent = () => {
    document.querySelectorAll('.post>svg').forEach(btn => btn.addEventListener('click', (e) => {
        if (typeof (parseInt(e.target.id)) === 'number') {
            confirm("Are you sure? This post might haunt you!") ?

                fetch(`/post_delete/${e.target.id}`, {
                    method: 'delete'
                })
                    .then(res => res.json())
                    .then(data => {
                        alert(data.msg)
                        window.location.reload()
                    })
                    .catch(err => {
                        alert(err.msg)
                        // alert("something wrong! " + err.msg)
                    }) : null
        }
    }))
}

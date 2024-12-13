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
    let name = document.querySelector('#username').value
    console.log(name)
    fetch(`/update/${userId}`, {
        method: "POST",
        body: JSON.stringify({ newName: name })
    })
        .then(res => res.json())
        .then(data => {
            localStorage.setItem('username', name)
            alert(data.message)
        }
        )
}


function getPosts() {
    fetch(`/get-user-posts/${userId}`, {
        method: 'POST'
    }).then(res => res.json())
        .then(data => injectPosts(data))

}



function injectPosts(posts) {
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



        h3.textContent = post.title
        p.textContent = post.content
        span.textContent = post.created_at

        card.appendChild(h3)
        card.appendChild(p)
        card.appendChild(span)
        card.appendChild(svg)

        postsWrapper.appendChild(card)
    })

    deleteEvent()

}

getPosts()


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
const edit = document.querySelector('#edit')
const save = document.querySelector('.save')

if (!userId) {
    alert('You must be logged in to access this page')
    window.location.href = '/'
} else {
    const profileContainer = document.querySelector('#profileContainer .wrapper')
    console.log("from profile.js ")
    // Fetch user details
    fetch(`/user/${userId}`, {
        method: "post"
    })
        .then(response => response.json())
        .then(user => {
            console.log("user : ", user);
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

    // Logout functionality
    document.getElementById('logoutButton').addEventListener('click', () => {
        localStorage.clear()
        window.location.href = '/'
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
    let name = document.querySelector('#username').value
    console.log(name)
    fetch(`/update/${userId}`,{
        method:"POST",
        body:JSON.stringify({newName:name})
    })
        .then(res => res.json())
        .then(data => alert(data.message))
}


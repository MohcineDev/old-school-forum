
// Fetch categories from the backend

fetch('/categories')
    .then(response => response.json())
    .then(cats => {
        categories = cats
        ////category Tags used in the form for post creation 
        const categoryTags = document.querySelector(".category-tags")
        ///categories used for filtering posts
        asideCategories = document.querySelector(".categories")

        appendBtns(asideCategories, 'button', [{ onclick: ['btnDown(event)'] }, { class: ['active'] }], 'All')
        cats.forEach(category => {
            appendBtns(asideCategories, 'button', [{ onclick: ['btnDown(event)'] }], category.name)

            // if (userId) {
            //     const label = document.createElement('label')
            //     label.setAttribute("for", category.name)
            //     label.textContent = category.name

            //     const check = document.createElement('input')
            //     check.type = "checkbox"
            //     check.id = category.name
            //     check.value = category.id
            //     categoryTags.appendChild(check)
            //     categoryTags.appendChild(label)
            // }
        })
        appendBtns(asideCategories, 'button', [{ onclick: ['btnDown(event)'] }], 'uncategorised')
    })
    .catch(error => console.error("Error fetching categories:", error))

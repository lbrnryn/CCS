
if (location.pathname === "/") {

    // Start Logo Loading
    // const loaderLogo = document.querySelector(".loaderLogo");

    // window.addEventListener("load", () => {
    //     setTimeout(() => {
    //         loaderLogo.style.opacity = 0;
    //     }, 1000);
    //     setTimeout(() => {
    //         loaderLogo.remove();
    //     }, 1900)
    // });

    //------------------------------------------------------------

    // Login & Register Modal

    const loginModal = document.querySelector("#loginModal");
    const loginForm = document.querySelector("#loginForm");
    const registerForm = document.querySelector("#registerForm");
    const registerSubmitBtn = document.querySelector("#registerSubmitBtn");

    loginForm.addEventListener("click", (e) => {
        // If Sign up button is clicked
        if (e.target.innerText === "Sign Up") {
            loginForm.style.display = "none";
            registerForm.style.display = "block";
        }
    });

    registerForm.addEventListener("click", async (e) => {
        // If Sign up button is clicked
        if (e.target.innerText === "Login Instead") {
            registerForm.style.display = "none";
            loginForm.style.display = "block";
        }
    });
}

// Remove toast notification after 2s
const toast = document.querySelector(".toast");
if (toast) {
    setTimeout(() => toast.remove(), 3000);
}


//------------------------------------------------------------

if (location.pathname === "/dashboard" && document.querySelector("#articleForm")) {
    const articleForm = document.querySelector("#articleForm");
    const cancelEditArticleBtn = document.querySelector("#cancelEditArticleBtn");
    const articlesList = document.querySelector("#articlesList");
    const deleteArticleBtns = document.querySelectorAll("#deleteArticleBtn");

    articleForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        // console.dir(e.target.elements)
        // console.log(e.target.elements.author, e.target.elements.author.value)
        // console.log(e.target.elements.title, e.target.elements.title.value)
        // console.log(e.target.elements.body, e.target.elements.body.value)
        // console.log(e.target.action)

        const url = e.target.action;
        const author = e.target.elements.author.value;
        const title = e.target.elements.title.value;
        const body = e.target.elements.body.value;

        if (e.target.elements.submitEditArticleBtn.innerText !== "Edit") {
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ author, title, body })
            });
            const data = await res.json();
            // console.log(data)
            const li = document.createElement("li");
            li.className = "list-group-item secondary-bg-color text-white text-capitalize d-flex justify-content-between align-items-center";
            li.dataset.id = data._id;
            li.innerHTML = `
                ${data.title}
                <div class="d-flex align-items-center gap-2">
                    <span class="badge bg-secondary">Waiting for Approval</span>
                    <button type="button" class="btn p-0 editArticleBtn" data-url="http://localhost:1000/api/articles/${data._id}"><i class="bi bi-pencil-fill text-warning"></i></button>
                    <button type="button" class="btn p-0 deleteArticleBtn" data-url="http://localhost:1000/api/articles/${data._id}"><i class="bi bi-trash3-fill text-danger"></i></button>
                </div>
            `;
            articlesList.appendChild(li);
        } else {
            const res = await fetch(url, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ author, title, body })
            });
            const data = await res.json();
            // console.log(data)
            const liIndex = Array.from(articlesList.children).findIndex(li => li.dataset.id === data._id);
            articlesList.children[liIndex].innerHTML = `
                ${data.title}
                <div class="d-flex align-items-center gap-2">
                    <span class="badge bg-secondary">Waiting for Approval</span>
                    <button type="button" class="btn p-0 editArticleBtn" data-url="http://localhost:1000/api/articles/${data._id}"><i class="bi bi-pencil-fill text-warning"></i></button>
                    <button type="button" class="btn p-0 deleteArticleBtn" data-url="http://localhost:1000/api/articles/${data._id}"><i class="bi bi-trash3-fill text-danger"></i></button>
                </div>
            `;

            articleForm.action = `/api/articles`;
            articleForm.elements.author.value = "";
            articleForm.elements.title.value = "";
            articleForm.elements.body.value = "";
            articleForm.elements.submitEditArticleBtn.innerText = "Submit";
            articleForm.elements.cancelEditArticleBtn.style.display = "none";
        }
    });

    articlesList.addEventListener("click", async (e) => {
        // console.log(e.target)
        // console.log(e.target.parentElement.classList.contains("editArticleBtn"));
        if (e.target.parentElement.classList.contains("editArticleBtn")) {
            const editArticleBtn = e.target.parentElement;
            const url = editArticleBtn.dataset.url;

            const res = await fetch(url);
            const data = await res.json();
            // console.log(data);
            articleForm.action = `/api/articles/${data._id}`;
            articleForm.elements.author.value = data.author;
            articleForm.elements.title.value = data.title;
            articleForm.elements.body.value = data.body;
            articleForm.elements.submitEditArticleBtn.innerText = "Edit";
            articleForm.elements.cancelEditArticleBtn.style.display = "block";
        }

        if (e.target.parentElement.classList.contains("deleteArticleBtn")) {
            if (confirm("Are you sure you want to delete this article post?")) {
                const deleteArticleBtn = e.target.parentElement;
                const url = deleteArticleBtn.dataset.url;

                const res = await fetch(url, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" }
                });
                const data = await res.json();
                console.log(data)

                deleteArticleBtn.parentElement.parentElement.remove();
            }
        }
    });

    cancelEditArticleBtn.addEventListener("click", (e) => {
        articleForm.action = `/api/articles`;
        articleForm.elements.author.value = "";
        articleForm.elements.title.value = "";
        articleForm.elements.body.value = "";
        articleForm.elements.submitEditArticleBtn.innerText = "Submit";
        articleForm.elements.cancelEditArticleBtn.style.display = "none";
    });

    // deleteArticleBtns.forEach(deleteArticleBtn => {
    //     deleteArticleBtn.addEventListener("click", (e) => {
    //         if (!confirm("Are you sure you want to delete?")) {
    //             e.preventDefault();
    //         }
    //     })
    // });
}

//------------------------------------------------------------

// console.log(location.pathname)
const re = /^\/event\/[a-f\d]{24}$/i;

if (re.test(location.pathname)) {
    const reserversList = document.querySelector(".reserversList");
    const reserversLis = Array.from(reserversList.children);
    const reserversListCount = document.querySelector(".reserversListCount");

    const addAttendeeBtns = document.querySelectorAll(".addAttendeeBtn");
    const attendeesList = document.querySelector(".attendeesList");
    const attendeesListCount = document.querySelector(".attendeesListCount");

    const addAbsenteeBtns = document.querySelectorAll(".addAbsenteeBtn");
    const absenteesList = document.querySelector(".absenteesList");
    const absenteesListCount = document.querySelector(".absenteesListCount");

    addAttendeeBtns.forEach(addAttendeeBtn => {
        addAttendeeBtn.addEventListener("click", async (e) => {
            const reserverID = e.target.dataset.reserverid;
            const url = e.target.dataset.url;
            const res = await fetch(url, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reserverID: reserverID} )
            });
            const data = await res.json();

            const li = document.createElement("li");
            li.className = "list-group-item secondary-bg-color text-white text-capitalize";
            li.innerText = `${data.firstname} ${data.lastname}`;
            attendeesList.appendChild(li);
            
            for (const li of reserversLis) {
                if (li.dataset.reserverid === data._id) {
                    li.remove();
                }
            }

            attendeesListCount.innerText = attendeesList.children.length.toString();
            reserversListCount.innerText = reserversList.children.length.toString();
        })
    });

    addAbsenteeBtns.forEach(addAbsenteeBtn => {
        addAbsenteeBtn.addEventListener("click", async (e) => {
            const reserverID = e.target.dataset.reserverid;
            const url = e.target.dataset.url;
            const res = await fetch(url, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reserverID: reserverID} )
            });
            const data = await res.json();

            const li = document.createElement("li");
            li.className = "list-group-item secondary-bg-color text-white text-capitalize";
            li.innerText = `${data.firstname} ${data.lastname}`;
            absenteesList.appendChild(li);
            
            for (const li of reserversLis) {
                if (li.dataset.reserverid === data._id) {
                    li.remove();
                }
            }

            absenteesListCount.innerText = absenteesList.children.length.toString();
            reserversListCount.innerText = reserversList.children.length.toString();
        })
    });
}
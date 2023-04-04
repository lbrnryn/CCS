
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

const deleteArticleBtns = document.querySelectorAll("#deleteArticleBtn");

deleteArticleBtns.forEach(deleteArticleBtn => {
    deleteArticleBtn.addEventListener("click", (e) => {
        if (!confirm("Are you sure you want to delete?")) {
            e.preventDefault();
        }
    })
});

//------------------------------------------------------------

const editEventBtns = document.querySelectorAll(".editEventBtn");
const eventForm = document.querySelector("#eventForm");

editEventBtns.forEach(editEventBtn => {
    editEventBtn.addEventListener("click", async (e) => {
        try {
            const editBtn = e.target.tagName !== "BUTTON" ? e.target.parentElement: e.target;
            const url = editBtn.dataset.url;
            
            const res = await fetch(url);
            const data = await res.json();
            const { title, description, date, time, room, rationale, objectives, guidelines } = data;
            
            eventForm.elements.title.value = title;
            eventForm.elements.description.value = description;
            eventForm.elements.time.value = time;
            eventForm.elements.date.value = date.slice(0, 10);
            eventForm.elements.room.value = room;
            eventForm.elements.rationale.value = rationale;
            eventForm.elements.objectives.value = objectives;
            eventForm.elements.guidelines.value = guidelines;
            eventForm.action = `/event/${data._id}?_method=PUT`;
            eventForm.elements[8].innerText = "Update";
        } catch (err) { console.log(err) }
    });
});

const deleteEventForms = document.querySelectorAll(".deleteEventForm");

deleteEventForms.forEach(deleteEventForm => {
    deleteEventForm.addEventListener("submit", (e) => {
        if (!confirm("Are you sure you want to delete?")) {
            e.preventDefault();
        }
    });
})

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



//------------------------------------------------------------

if (location.pathname === "/users") {
    const editUserBtns = document.querySelectorAll(".editUserBtn");
    const editUserForm = document.querySelector("#editUserForm");
    const idNumber = document.querySelector("#idNumber");
    const firstname = document.querySelector("#firstname");
    const lastname = document.querySelector("#lastname");
    const username = document.querySelector("#username");
    const email = document.querySelector("#email");
    const submitEditUserBtn = document.querySelector("#submitEditUserBtn");
    const cancelEditUserBtn = document.querySelector("#cancelEditUserBtn");
    const searchStudent = document.querySelector("#searchStudent");
    const userList = document.querySelector("#userList");

    userList.addEventListener("click", async (e) => {

        // If edit button is clicked
        const editUserBtn = e.target.tagName === "I" ? e.target.parentElement: e.target;
        const editBtn = editUserBtn.classList.contains("editUserBtn") && editUserBtn;
        const url = editBtn.dataset.url;

        const res = await fetch(url);
        const data = await res.json();

        editUserForm.action = new URL(editBtn.dataset.url).pathname;
        idNumber.value = data.idNumber;
        firstname.value = data.firstname;
        lastname.value = data.lastname;
        username.value = data.username;
        email.value = !data.email ? "": data.email;
        submitEditUserBtn.innerText = "Edit";
        cancelEditUserBtn.style.display = "block";

    })

    // editUserBtns.forEach(editUserBtn => {
    //     editUserBtn.addEventListener("click", async (e) => {
    //         const editBtn = e.target.tagName === "I" ? e.target.parentElement: e.target;
    //         const url = editBtn.dataset.url;

    //         const res = await fetch(url);
    //         const data = await res.json();

    //         editUserForm.action = new URL(editBtn.dataset.url).pathname;
    //         idNumber.value = data.idNumber;
    //         firstname.value = data.firstname;
    //         lastname.value = data.lastname;
    //         username.value = data.username;
    //         email.value = !data.email ? "": data.email;
    //         submitEditUserBtn.innerText = "Edit";
    //         cancelEditUserBtn.style.display = "block";
    //     });
    // });

    cancelEditUserBtn.addEventListener("click", () => {
        idNumber.value = "";
        firstname.value = "";
        lastname.value = "";
        username.value = "";
        email.value = "";
        submitEditUserBtn.innerText = "Submit";
        cancelEditUserBtn.style.display = "none";
    });

    searchStudent.addEventListener("keyup", (e) => {
        for (const li of userList.children) {
            if (!li.innerText.toLowerCase().includes(e.target.value.toLowerCase())) {
                li.classList.remove("d-flex");
                li.style.display = "none";
            } else {
                li.style.display = "flex";
            }
        }
    });

    editUserForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const url = e.target.action;

        const res = await fetch(url, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                idNumber: idNumber.value,
                firstname: firstname.value,
                lastname: lastname.value,
                username: username.value,
                email: email.value
            })
        });
        const data = await res.json();
        console.log(data);

        const userListLis = Array.from(userList.children);
        // console.log(userListLis.findIndex(li => li.dataset.id === data._id))
        const liIndex = userListLis.findIndex(li => li.dataset.id === data._id);
        userListLis[liIndex].innerHTML = `
            ${data.firstname} ${data.lastname}
            <div class="d-flex align-items-center gap-2">
                <button type="button" class="btn p-0 editUserBtn" data-url="${e.target.action}"><i class="bi bi-pencil-fill text-warning"></i></button>
                <form action="" class="deleteUserForm" method="post">
                    <button type="submit" class="btn p-0"><i class="bi bi-trash3-fill text-danger"></i></button>
                </form>
            </div>
        `;

        idNumber.value = "";
        firstname.value = "";
        lastname.value = "";
        username.value = "";
        email.value = "";
        submitEditUserBtn.innerText = "Submit";
        cancelEditUserBtn.style.display = "none";
    });
}
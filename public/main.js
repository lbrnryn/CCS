
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

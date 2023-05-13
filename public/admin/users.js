const searchStudentInput = document.querySelector("#searchStudentInput");
const usersCount = document.querySelector("#usersCount");
const userForm = document.querySelector("#userForm");
const userList = document.querySelector("#userList");
const { idNumber, firstname, lastname, username, email, submitEditUserBtn, cancelEditUserBtn } = userForm.elements;
let editUserUrl;

userForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const url = editUserUrl;

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
    // console.log(data);
    
    const matchedLi = Array.from(userList.children).find(li => li.dataset.id === data._id);
    matchedLi.innerHTML = `
        ${data.firstname} ${data.lastname}
        <div class="d-flex align-items-center gap-2">
            <button type="button" class="btn p-0 editUserBtn" data-url="/api/users/${data._id}"><i class="bi bi-pencil-fill text-warning"></i></button>
            <button type="button" class="btn p-0 deleteUserBtn" data-url="/api/users/${data._id}"><i class="bi bi-trash3-fill text-danger"></i></button>
        </div>
    `;

    editUserUrl = '';
    Array.from(userForm.elements).filter(element => element.tagName !== 'BUTTON').forEach(element => element.value = '');
    submitEditUserBtn.disabled = true;
    submitEditUserBtn.innerText = "Submit";
    cancelEditUserBtn.classList.add("d-none");
});

userList.addEventListener("click", async (e) => {

    if (e.target.parentElement.classList.contains("editUserBtn")) {
        const editUserBtn = e.target.parentElement;
        const url = editUserBtn.dataset.url;
        const res = await fetch(url);
        const data = await res.json();

        editUserUrl = `/api/users/${data._id}`;
        idNumber.value = data.idNumber;
        firstname.value = data.firstname;
        lastname.value = data.lastname;
        username.value = data.username;
        email.value = data.email;
        submitEditUserBtn.disabled = false;
        submitEditUserBtn.innerText = "Edit";
        cancelEditUserBtn.classList.remove("d-none");
    }

    if (e.target.parentElement.classList.contains("deleteUserBtn")) {
        editUserUrl = undefined;
        Array.from(userForm.elements).filter(element => element.tagName !== 'BUTTON').forEach(element => element.value = '');
        submitEditUserBtn.disabled = true;
        submitEditUserBtn.innerText = "Submit";
        !cancelEditUserBtn.classList.contains("d-none") && cancelEditUserBtn.classList.add("d-none");

        const deleteUserBtn = e.target.parentElement;
        deleteUserBtn.parentElement.parentElement.parentElement.remove();
        usersCount.innerText = Array.from(userList.children).length;
        const url = deleteUserBtn.dataset.url;
        await fetch(url, { method: "DELETE" });
    }

});

cancelEditUserBtn.addEventListener("click", () => {
    editUserUrl = undefined;
    Array.from(userForm.elements).filter(element => element.tagName !== 'BUTTON').forEach(element => element.value = '');
    submitEditUserBtn.disabled = true;
    submitEditUserBtn.innerText = "Submit";
    cancelEditUserBtn.classList.add("d-none");
});

searchStudentInput.addEventListener("keyup", (e) => {
    Array.from(userList.children).forEach(li => {
        if (!li.dataset.name.includes(e.target.value.toLowerCase())) {
            li.classList.add("d-none");
        } else {
            li.classList.remove("d-none");
        }
    });
});
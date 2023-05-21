// Remove toast notification after 2s
const toast = document.querySelector(".toast");
if (toast) {
    setTimeout(() => toast.remove(), 3000);
}

//------------------------------------------------------------

if (location.pathname !== '/') {
    const userProfileForm = document.querySelector('#userProfileForm');
    const profileModal = document.querySelector('#profileModal');
    // console.log(userProfileForm)

    const { idNumber, firstname, lastname, username, userProfileSubmitBtn, userProfileEditBtn } = userProfileForm.elements;
    // console.log('previous value', idNumber.value, firstname.value, lastname.value, username.value)
    let previousData = {
        idNumber: idNumber.value,
        firstname: firstname.value,
        lastname: lastname.value,
        username: username.value
    }

    userProfileEditBtn.addEventListener('click', (e) => {
        Array.from(userProfileForm.elements).filter(element => element.tagName !== 'BUTTON').forEach(element => {
            element.classList.remove('bg-transparent');
            element.classList.remove('border-0');
            element.disabled = false;
        });
        userProfileSubmitBtn.classList.remove('d-none');
        e.target.classList.add('d-none');
    });

    userProfileForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!e.target.checkValidity()) {
            e.stopPropagation();
            e.target.classList.add('was-validated');
            setTimeout(() => e.target.classList.remove('was-validated'), 1000)
        } else {
            const res = await fetch('/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    idNumber: idNumber.value,
                    firstname: firstname.value,
                    lastname: lastname.value,
                    username: username.value,
                })
            });
            const data = await res.json();
            console.log(data);

            idNumber.value = data.idNumber;
            firstname.value = data.firstname;
            lastname.value = data.lastname;
            username.value = data.username;

            Array.from(userProfileForm.elements).filter(element => element.tagName !== 'BUTTON').forEach(element => {
                element.classList.add('bg-transparent');
                element.classList.add('border-0');
                element.disabled = true;
            });
            userProfileSubmitBtn.classList.add('d-none');
            userProfileEditBtn.classList.remove('d-none');

            bootstrap.Modal.getInstance(e.target.closest('.modal')).hide()

            previousData = {
                idNumber: idNumber.value,
                firstname: firstname.value,
                lastname: lastname.value,
                username: username.value
            }
        }

    });

    profileModal.addEventListener('hidden.bs.modal', (e) => {
        Array.from(userProfileForm.elements).filter(element => element.tagName !== 'BUTTON').forEach(element => {
            element.classList.add('bg-transparent');
            element.classList.add('border-0');
            element.disabled = true;
        });
        userProfileSubmitBtn.classList.add('d-none');
        userProfileEditBtn.classList.remove('d-none');
        // console.log('present value', idNumber.value, firstname.value, lastname.value, username.value)
        idNumber.value = previousData.idNumber;
        firstname.value = previousData.firstname;
        lastname.value = previousData.lastname;
        username.value = previousData.username;
    });
}

//------------------------------------------------------------

// console.log(location.pathname)
const re = /^\/event\/[a-f\d]{24}$/i;

if (re.test(location.pathname)) {
    const reserversList = document.querySelector(".reserversList");
    const reserversListCount = document.querySelector(".reserversListCount");

    const addAttendeeBtns = document.querySelectorAll(".addAttendeeBtn");
    const attendeesList = document.querySelector(".attendeesList");
    const attendeesListCount = document.querySelector(".attendeesListCount");

    const addAbsenteeBtns = document.querySelectorAll(".addAbsenteeBtn");
    const absenteesList = document.querySelector(".absenteesList");
    const absenteesListCount = document.querySelector(".absenteesListCount");

    const deleteReserverBtns = document.querySelectorAll('.deleteReserverBtn');


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
            
            Array.from(reserversList.children).forEach(li => li.dataset.reserverid === data._id && remove());

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
            
            Array.from(reserversList.children).forEach(li => li.dataset.reserverid === data._id && remove());

            absenteesListCount.innerText = absenteesList.children.length.toString();
            reserversListCount.innerText = reserversList.children.length.toString();
        })
    });

    deleteReserverBtns.forEach(deleteReserverBtn => {
        deleteReserverBtn.addEventListener('click', async (e) => {
            const reserverID = e.target.dataset.reserverid;
            const url = e.target.dataset.url;
            await fetch(url, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userID: reserverID })
            });
            e.target.parentElement.parentElement.remove();
            reserversListCount.innerText = reserversList.children.length.toString();
        })
    })
}
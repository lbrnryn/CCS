// Remove toast notification after 2s
const toast = document.querySelector(".toast");
if (toast) {
    setTimeout(() => toast.remove(), 3000);
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
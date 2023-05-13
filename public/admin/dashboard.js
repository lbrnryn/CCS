const addEventModal = document.querySelector("#addEventModal");
const addEventForm = document.querySelector("#addEventForm");
const { title, date, time, room, description, rationale, objectives, guidelines, submitEventBtn } = addEventForm.elements;
const eventList = document.querySelector("#eventList");
let editEventUrl;

addEventForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (submitEventBtn.innerText === "Edit") {
        const res = await fetch(editEventUrl, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: title.value,
                date: date.value,
                time: time.value,
                room: room.value,
                description: description.value,
                rationale: rationale.value,
                objectives: objectives.value,
                guidelines: guidelines.value
            })
        });
        const data = await res.json();
        // console.log(data);
        const matchedLi = Array.from(eventList.children).find(li => li.dataset.id === data._id);
        matchedLi.innerHTML = `
            <a href="/event/${data._id}" class="text-decoration-none text-white">${data.title}</a>
            <div class="d-flex align-items-center gap-2">
                <button type="button" class="btn p-0 editEventBtn" data-url="/api/event/${data._id}"><i class="bi bi-pencil-fill text-warning"></i></button>
                <button type="submit" class="btn p-0 deleteEventBtn" data-url="/api/event/${data._id}"><i class="bi bi-trash3-fill text-danger"></i></button>
            </div>
        `;

        Array.from(addEventForm.elements).filter(element => element.tagName !== 'BUTTON').forEach(element => element.value = '');
        editEventUrl = undefined;
        submitEventBtn.innerText = "Submit";
    
        bootstrap.Modal.getInstance(addEventModal).hide();
    } else {
        const res = await fetch("/api/event", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: title.value,
                date: date.value,
                time: time.value,
                room: room.value,
                description: description.value,
                rationale: rationale.value,
                objectives: objectives.value,
                guidelines: guidelines.value
            })
        });
        const data = await res.json();
        // console.log(data);
        const li = document.createElement("li");
        li.className = "list-group-item secondary-bg-color d-flex justify-content-between align-items-center";
        li.dataset.id = data._id;
        li.innerHTML = `
            <a href="/event/${data._id}" class="text-decoration-none text-white">${data.title}</a>
            <div class="d-flex align-items-center gap-2">
                <button type="button" class="btn p-0 editEventBtn" data-url="/api/event/${data._id}"><i class="bi bi-pencil-fill text-warning"></i></button>
                <button type="button" class="btn p-0 deleteEventBtn" data-url="/api/event/${data._id}"><i class="bi bi-trash3-fill text-danger"></i></button>
            </div>
        `;
        eventList.appendChild(li);
        
        Array.from(addEventForm.elements).filter(element => element.tagName !== 'BUTTON').forEach(element => element.value = '');
    
        bootstrap.Modal.getInstance(addEventModal).hide();
    }
});

eventList.addEventListener("click", async (e) => {

    if (e.target.parentElement.classList.contains("editEventBtn")) {
        const editEventBtn = e.target.parentElement;
        const url = editEventBtn.dataset.url;

        const res = await fetch(url);
        const data = await res.json();
        // console.log(data);

        title.value = data.title;
        // date.value = data.date;
        date.value = data.date && data.date.slice(0, 10);
        time.value = data.time;
        room.value = data.room;
        description.value = data.description;
        rationale.value = data.rationale;
        objectives.value = data.objectives;
        guidelines.value = data.guidelines;
        editEventUrl = url;
        submitEventBtn.innerText = "Edit";

        new bootstrap.Modal(addEventModal).show()
    }

    if (e.target.parentElement.classList.contains("deleteEventBtn")) {
        if (confirm("Are you sure you want to delete this event?")) {
            const deleteEventBtn = e.target.parentElement;
            const url = deleteEventBtn.dataset.url;
    
            deleteEventBtn.parentElement.parentElement.remove();
            await fetch(url, { method: "DELETE" });
            
            Array.from(addEventForm.elements).filter(element => element.tagName !== 'BUTTON').forEach(element => element.value = '');
            editEventUrl = undefined;
            submitEventBtn.innerText === "Submit";
        }
    }

});

addEventModal.addEventListener('hidden.bs.modal', (e) => Array.from(addEventForm.elements).filter(element => element.tagName !== 'BUTTON').forEach(element => element.value = ''));


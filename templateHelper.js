const reservationStatusHelper = reservers => {
    if (reservers.length === 60) {
        return `<span class="badge bg-danger">Reservation is now closed</span>`;
    } else {
        return `<span class="badge bg-success">Ongoing Reservation</span>`;
    }
}

const formatDateHelper = date => {
    const dateTime = new Date(date);
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    // const formattedDateandTime = `${months[dateTime.getMonth()]} ${dateTime.getDate()}, ${dateTime.getFullYear()} | ${dateTime.getHours() > 12 ? dateTime.getHours() - 12 : dateTime.getHours()}:${dateTime.getMinutes() === 0? `0${dateTime.getMinutes()}` : dateTime.getMinutes()} ${dateTime.getHours() < 12 ? "am" : "pm"}`;
    const formattedDate = `${months[dateTime.getMonth()]} ${dateTime.getDate()}, ${dateTime.getFullYear()}`;
    // return formattedDateandTime
    return formattedDate
    // console.log(formattedDate)
};

const formatTimeHelper = time => {
    if (time) {
        // console.log(Number(time.split(":")[0]) < 12 ? `${time} am`: `${Number(time.split(":")[0]) - 12}:${time.split(":")[1]} pm`)
        return Number(time.split(":")[0]) < 12 ? `${time} am`: `${Number(time.split(":")[0]) - 12}:${time.split(":")[1]} pm`;
    }
};

const isCurrentUserReservedHelper = (reservers, currentUserID, eventID) => {
    const reserversIDs = reservers.map(reserver => reserver._id);
    const isIDinArray = reserversIDs.some(id => id.toString() === currentUserID.toString());
    // console.log(reservers.length === 3)
    // if (!isIDinArray) {
    if (!isIDinArray && reservers.length !== 60) {
        return `
        <form action="/event/${eventID}/reserver?_method=PUT" method="post">
            <input type="hidden" name="userID" value="${currentUserID}">
            <button type="submit" class="btn btn-sm btn-warning">Reserved a seat</button>
        </form>
        `;
    } else if (reservers.length === 60) {
        return `<button type="button" class="btn btn-sm btn-warning" disabled>All seats are now taken</button>`;
    } else {
        return `<button type="button" class="btn btn-sm btn-warning" disabled>You are now on the list</button>`;
    }
};

// const listofReserversHelper = (reservers, currentUserID = null, eventID) => {
const listofReserversHelper = ({reservers, currentUserID, eventID}) => {
    // return { reservers, eventID, currentUserID }
    if (currentUserID !== undefined) {
        return reservers.map(reserver => {
            if (reserver._id.toString() === currentUserID.toString()) {
                return `
                    <li class="list-group-item secondary-bg-color text-white text-capitalize d-flex justify-content-between align-items-center">
                        ${reserver.firstname} ${reserver.lastname}
                        <form action="/event/${eventID}/reserver?_method=DELETE" method="post">
                            <input type="hidden" name="userID" value="${reserver._id}">
                            <button type="submit" class="badge bg-danger border-0">Cancel Reservation</button>
                        </form>
                    </li>
                `;
            } else {
                return `
                    <li class="list-group-item secondary-bg-color text-white text-capitalize d-flex justify-content-between align-items-center">
                        ${reserver.firstname} ${reserver.lastname}
                    </li>
                `;
            }
        }).join("");
    } else {
        return reservers.map(reserver => {
            return `
                <li class="list-group-item secondary-bg-color text-white text-capitalize d-flex justify-content-between align-items-center">
                    ${reserver.firstname} ${reserver.lastname}
                    <div class="d-flex align-items-center gap-1">
                        <form action="/event/${eventID}/attendee?_method=PUT" method="post">
                            <input type="hidden" name="userID" value="${reserver._id}">
                            <button type="submit" class="btn btn-sm btn-primary">PRESENT</button>
                        </form>
                        <form action="#" method="post">
                            <input type="hidden" name="userID" value="${reserver._id}">
                            <button type="submit" class="btn btn-sm btn-danger">ABSENT</button>
                        </form>
                        <form action="/event/${eventID}/reserver?_method=DELETE" method="post">
                            <input type="hidden" name="userID" value="${reserver._id}">
                            <button type="submit" class="btn text-danger p-0"><i class="bi bi-x fs-5"></i></button>
                        </form>
                    </div>
                </li>
            `
        }).join(" ");
    }
};

const formatToListHelper = paragraph => {
    return paragraph.split("•").filter(sentence => {
        return sentence !== "";
    }).map(sentence => {
        return `<li>${sentence}</li>`
    }).join(" ");
}

module.exports = {
    reservationStatusHelper,
    formatDateHelper,
    formatTimeHelper,
    isCurrentUserReservedHelper,
    listofReserversHelper,
    formatToListHelper
}
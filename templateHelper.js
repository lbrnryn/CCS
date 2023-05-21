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

    const formattedDate = `${months[dateTime.getMonth()]} ${dateTime.getDate()}, ${dateTime.getFullYear()}`;
    return formattedDate
};

const formatTimeHelper = time => time && Number(time.split(":")[0]) < 12 ? `${time} am`: `${Number(time.split(":")[0]) - 12}:${time.split(":")[1]} pm`;

const isCurrentUserReservedHelper = (reservers, currentUserID, eventID) => {
    const reserversIDs = reservers.map(reserver => reserver._id);
    const isIDinArray = reserversIDs.some(id => id.toString() === currentUserID.toString());
    
    if (!isIDinArray && reservers.length !== 60) {
        return `<button type="button" class="btn btn-sm btn-warning reservedSeatBtn" data-url='/api/event/${eventID}/reserver' data-userid='${currentUserID}'>Reserved a seat</button>`;
    } else if (reservers.length === 60) {
        return `<button type="button" class="btn btn-sm btn-warning reservedSeatBtn" disabled>All seats are now taken</button>`;
    } else {
        return `<button type="button" class="btn btn-sm btn-warning reservedSeatBtn" disabled>You are now on the list</button>`;
    }
};

// const listofReserversHelper = (reservers, currentUserID = null, eventID) => {
const listofReserversHelper = ({reservers, currentUserID, eventID}) => {
    // return { reservers, eventID, currentUserID }
    if (currentUserID === undefined) {
        return reservers.map(reserver => {
            return `
                <li class="list-group-item secondary-bg-color text-white text-capitalize d-flex justify-content-between align-items-center" data-reserverid="${reserver._id}">
                    ${reserver.firstname} ${reserver.lastname}
                    <div class="d-flex align-items-center gap-1">
                        <button type="button" class="btn btn-sm btn-primary addAttendeeBtn" data-url="${process.env.NODE_ENV === "development" ? "http://localhost:1000/" : "https://ccs-icct-tech-guild.onrender.com/"}api/event/${eventID}/attendee" data-reserverid="${reserver._id}">PRESENT</button>
                        <button type="button" class="btn btn-sm btn-danger addAbsenteeBtn" data-url="${process.env.NODE_ENV === "development" ? "http://localhost:1000/" : "https://ccs-icct-tech-guild.onrender.com/"}api/event/${eventID}/absentee" data-reserverid="${reserver._id}">ABSENT</button>
                        <button type="button" class="btn btn-sm btn-danger deleteReserverBtn" data-url="${process.env.NODE_ENV === "development" ? "http://localhost:1000/" : "https://ccs-icct-tech-guild.onrender.com/"}api/event/${eventID}/reserver" data-reserverid="${reserver._id}">DELETE</button>
                    </div>
                </li>
            `
        }).join(" ");        
    } else {
        return reservers.map(reserver => {
            if (reserver._id.toString() === currentUserID.toString()) {
                return `
                    <li class="list-group-item secondary-bg-color text-white text-capitalize d-flex justify-content-between align-items-center">
                        ${reserver.firstname} ${reserver.lastname}
                        <button type='button' class="badge bg-danger border-0 cancelReservationBtn" data-url='/api/event/${eventID}/reserver' data-userid='${currentUserID}'>Cancel Reservation</button>
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
    }
};

const formatToListHelper = paragraph => paragraph.split("•").filter(sentence => sentence !== "").map(sentence => `<li>${sentence}</li>`).join(" ");

module.exports = {
    reservationStatusHelper,
    formatDateHelper,
    formatTimeHelper,
    isCurrentUserReservedHelper,
    listofReserversHelper,
    formatToListHelper
}


{/* <form action="/event/${eventID}/reserver?_method=DELETE" method="post">
    <input type="hidden" name="userID" value="${reserver._id}">
    <button type="submit" class="btn text-danger p-0"><i class="bi bi-x fs-5"></i></button>
</form> */}
"use strict";

(function () {
    // Ticket numbers made by checkout.js look like WOLF- followed by 12 letters/digits
    const TICKET_FORMAT = /^WOLF-[A-HJ-NP-Z2-9]{12}$/;

    let ticketNumber = null;
    try {
        ticketNumber = sessionStorage.getItem("wolfTicket");
    } catch (err) {
        ticketNumber = null;
    }

    const qrBox = document.getElementById("qrcode");
    const ticketLabel = document.getElementById("ticket-number");
    const note = document.querySelector(".ticket-note");

    if (ticketNumber && TICKET_FORMAT.test(ticketNumber)) {
        ticketLabel.textContent = "Ticket " + ticketNumber;
        showAdmissionDetails();
        new QRCode(qrBox, {
            text: "The Wolfsonian-FIU Ticket " + ticketNumber,
            width: 200,
            height: 200,
            colorDark: "#000000",
            colorLight: "#ffffff"
        });
    } else {
        // Never invent a ticket: no valid purchase in this tab means no QR code
        note.textContent = "No ticket was found. Please purchase a ticket first.";
        const link = document.createElement("a");
        link.href = "checkout.html";
        link.className = "btn";
        link.textContent = "Buy Tickets";
        ticketLabel.replaceChildren(link);
    }

    // Admission type and what to bring, saved by checkout.js (shown as plain text only)
    function showAdmissionDetails() {
        let admission = "", entranceNote = "";
        try {
            admission = sessionStorage.getItem("wolfAdmission") || "";
            entranceNote = sessionStorage.getItem("wolfEntranceNote") || "";
        } catch (err) { /* storage unavailable */ }
        if (admission) {
            note.textContent = admission.slice(0, 120) + " — show this QR code at the entrance.";
        }
        if (entranceNote) {
            const reminder = document.createElement("p");
            reminder.className = "ticket-note";
            reminder.textContent = entranceNote.slice(0, 200);
            ticketLabel.after(reminder);
        }
    }

    document.getElementById("continue-button").addEventListener("click", function () {
        document.getElementById("ticket-step").style.display = "none";
        document.getElementById("questionnaire-step").style.display = "block";
    });
})();

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

    document.getElementById("continue-button").addEventListener("click", function () {
        document.getElementById("ticket-step").style.display = "none";
        document.getElementById("questionnaire-step").style.display = "block";
    });
})();

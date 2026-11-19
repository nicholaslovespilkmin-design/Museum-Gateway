"use strict";

(function () {
    // Ticket prices
    const ticketPrices = Object.freeze({
        adult: 12,
        senior: 8,
        student: 8,
        child: 8,
        member: 0,
        florida: 0,
        disability: 0,
        under6: 0,
        sus: 0,
        military: 0,
        friday: 0
    });

    const ticketType = document.getElementById("ticket-type");
    const ticketPrice = document.getElementById("ticket-price");

    // Change the price when the admission type changes
    ticketType.addEventListener("change", function () {
        // Only accept known admission types
        if (!Object.prototype.hasOwnProperty.call(ticketPrices, this.value)) {
            this.value = "adult";
        }
        const price = ticketPrices[this.value];
        ticketPrice.textContent = price === 0 ? "FREE" : "$" + price.toFixed(2);
    });

    // EmailJS settings. The public key is designed to be public, but lock it down in the
    // EmailJS dashboard: restrict "Allowed origins" to your site's domain and set a rate limit.
    const EMAILJS_PUBLIC_KEY = "lF5ZcuoUx4YUYQm9n";
    const EMAILJS_SERVICE_ID = "service_zx94vmi";
    const EMAILJS_TEMPLATE_ID = "template_11206yp";

    emailjs.init({
        publicKey: EMAILJS_PUBLIC_KEY,
        limitRate: { id: "ticket-checkout", throttle: 10000 } // at most 1 email per 10 s per browser
    });

    const form = document.getElementById("payment-form");
    const fields = {
        name: document.getElementById("card-name"),
        email: document.getElementById("email"),
        number: document.getElementById("card-number"),
        expiration: document.getElementById("expiration"),
        cvv: document.getElementById("cvv")
    };

    // Card fields that must never be kept after processing
    const CARD_FIELDS = [fields.name, fields.number, fields.expiration, fields.cvv];

    // Wipe every card field so no payment data stays on the page
    function clearCardData() {
        CARD_FIELDS.forEach(function (field) {
            field.value = "";
            field.defaultValue = "";
            field.setCustomValidity("");
        });
    }

    // Also clear if the browser restores this page from its back/forward cache
    window.addEventListener("pageshow", clearCardData);

    /* ---------- Validation ---------- */

    function digitsOnly(value) {
        return value.replace(/\D/g, "");
    }

    // Luhn checksum: catches typos in card numbers
    function passesLuhn(number) {
        let sum = 0;
        let double = false;
        for (let i = number.length - 1; i >= 0; i--) {
            let d = number.charCodeAt(i) - 48;
            if (double) {
                d *= 2;
                if (d > 9) d -= 9;
            }
            sum += d;
            double = !double;
        }
        return sum % 10 === 0;
    }

    function validateName() {
        const v = fields.name.value.trim();
        return /^[\p{L}\p{M}' .-]{2,100}$/u.test(v) ? "" : "Enter the name as it appears on the card.";
    }

    function validateEmail() {
        const v = fields.email.value.trim();
        if (v.length > 254 || !/^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[A-Za-z]{2,}$/.test(v)) {
            return "Enter a valid email address.";
        }
        return "";
    }

    function validateNumber() {
        const raw = fields.number.value;
        const n = digitsOnly(raw);
        if (/[^\d ]/.test(raw) || n.length < 13 || n.length > 19 || !passesLuhn(n)) {
            return "Enter a valid card number.";
        }
        return "";
    }

    function validateExpiration() {
        const m = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(fields.expiration.value.trim());
        if (!m) return "Use the format MM/YY.";
        const month = parseInt(m[1], 10);
        const year = 2000 + parseInt(m[2], 10);
        const now = new Date();
        const expired = year < now.getFullYear() ||
            (year === now.getFullYear() && month < now.getMonth() + 1);
        if (expired) return "This card has expired.";
        if (year > now.getFullYear() + 20) return "Check the expiration year.";
        return "";
    }

    function validateCvv() {
        return /^\d{3,4}$/.test(fields.cvv.value.trim()) ? "" : "Enter the 3 or 4 digit security code.";
    }

    const validators = [
        [fields.name, validateName],
        [fields.email, validateEmail],
        [fields.number, validateNumber],
        [fields.expiration, validateExpiration],
        [fields.cvv, validateCvv]
    ];

    // Clear an error as soon as the visitor edits that field
    validators.forEach(function (pair) {
        pair[0].addEventListener("input", function () { pair[0].setCustomValidity(""); });
    });

    function validateForm() {
        let ok = true;
        validators.forEach(function (pair) {
            const message = pair[1]();
            pair[0].setCustomValidity(message);
            if (message) ok = false;
        });
        if (!ok) form.reportValidity();
        return ok;
    }

    /* ---------- Ticket ---------- */

    // Unguessable ticket number from the browser's cryptographic random generator
    function makeTicketNumber() {
        const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no look-alike characters
        const bytes = new Uint8Array(12);
        crypto.getRandomValues(bytes);
        let code = "";
        bytes.forEach(function (b) { code += alphabet[b & 31]; });
        return "WOLF-" + code;
    }

    /* ---------- Submit ---------- */

    let submitting = false;

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (submitting) return; // ignore double-clicks

        if (!validateForm()) return;

        submitting = true;
        const payButton = form.querySelector("button[type=submit]");
        payButton.disabled = true;
        payButton.textContent = "Processing…";

        // Read only what the confirmation email needs, then delete the card data immediately
        const email = fields.email.value.trim();
        clearCardData();

        const ticketNumber = makeTicketNumber();
        const qrText = "The Wolfsonian-FIU Ticket " + ticketNumber;
        const qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" +
            encodeURIComponent(qrText);

        // Hand the ticket to the next page in this tab only (kept out of the URL and history)
        try {
            sessionStorage.setItem("wolfTicket", ticketNumber);
        } catch (err) {
            console.warn("Could not save the ticket for the next page.");
        }

        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
            to_email: email,
            message: "confirmation",
            ticket_number: ticketNumber,
            qr_code_url: qrCodeUrl
        })
        .catch(function () {
            // Log only that it failed, never the form contents
            console.error("Confirmation email failed.");
        })
        .finally(function () {
            fields.email.value = "";
            // replace() so Back does not return to a half-submitted checkout
            window.location.replace("questionare.html");
        });
    });
})();

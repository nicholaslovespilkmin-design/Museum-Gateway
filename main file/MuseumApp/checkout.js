"use strict";

(function () {
    const $ = function (id) { return document.getElementById(id); };

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

    // What a free-ticket holder must bring to the entrance (shown on the ticket page)
    const ENTRANCE_PROOF = Object.freeze({
        member: "Bring your membership card or the ID matching your membership.",
        florida: "Bring the Florida driver license or ID card you entered.",
        disability: "Staff may ask for documentation of disability at the entrance.",
        sus: "Bring your university ID card.",
        military: "Bring your military ID, VA card, or DD-214.",
        friday: "Valid Fridays from 6–9 PM only.",
        under6: "Children under 6 must be accompanied by an adult."
    });

    const ticketType = $("ticket-type");
    const ticketPrice = $("ticket-price");
    const form = $("payment-form");
    const payButton = $("pay-button");
    const cardSection = $("card-fields");
    const eligibilityNote = $("eligibility-note");
    const eligibilityGroups = Array.prototype.slice.call(form.querySelectorAll(".eligibility"));

    function currentType() {
        // Only accept known admission types
        if (!Object.prototype.hasOwnProperty.call(ticketPrices, ticketType.value)) {
            ticketType.value = "adult";
        }
        return ticketType.value;
    }

    function isFree(type) {
        return ticketPrices[type] === 0;
    }

    // Show/hide a block and enable/disable its inputs so hidden fields can't be submitted or focused
    function toggleSection(section, show) {
        section.hidden = !show;
        section.querySelectorAll("input, select").forEach(function (el) {
            el.disabled = !show;
            if (!show) el.setCustomValidity("");
        });
    }

    // Change the price and the required information when the admission type changes
    function updateAdmission() {
        const type = currentType();
        const price = ticketPrices[type];
        const free = isFree(type);

        ticketPrice.textContent = free ? "FREE" : "$" + price.toFixed(2);

        eligibilityGroups.forEach(function (group) {
            toggleSection(group, group.getAttribute("data-admission") === type);
        });
        toggleSection(cardSection, !free);

        $("form-heading").textContent = free ? "Eligibility Information" : "Payment Information";
        $("form-description").textContent = free
            ? (type === "under6"
                ? "No payment or ID needed. Enter an email to receive the ticket."
                : "Free admission requires proof of eligibility. Fill in every field below.")
            : "Enter your payment information below.";
        payButton.textContent = free ? "Get Free Ticket" : "Pay Now";

        eligibilityNote.hidden = !free;
        eligibilityNote.textContent = free ? ENTRANCE_PROOF[type] : "";
    }

    ticketType.addEventListener("change", updateAdmission);

    // EmailJS settings. The public key is designed to be public, but lock it down in the
    // EmailJS dashboard: restrict "Allowed origins" to your site's domain and set a rate limit.
    const EMAILJS_PUBLIC_KEY = "lF5ZcuoUx4YUYQm9n";
    const EMAILJS_SERVICE_ID = "service_zx94vmi";
    const EMAILJS_TEMPLATE_ID = "template_11206yp";

    emailjs.init({
        publicKey: EMAILJS_PUBLIC_KEY,
        limitRate: { id: "ticket-checkout", throttle: 10000 } // at most 1 email per 10 s per browser
    });

    const email = $("email");
    let submitting = false;

    // Every field holding card or ID data — wiped after processing, never stored
    const SENSITIVE_FIELDS = Array.prototype.slice.call(
        form.querySelectorAll("#card-fields input, .eligibility input, .eligibility select")
    );

    function clearSensitiveData() {
        SENSITIVE_FIELDS.forEach(function (field) {
            if (field.type === "checkbox") {
                field.checked = false;
                field.defaultChecked = false;
            } else if (field.tagName === "SELECT") {
                field.selectedIndex = 0;
            } else {
                field.value = "";
                field.defaultValue = "";
            }
            field.setCustomValidity("");
        });
    }

    // Also clear if the browser restores this page from its back/forward cache
    window.addEventListener("pageshow", function () {
        clearSensitiveData();
        submitting = false;
        payButton.disabled = false;
        ticketType.disabled = false;
        updateAdmission();
    });

    /* ---------- Validation helpers (each returns "" when valid, else an error message) ---------- */

    function value(id) { return $(id).value.trim(); }

    function digitsOnly(v) { return v.replace(/\D/g, ""); }

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

    function checkName(id, message) {
        return /^[\p{L}\p{M}' .-]{2,100}$/u.test(value(id)) ? "" : (message || "Enter your full name.");
    }

    function checkEmail(id) {
        const v = value(id);
        if (v.length > 254 || !/^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[A-Za-z]{2,}$/.test(v)) {
            return "Enter a valid email address.";
        }
        return "";
    }

    function checkChosen(id, message) {
        return $(id).value ? "" : message;
    }

    function checkTicked(id, message) {
        return $(id).checked ? "" : message;
    }

    // Free Friday is only valid Fridays 6–9 PM, Miami time
    function isFreeFridayNow() {
        const parts = new Intl.DateTimeFormat("en-US", {
            timeZone: "America/New_York", weekday: "short", hour: "numeric", hourCycle: "h23"
        }).formatToParts(new Date());
        const weekday = parts.find(function (p) { return p.type === "weekday"; }).value;
        const hour = parseInt(parts.find(function (p) { return p.type === "hour"; }).value, 10);
        return weekday === "Fri" && hour >= 18 && hour < 21;
    }

    /* ---------- Rules: which fields each admission type requires ---------- */

    const CARD_RULES = [
        ["card-name", function () { return checkName("card-name", "Enter the name as it appears on the card."); }],
        ["card-number", function () {
            const raw = $("card-number").value;
            const n = digitsOnly(raw);
            return (/[^\d ]/.test(raw) || n.length < 13 || n.length > 19 || !passesLuhn(n))
                ? "Enter a valid card number." : "";
        }],
        ["expiration", function () {
            const m = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(value("expiration"));
            if (!m) return "Use the format MM/YY.";
            const month = parseInt(m[1], 10);
            const year = 2000 + parseInt(m[2], 10);
            const now = new Date();
            if (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1)) {
                return "This card has expired.";
            }
            if (year > now.getFullYear() + 20) return "Check the expiration year.";
            return "";
        }],
        ["cvv", function () {
            return /^\d{3,4}$/.test(value("cvv")) ? "" : "Enter the 3 or 4 digit security code.";
        }]
    ];

    const ELIGIBILITY_RULES = {
        member: [
            ["member-name", function () { return checkName("member-name"); }],
            ["member-id", function () {
                return /^[A-Za-z0-9-]{5,12}$/.test(value("member-id")) ? "" : "Enter your membership number.";
            }]
        ],
        florida: [
            ["fl-name", function () { return checkName("fl-name", "Enter your name as shown on your ID."); }],
            ["fl-id", function () {
                // Florida DL / ID: 1 letter followed by 12 digits (dashes and spaces allowed)
                const id = value("fl-id").replace(/[\s-]/g, "");
                return /^[A-Za-z]\d{12}$/.test(id)
                    ? "" : "Enter a valid Florida ID number: 1 letter followed by 12 digits.";
            }],
            ["fl-zip", function () {
                // Florida ZIP codes are 320xx–349xx
                return /^3[2-4]\d{3}$/.test(value("fl-zip")) ? "" : "Enter a Florida ZIP code.";
            }]
        ],
        disability: [
            ["dis-name", function () { return checkName("dis-name"); }],
            ["dis-caregiver", function () {
                return value("dis-caregiver") === "" ? "" : checkName("dis-caregiver", "Enter the caregiver's full name.");
            }],
            ["dis-confirm", function () { return checkTicked("dis-confirm", "Please confirm eligibility."); }]
        ],
        sus: [
            ["sus-name", function () { return checkName("sus-name"); }],
            ["sus-school", function () { return checkChosen("sus-school", "Select your institution."); }],
            ["sus-email", function () {
                const problem = checkEmail("sus-email");
                if (problem) return problem;
                return /\.edu$/i.test(value("sus-email")) ? "" : "Use your university (.edu) email address.";
            }],
            ["sus-id", function () {
                return /^[A-Za-z0-9]{5,12}$/.test(value("sus-id")) ? "" : "Enter your university ID number.";
            }]
        ],
        military: [
            ["mil-name", function () { return checkName("mil-name"); }],
            ["mil-branch", function () { return checkChosen("mil-branch", "Select your branch of service."); }],
            ["mil-status", function () { return checkChosen("mil-status", "Select active duty or veteran."); }],
            ["mil-confirm", function () { return checkTicked("mil-confirm", "Please confirm you will show proof of service."); }]
        ],
        friday: [
            ["fri-name", function () {
                const problem = checkName("fri-name");
                if (problem) return problem;
                return isFreeFridayNow() ? "" : "Free Friday tickets are only available Fridays from 6–9 PM.";
            }]
        ],
        under6: []
    };

    function rulesFor(type) {
        const rules = [["email", function () { return checkEmail("email"); }]];
        return rules.concat(isFree(type) ? ELIGIBILITY_RULES[type] : CARD_RULES);
    }

    // Clear an error as soon as the visitor edits that field
    form.addEventListener("input", function (e) { e.target.setCustomValidity(""); });
    form.addEventListener("change", function (e) { e.target.setCustomValidity(""); });

    function validateForm(type) {
        let ok = true;
        rulesFor(type).forEach(function (rule) {
            const message = rule[1]();
            $(rule[0]).setCustomValidity(message);
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

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (submitting) return; // ignore double-clicks

        const type = currentType();
        if (!validateForm(type)) return;

        submitting = true;
        payButton.disabled = true;
        payButton.textContent = "Processing…";
        ticketType.disabled = true;

        // Read only what the confirmation email needs, then delete card/ID data immediately
        const toEmail = email.value.trim();
        const admissionLabel = ticketType.options[ticketType.selectedIndex].text;
        clearSensitiveData();

        const ticketNumber = makeTicketNumber();
        const qrText = "The Wolfsonian-FIU Ticket " + ticketNumber;
        const qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" +
            encodeURIComponent(qrText);

        // Hand the ticket to the next page in this tab only (kept out of the URL and history)
        try {
            sessionStorage.setItem("wolfTicket", ticketNumber);
            sessionStorage.setItem("wolfAdmission", admissionLabel);
            sessionStorage.setItem("wolfEntranceNote", isFree(type) ? ENTRANCE_PROOF[type] : "");
        } catch (err) {
            console.warn("Could not save the ticket for the next page.");
        }

        // ID numbers are never sent — only the admission type
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
            to_email: toEmail,
            message: "confirmation",
            ticket_number: ticketNumber,
            admission_type: admissionLabel,
            qr_code_url: qrCodeUrl
        })
        .catch(function () {
            // Log only that it failed, never the form contents
            console.error("Confirmation email failed.");
        })
        .finally(function () {
            email.value = "";
            // replace() so Back does not return to a half-submitted checkout
            window.location.replace("questionare.html");
        });
    });

    updateAdmission();
})();

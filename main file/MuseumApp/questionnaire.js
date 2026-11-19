"use strict";

// Locations from wolfsonian.org/whats-on/exhibitions+installations/
// Shared with recommendation.js, which only accepts an id from this list.
const EXHIBITS = Object.freeze({
    "foot-notes": { name: "Foot Notes: Shoes, Symbolism, and Society", location: "7th Floor" },
    "material-matters": { name: "Material Matters: How Synthetics Shaped a New Era", location: "Knight Lab 3, 3rd Floor" },
    "modern-design": { name: "Modern Design Across Borders", location: "6th Floor" },
    "la-superba": { name: "La Superba: Genoa and The Wolfsoniana", location: "6th Floor" },
    "harry-clarke": { name: "Harry Clarke and the Geneva Window", location: "5th Floor" },
    "featured": { name: "Our Featured Exhibition", location: "" }
});

(function () {
    const questionEl = document.getElementById("question");
    if (!questionEl) return; // loaded on a page without the questionnaire

    // Each question and the exhibit a "Yes" answer leads to
    const QUESTIONS = [
        { text: "Are you interested in fashion, identity, and personal style?", exhibit: "foot-notes" },
        { text: "Are you interested in materials, technology, and how things are made?", exhibit: "material-matters" },
        { text: "Are you interested in furniture, objects, and modern design?", exhibit: "modern-design" },
        { text: "Are you interested in travel, Italy, and cultural history?", exhibit: "la-superba" },
        { text: "Do you enjoy detailed artwork, literature, and unusual stories?", exhibit: "harry-clarke" }
    ];

    let questionIndex = 0;

    function answerYes() {
        showRecommendation(QUESTIONS[questionIndex].exhibit);
    }

    function answerNo() {
        questionIndex++;
        if (questionIndex < QUESTIONS.length) {
            questionEl.textContent = QUESTIONS[questionIndex].text;
        } else {
            showRecommendation("featured");
        }
    }

    function showRecommendation(exhibitId) {
        const exhibit = EXHIBITS[exhibitId];
        questionEl.textContent = "We think you'll enjoy:";

        // Built with DOM methods (no innerHTML) so text can never be run as HTML
        const name = document.createElement("strong");
        name.textContent = exhibit.name;
        const parts = [name];

        if (exhibit.location) {
            const place = document.createElement("p");
            place.className = "exhibit-location";
            place.textContent = "Location: " + exhibit.location;
            parts.push(place);
        }

        // Only the exhibit id goes in the URL; the next page looks the details up itself
        const link = document.createElement("a");
        link.href = "recomendation.html?exhibit=" + encodeURIComponent(exhibitId);
        link.className = "btn";
        link.textContent = "Continue";
        const linkWrap = document.createElement("p");
        linkWrap.append(link);
        parts.push(linkWrap);

        document.getElementById("result").replaceChildren(...parts);
        document.getElementById("buttons").style.display = "none";
    }

    questionEl.textContent = QUESTIONS[0].text;
    document.getElementById("yes-button").addEventListener("click", answerYes);
    document.getElementById("no-button").addEventListener("click", answerNo);
})();

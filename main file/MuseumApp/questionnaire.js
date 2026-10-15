let questionNumber = 1;

function answerYes() {
    if (questionNumber === 1) {
        showRecommendation(
            "Foot Notes: Shoes, Symbolism, and Society",
            "7th Floor"
        );
    }

    else if (questionNumber === 2) {
        showRecommendation(
            "Material Matters: How Synthetics Shaped a New Era",
            "Knight Lab 3, 3rd Floor"
        );
    }

    else if (questionNumber === 3) {
        showRecommendation(
            "Modern Design Across Borders",
            "6th Floor"
        );
    }

    else if (questionNumber === 4) {
        showRecommendation(
            "La Superba: Genoa and The Wolfsoniana",
            "6th Floor"
        );
    }

    else if (questionNumber === 5) {
        showRecommendation(
            "Harry Clarke and the Geneva Window",
            "5th Floor"
        );
    }
}


function answerNo() {
    questionNumber++;

    if (questionNumber === 2) {
        document.getElementById("question").textContent =
            "Are you interested in materials, technology, and how things are made?";
    }

    else if (questionNumber === 3) {
        document.getElementById("question").textContent =
            "Are you interested in furniture, objects, and modern design?";
    }

    else if (questionNumber === 4) {
        document.getElementById("question").textContent =
            "Are you interested in travel, Italy, and cultural history?";
    }

    else if (questionNumber === 5) {
        document.getElementById("question").textContent =
            "Do you enjoy detailed artwork, literature, and unusual stories?";
    }

    else {
        showRecommendation(
            "Our Featured Exhibition"
        );
    }
}


// Locations from wolfsonian.org/whats-on/exhibitions+installations/
function showRecommendation(exhibit, location) {
    document.getElementById("question").textContent =
        "We think you'll enjoy:";

    let html = "<strong>" + exhibit + "</strong>";

    if (location) {
        html += "<p class=\"exhibit-location\">Location: " + location + "</p>";
    }

    // Carry the result to the final page so it stays on screen
    let nextPage = "recomendation.html?exhibit=" + encodeURIComponent(exhibit);

    if (location) {
        nextPage += "&location=" + encodeURIComponent(location);
    }

    html += "<p><a href=\"" + nextPage + "\" class=\"btn\">Continue</a></p>";

    document.getElementById("result").innerHTML = html;

    document.getElementById("buttons").style.display = "none";
}
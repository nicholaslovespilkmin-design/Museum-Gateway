let questionNumber = 1;

function answerYes() {
    if (questionNumber === 1) {
        showRecommendation(
            "Foot Notes: Shoes, Symbolism, and Society"
        );
    }

    else if (questionNumber === 2) {
        showRecommendation(
            "Material Matters: How Synthetics Shaped a New Era"
        );
    }

    else if (questionNumber === 3) {
        showRecommendation(
            "Modern Design Across Borders"
        );
    }

    else if (questionNumber === 4) {
        showRecommendation(
            "La Superba: Genoa and The Wolfsoniana"
        );
    }

    else if (questionNumber === 5) {
        showRecommendation(
            "Harry Clarke and the Geneva Window"
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


function showRecommendation(exhibit) {
    document.getElementById("question").textContent =
        "We think you'll enjoy:";

    document.getElementById("result").innerHTML =
        "<strong>" + exhibit + "</strong>";

    document.getElementById("buttons").style.display = "none";
}
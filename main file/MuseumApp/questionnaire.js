"use strict";

/*
 * Shared exhibit data (also used by recommendation.js on recomendation.html).
 * Names match the locations listed in map.js.
 */
const EXHIBITS = Object.freeze({
    "material-matters": { name: "Material Matters: How Synthetics Shaped a New Era", location: "3rd Floor" },
    "brooch":           { name: "Brooch", location: "5th Floor" },
    "geneva-window":    { name: "Harry Clarke and the Geneva Window", location: "5th Floor" },
    "harry-clarke":     { name: "Prologue: Who Is Harry Clarke?", location: "5th Floor" },
    "paris-expo":       { name: "Paris Expo 1925", location: "4th Floor" },
    "library":          { name: "Highlights from The Wolfsonian Library", location: "3rd Floor" },
    "small-things":     { name: "In Small Things Remembered: Medallions, Poster Stamps, and Other Collectibles", location: "4th Floor" },
    "chandeliers":      { name: "Ceiling and Chandeliers", location: "7th Floor" },
    "dynamo":           { name: "Edison Bipolar Dynamo", location: "1st Floor" },
    "web-of-life":      { name: "Web of Life Floor", location: "1st Floor" }
});

/*
 * Question tree. Each answer points either to another question (by key)
 * or to a result: { exhibit: "<EXHIBITS key>" }.
 */
const QUESTIONS = Object.freeze({
    start: {
        text: "Are you interested in fashion, identity, and personal style?",
        yes: "wearable",
        no: "stainedGlass"
    },
    wearable: {
        text: "Do you love small, wearable pieces like jewelry?",
        yes: { exhibit: "brooch" },
        no: { exhibit: "material-matters" }
    },
    stainedGlass: {
        text: "Do you enjoy stained glass and art that tells a story?",
        yes: "artistStory",
        no: "worldsFair"
    },
    artistStory: {
        text: "Would you like to learn about the artist behind the work first?",
        yes: { exhibit: "harry-clarke" },
        no: { exhibit: "geneva-window" }
    },
    worldsFair: {
        text: "Are you curious about world's fairs and Art Deco design?",
        yes: { exhibit: "paris-expo" },
        no: "books"
    },
    books: {
        text: "Do you enjoy books, posters, and graphic design?",
        yes: { exhibit: "library" },
        no: "collectibles"
    },
    collectibles: {
        text: "Do you like collectibles such as medals and stamps?",
        yes: { exhibit: "small-things" },
        no: "architecture"
    },
    architecture: {
        text: "Are you interested in architecture and grand interiors?",
        yes: { exhibit: "chandeliers" },
        no: "technology"
    },
    technology: {
        text: "Are you interested in technology and industrial design?",
        yes: { exhibit: "dynamo" },
        no: { exhibit: "web-of-life" }
    }
});

(function () {
    const questionEl = document.getElementById("question");
    const yesButton = document.getElementById("yes-button");
    const noButton = document.getElementById("no-button");

    // This file is also loaded on the results page, which has no questions.
    if (!questionEl || !yesButton || !noButton) return;

    let current = "start";

    function show(key) {
        current = key;
        questionEl.textContent = QUESTIONS[key].text;
    }

    function answer(choice) {
        const next = QUESTIONS[current][choice];

        if (typeof next === "string") {
            show(next);
            return;
        }

        if (next && Object.prototype.hasOwnProperty.call(EXHIBITS, next.exhibit)) {
            window.location.href = "recomendation.html?exhibit=" + encodeURIComponent(next.exhibit);
        }
    }

    yesButton.addEventListener("click", function () { answer("yes"); });
    noButton.addEventListener("click", function () { answer("no"); });

    show("start");
})();

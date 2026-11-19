"use strict";

/*
 * Map coordinate positions are percentages of each original map image.
 * The 4th-floor exhibits reuse the 3rd-floor layout (same Knight Lab spots).
 */
const locations = [
    { id: 1,  name: "Library Shelving System", floor: 1, map: "maps/floor-1.png", x: 24.1, y: 68.9 },
    { id: 2,  name: "Bridge Tender House (Josephine Baker Pavilion)", floor: 1, map: "maps/floor-1.png", x: 30.5, y: 73.5 },
    { id: 3,  name: "Web of Life Floor", floor: 1, map: "maps/floor-1.png", x: 36.9, y: 69.1 },
    { id: 4,  name: "Edison Bipolar Dynamo", floor: 1, map: "maps/floor-1.png", x: 50.4, y: 68.5 },
    { id: 5,  name: "Workman’s Heel Print", floor: 1, map: "maps/floor-1.png", x: 62.4, y: 66.4 },
    { id: 6,  name: "Window Frames", floor: 1, map: "maps/floor-1.png", x: 73.8, y: 53.2 },
    { id: 7,  name: "Mailbox", floor: 1, map: "maps/floor-1.png", x: 66.8, y: 48.7 },

    { id: 8,  name: "Material Matters: How Synthetics Shaped a New Era", floor: 3, map: "maps/floor-3.png", x: 23.4, y: 57.9 },
    { id: 9,  name: "Highlights from The Wolfsonian Library", floor: 3, map: "maps/floor-3.png", x: 47.6, y: 58.8 },

    { id: 10, name: "In Small Things Remembered: Medallions, Poster Stamps, and Other Collectibles", floor: 4, map: "maps/floor-3.png", x: 23.4, y: 57.9 },
    { id: 11, name: "Paris Expo 1925", floor: 4, map: "maps/floor-3.png", x: 47.6, y: 58.8 },

    { id: 12, name: "Harry Clarke and the Geneva Window", floor: 5, map: "maps/floor-5.png", x: 49.0, y: 43.1 },
    { id: 13, name: "Brooch", floor: 5, map: "maps/floor-5.png", x: 56.4, y: 52.5 },
    { id: 14, name: "Inkstand and box", floor: 5, map: "maps/floor-5.png", x: 64.1, y: 52.9 },
    { id: 15, name: "Prologue: Who Is Harry Clarke?", floor: 5, map: "maps/floor-5.png", x: 64.1, y: 48.1 },
    { id: 16, name: "Intro: The Geneva Window", floor: 5, map: "maps/floor-5.png", x: 63.0, y: 44.3 },

    { id: 17, name: "Staircase", floor: 6, map: "maps/floor-6.png", x: 72.5, y: 48.4 },
    { id: 18, name: "Ceiling and Chandeliers", floor: 7, map: "maps/floor-7.png", x: 49.5, y: 59.4 }
];

const list = document.getElementById("locationList");
const mapImage = document.getElementById("mapImage");
const mapFloorLabel = document.getElementById("mapFloorLabel");
const marker = document.getElementById("locationMarker");
const mapTitle = document.getElementById("mapTitle");
const floorPill = document.getElementById("floorPill");
const mapCaption = document.getElementById("mapCaption");
const selectionStatus = document.getElementById("selectionStatus");

document.getElementById("selectionCount").textContent = locations.length + " locations";

let activeButton = null;

function floorName(floor) {
    const suffix = floor === 1 ? "st" : floor === 2 ? "nd" : floor === 3 ? "rd" : "th";
    return floor + suffix + " Floor";
}

function makeSpan(className, text, decorative) {
    const span = document.createElement("span");
    if (className) span.className = className;
    if (decorative) span.setAttribute("aria-hidden", "true");
    span.textContent = text;
    return span;
}

function buildLocationButtons() {
    locations.forEach((spot) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "location-button";
        button.setAttribute("aria-pressed", "false");
        // Built with textContent (not innerHTML) so names can never be run as HTML
        button.append(
            makeSpan("location-number", String(spot.id)),
            makeSpan("", spot.name),
            makeSpan("chevron", "›", true)
        );
        button.addEventListener("click", () => selectLocation(spot, button));
        list.appendChild(button);
        spot.button = button;
    });
}

/*
 * Narrator: reads the list of options aloud using the browser's
 * built-in text-to-speech. Press the button again to stop.
 */
const narratorButton = document.getElementById("narratorButton");
const narratorLabel = document.getElementById("narratorLabel");
const speech = window.speechSynthesis;
let narrating = false;
let narratorVoice = null;

function pickVoice() {
    if (!speech) return;
    const voices = speech.getVoices();
    narratorVoice =
        voices.find(v => v.lang.startsWith("en") && /natural|google|samantha|aria|jenny/i.test(v.name)) ||
        voices.find(v => v.lang.startsWith("en")) ||
        null;
}

function clearNarrationHighlight() {
    document.querySelectorAll(".location-button.is-narrating")
        .forEach(b => b.classList.remove("is-narrating"));
}

function setNarrating(on) {
    narrating = on;
    narratorButton.setAttribute("aria-pressed", on ? "true" : "false");
    narratorButton.setAttribute("aria-label", on ? "Stop reading the options" : "Read the options aloud");
    narratorLabel.textContent = on ? "Stop" : "Narrator";
    if (!on) clearNarrationHighlight();
}

function speak(text, onStart, onEnd) {
    const utterance = new SpeechSynthesisUtterance(text);
    if (narratorVoice) utterance.voice = narratorVoice;
    utterance.rate = 0.95;
    utterance.onstart = () => onStart && onStart();
    utterance.onend = () => onEnd && onEnd();
    utterance.onerror = () => onEnd && onEnd();
    speech.speak(utterance);
}

function startNarration() {
    speech.cancel();
    setNarrating(true);

    speak(`There are ${locations.length} exhibits and locations to choose from.`);

    locations.forEach((spot) => {
        speak(`Option ${spot.id}: ${spot.name}. ${floorName(spot.floor)}.`, () => {
            if (!narrating) return;
            clearNarrationHighlight();
            spot.button.classList.add("is-narrating");
            spot.button.scrollIntoView({ block: "nearest", behavior: "smooth" });
        });
    });

    speak("Select any option to see it on the map.", null, () => setNarrating(false));
}

function stopNarration() {
    speech.cancel();
    setNarrating(false);
}

if (speech) {
    pickVoice();
    speech.onvoiceschanged = pickVoice;
    narratorButton.addEventListener("click", () => {
        narrating ? stopNarration() : startNarration();
    });
} else {
    narratorButton.disabled = true;
    narratorButton.title = "Your browser does not support the narrator.";
}

function selectLocation(spot, button) {
    if (activeButton) {
        activeButton.setAttribute("aria-pressed", "false");
    }

    activeButton = button;
    activeButton.setAttribute("aria-pressed", "true");

    mapTitle.textContent = spot.name;
    floorPill.textContent = floorName(spot.floor);
    mapFloorLabel.textContent = floorName(spot.floor);
    mapCaption.textContent = `Location ${spot.id}: ${spot.name}. The gold circle marks this point on the ${floorName(spot.floor).toLowerCase()} map.`;

    // Show the marker once the right floor image has loaded
    mapImage.onerror = () => {
        mapCaption.textContent = `Could not load ${spot.map}. Make sure the maps folder is next to this HTML file.`;
        marker.hidden = true;
    };
    mapImage.onload = () => {
        marker.hidden = false;
    };

    if (mapImage.getAttribute("src") !== spot.map) {
        mapImage.setAttribute("src", spot.map);
    } else {
        marker.hidden = false;
    }

    mapImage.alt = `Wolfsonian museum ${floorName(spot.floor).toLowerCase()} map`;
    marker.style.left = spot.x + "%";
    marker.style.top = spot.y + "%";

    const heading = document.createElement("strong");
    heading.textContent = "Selected: " + spot.name;
    selectionStatus.replaceChildren(
        heading,
        document.createElement("br"),
        `${floorName(spot.floor)} · Point ${spot.id}`
    );
}

buildLocationButtons();

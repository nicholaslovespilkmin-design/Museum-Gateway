"use strict";

(function () {
    const exhibitId = new URLSearchParams(window.location.search).get("exhibit");
    if (!exhibitId || !Object.prototype.hasOwnProperty.call(EXHIBITS, exhibitId)) return;

    const exhibit = EXHIBITS[exhibitId];
    const result = document.getElementById("result");

    const label = document.createElement("p");
    label.className = "return-note";
    label.textContent = "Your recommended exhibit:";

    const name = document.createElement("strong");
    name.textContent = exhibit.name;

    result.append(label, name);

    if (exhibit.location) {
        const place = document.createElement("p");
        place.className = "exhibit-location";
        place.textContent = "Location: " + exhibit.location;
        result.append(place);
    }
})();

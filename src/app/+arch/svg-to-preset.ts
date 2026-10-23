import { Service } from "@angular/core";
import type { Party } from "./types.js";

@Service()
export class SvgToPreset {
    toPreset(svg: SVGSVGElement): readonly Party[] {
        const parties = [];

        let foundUnknownGElements = false;
        for (const g of svg.querySelectorAll("g")) {
            const name = g.querySelector("title")?.textContent;
            if (!name) {
                foundUnknownGElements = true;
                continue;
            }

            const color = g.style.fill;
            if (!color) {
                console.warn(`Party ${name} has no identified color`);
            }

            const borderColor = g.style.stroke;
            // const borderWidth = g.style.strokeWidth; // the value is scaled and unusable

            const nSeats = g.querySelectorAll("circle").length;

            parties.push({
                name,
                nSeats,
                color: color || "black",
                borderColor,
                borderWidth: 0,
            });
        }

        if (!parties.length) {
            if (foundUnknownGElements) {
                throw new Error("Unrecognized diagram, could not extract party data.");
            } else {
                throw new Error("No party found in the diagram.");
            }
        } else if (foundUnknownGElements) {
            console.warn("Found unrecognized contents in the diagram, some parties may have been missed.");
        }

        return parties;
    }
}

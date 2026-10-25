import { Service } from "@angular/core";
import { BaseSvgConverter } from "../shared/base-svg-converter.js";
import type { Party } from "./types.js";

@Service()
export class SvgToPreset extends BaseSvgConverter<readonly Party[]> {
    protected override convert(svg: SVGSVGElement): readonly Party[] {
        const parties = [];

        for (const g of svg.querySelectorAll("g")) {
            const name = g.querySelector("title")?.textContent ?? "";

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
            throw new Error("No party found in the diagram.");
        }

        return parties;
    }
}

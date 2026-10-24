import { Service } from "@angular/core";
import { BaseSvgConverter } from "../shared/base-svg-converter.js";
import type { PartiesPerArea, Party } from "./types.js";

const errorMessage = "Could not identify the seating areas inside the diagram";

@Service()
export class SvgToPreset extends BaseSvgConverter<PartiesPerArea> {
    protected override convert(svg: SVGSVGElement): PartiesPerArea {
        const gs = svg.querySelectorAll<SVGGElement>(":scope>g");
        let speakerG,
            governmentG,
            oppositionG,
            crossG;
        if (gs.length == 4) {
            [speakerG, governmentG, oppositionG, crossG] = gs;
        } else if (gs.length < 4) {
            for (const g of gs) {
                const transforms = g.transform.baseVal;
                const translate: SVGTransform = Array.prototype.find.call(transforms, t => t.type === SVGTransform.SVG_TRANSFORM_TRANSLATE);
                const x = translate.matrix.e;
                const y = translate.matrix.f;

                if (x < 0 && y < 0) {
                    if (speakerG) {
                        throw new Error(errorMessage + " (too many speaker areas)");
                    }
                    speakerG = g;
                } else if (x == 0) {
                    if (y > 0) {
                        if (governmentG) {
                            throw new Error(errorMessage + " (too many government areas)");
                        }
                        governmentG = g;
                    } else if (y < 0) {
                        if (oppositionG) {
                            throw new Error(errorMessage + " (too many opposition areas)");
                        }
                        oppositionG = g;
                    } else {
                        throw new Error(errorMessage + " (0-0 offsets)");
                    }
                } else if (y < 0) {
                    if (crossG) {
                        throw new Error(errorMessage + " (too many crossbench areas)");
                    }
                    crossG = g;
                } else {
                    throw new Error(errorMessage + " (double positive offset)");
                }
            }
        } else {
            throw new Error(errorMessage + " (too many areas)");
        }

        return {
            speak: this.findParties(speakerG),
            government: this.findParties(governmentG),
            opposition: this.findParties(oppositionG),
            cross: this.findParties(crossG),
        };
    }

    private findParties(areaGroup: SVGGElement|undefined): readonly Party[] {
        if (areaGroup)
            return Array.from(areaGroup.querySelectorAll<SVGGElement>(":scope>g"), g => {
                const name = g.querySelector("title")?.textContent ?? "";

                const color = g.getAttribute("fill") ?? "black";
                const borderWidth = +(g.getAttribute("stroke-width") ?? 0) || 0;
                const borderColor = g.getAttribute("stroke") ?? "black";

                const nSeats = g.querySelectorAll("rect").length;

                return { name, nSeats, color, borderColor, borderWidth, roundingRadius: null };
            });
        return [];
    }
}

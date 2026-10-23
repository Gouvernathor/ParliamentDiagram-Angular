import { Service } from "@angular/core";

const domParser = new DOMParser();

@Service()
export class SvgFileParse {
    async extract(f: File): Promise<SVGSVGElement> {
        const root = domParser.parseFromString(await f.text(), "image/svg+xml").documentElement;
        if (root instanceof SVGSVGElement) {
            return root;
        }
        throw new Error("The passed file was the wrong type");
    }
}

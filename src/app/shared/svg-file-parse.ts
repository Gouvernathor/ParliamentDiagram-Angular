import { Service } from "@angular/core";

const domParser = new DOMParser();

@Service()
export class SvgFileParse {
    async extract(f: File) {
        return domParser.parseFromString(await f.text(), "image/svg+xml").documentElement as unknown as SVGSVGElement;
    }
}

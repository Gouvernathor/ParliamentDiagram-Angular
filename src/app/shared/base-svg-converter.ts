const domParser = new DOMParser();

export abstract class BaseSvgConverter<T> {
    async extract(f: File): Promise<T> {
        return this.convert(await this.parse(f));
    }

    private async parse(f: File): Promise<SVGSVGElement> {
        const root = domParser.parseFromString(await f.text(), "image/svg+xml").documentElement;
        if (root instanceof SVGSVGElement) {
            return root;
        }
        throw new Error("The passed file was the wrong type");
    }

    protected abstract convert(svg: SVGSVGElement): T;
}

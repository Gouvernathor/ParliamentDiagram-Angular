import { downloadBlob } from "canvas-blob-manager/copyDownloadBlob";

export function downloadDiagram(diagram: SVGSVGElement,
    filename = "parliament-diagram.svg",
) {
    const blob = new Blob([diagram.outerHTML], { type: "image/svg+xml" });
    downloadBlob(blob, filename);
}

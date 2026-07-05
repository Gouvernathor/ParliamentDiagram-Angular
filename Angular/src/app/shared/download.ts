import { downloadBlob } from "canvas-blob-manager/copyDownloadBlob";

export function diagramToBlob(diagram: SVGSVGElement) {
    return new Blob([diagram.outerHTML], { type: "image/svg+xml" });
}

export function downloadDiagram(diagram: SVGSVGElement,
    filename = "parliament-diagram.svg",
) {
    const blob = diagramToBlob(diagram);
    downloadBlob(blob, filename);
}

export function downloadJson(data: Object,
    filename = "diagram-data.json",
) {
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    downloadBlob(blob, filename);
}

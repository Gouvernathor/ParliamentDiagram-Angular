import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class ColorService {
    private static readonly LETTERS: readonly string[] = "0123456789ABCDEF".split("");

    /**
     * Does not include the starting #
     */
    randomColor() {
        return "#" + Array.from({ length: 6 }, () => ColorService.LETTERS[Math.floor(Math.random() *16)])
            .join("");
    }
}

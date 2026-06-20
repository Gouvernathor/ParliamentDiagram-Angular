import { Directive, effect, ElementRef, inject, input } from "@angular/core";

@Directive({
    selector: "[appContents]",
    host: {
        "[style.display]": "'contents'"
    },
})
export class Contents {
    private readonly elementRef = inject<ElementRef<Element>>(ElementRef);
    readonly node = input.required<Element>({ alias: "appContents" });

    constructor() {
        const el = this.elementRef.nativeElement;
        effect(() => el.replaceChildren(this.node()));
    }
}

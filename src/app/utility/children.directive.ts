import { Directive, effect, ElementRef, inject, input } from '@angular/core';

@Directive({
    selector: '[appChildren]'
})
export class ChildrenDirective {
    private readonly elementRef = inject<ElementRef<Element>>(ElementRef);

    readonly children = input.required<readonly Element[]>({ alias: 'appChildren' });

    constructor() {
        const el = this.elementRef.nativeElement;
        el.replaceChildren ??= () => {
            while (el.firstChild) {
                el.removeChild(el.firstChild);
            }
        };
        effect(() => {
            el.replaceChildren(...this.children());
        });
    }
}

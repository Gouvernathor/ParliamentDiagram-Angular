import { Directive, effect, ElementRef, inject, input } from '@angular/core';

@Directive({
    selector: '[appFirstChild]'
})
export class FirstChildDirective {
    private readonly elementRef = inject<ElementRef<Element>>(ElementRef);

    readonly child = input.required<Element>({ alias: 'appFirstChild' });

    constructor() {
        const el = this.elementRef.nativeElement;
        effect(() => {
            const child = this.child();
            const firstChild = el.firstChild;
            if (firstChild !== child) {
                el.insertBefore(child, firstChild);
            } else if (!firstChild) {
                el.appendChild(child);
            }
        });
    }
}

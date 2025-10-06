import { Component, effect, output, signal } from '@angular/core';
import { FillingStrategy } from 'parliamentarch/geometry';

export interface ArchOptions {
    readonly seatRadiusFactor: number;

    readonly minNRows: number;
    readonly fillingStrategy: FillingStrategy;
    readonly spanAngle: number;

    readonly canvasSize: number;
    readonly margins: number;
    readonly writeNumberOfSeats: boolean;
    readonly fontSizeFactor: number;
}

@Component({
    selector: 'app-advanced-options',
    imports: [],
    templateUrl: './advanced-options.html',
    styleUrl: './advanced-options.scss'
})
export class AdvancedOptions {
    readonly options = output<ArchOptions>();

    // imports for the template
    FillingStrategy = FillingStrategy;

    readonly localOptions = signal<ArchOptions>({
        seatRadiusFactor: .8,
        minNRows: 0,
        fillingStrategy: FillingStrategy.DEFAULT,
        spanAngle: 360,
        canvasSize: 500,
        margins: 10,
        writeNumberOfSeats: true,
        fontSizeFactor: 1,
    });

    constructor() {
        effect(() => this.options.emit(this.localOptions()));
    }

    updateFillingStrategy(s: FillingStrategy) {
        this.localOptions.update(o => ({ ...o, fillingStrategy: s }));
    }
    updateMinNRows(n: string) {
        const v = Number(n);
        if (Number.isInteger(v) && v >= 0) {
            this.localOptions.update(o => ({ ...o, minNRows: v }));
        }
    }
}

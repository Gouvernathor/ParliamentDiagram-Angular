import { Component, inject, signal } from '@angular/core';
import { form } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { StandardPage } from '../shared/standard-page/standard-page';
import { ColorService } from '../shared/color-service';

interface Party {
    name: string;
    nSeats: number;
    color: string;
    borderWidth: number;
    borderColor: string;
}

interface DiagramData {
    parties: readonly Party[];
    seatRadiusFactor: number|null;
    seatNumberFontSizeFactor: number|null;
    minNRows: number|null;
    fillingStrategy: unknown|null;
    spanAngle: number|null;
}

@Component({
    imports: [StandardPage, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule],
    templateUrl: './arch-input-form.html',
    styleUrl: './arch-input-form.scss',
})
export class ArchInputFormPage {
    private readonly colorService = inject(ColorService);

    private readonly diagramModel = signal<DiagramData>({
        parties: [],
        seatRadiusFactor: null,
        seatNumberFontSizeFactor: null,
        minNRows: null,
        fillingStrategy: null,
        spanAngle: null,
    });
    protected readonly diagramForm = form(this.diagramModel);

    protected addParty() {
        const party = this.newParty();

        this.diagramForm.parties().value.update(p => p.concat([party]));
    }

    private newParty(): Party {
        return {
            name: "",
            nSeats: 0,
            color: this.colorService.randomColor(),
            borderWidth: 0,
            borderColor: "black",
        };
    }
}

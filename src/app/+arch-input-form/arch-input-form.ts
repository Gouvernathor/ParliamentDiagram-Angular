import { Component, inject, signal } from '@angular/core';
import { applyEach, form, FormField, max, min, minLength, validate } from '@angular/forms/signals';
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
    imports: [StandardPage, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, FormField],
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
    protected readonly diagramForm = form(this.diagramModel, schemaPath => {
        minLength(schemaPath.parties, 1);
        applyEach(schemaPath.parties, party => {
            min(party.nSeats, 0);
            min(party.borderWidth, 0);
            max(party.borderWidth, 1);
        });
        validate(schemaPath.parties, ({value}) => {
            const totalNSeats = value().reduce((a, p) => a+p.nSeats, 0);
            if (!totalNSeats) {
                return { kind: "minimum seats", message: "There must be at least one seat" };
            }
            return;
        });

        validate(schemaPath.seatRadiusFactor, ({value}) => {
            const v = value();
            if (!(v == null || 0 < v)) {
                return { kind: "bound", message: "The seat radius factor must be greater than 0" };
            }
            return;
        });

        validate(schemaPath.seatNumberFontSizeFactor, ({value}) => {
            const v = value();
            if (!(v == null || 0 <= v)) {
                return { kind: "bound", message: "The size factor for the font size cannot be less than 0" };
            }
            return;
        });

        validate(schemaPath.minNRows, ({value}) => {
            const v = value();
            if (!(v == null || 0 <= v)) {
                return { kind: "bound", message: "The minimum number of rows cannot be less than 0" };
            }
            return;
        });

        // fillingStrategy null or among values
        // spanAngle null or (weird conditions)
    });

    protected readonly diagrams = signal<readonly unknown[]>([]);

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

    protected removeParty(index: number) {
        this.diagramForm.parties().value.update(p => {
            const s = p.slice();
            s.splice(index, 1);
            return s;
        });
    }

    protected generateDiagram() {
        const attrib = this.diagramForm.parties().value().map(fp => ({
            data: fp.name,
            color: fp.color,
            nSeats: fp.nSeats,
            borderSize: fp.borderWidth,
            borderColor: fp.borderColor,
        }));

        const diagram: unknown = JSON.stringify(attrib);
        this.diagrams.update(l => [ diagram ].concat(l));
    }
}

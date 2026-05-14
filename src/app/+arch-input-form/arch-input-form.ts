import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { StandardPage } from '../shared/standard-page/standard-page';
import { ColorService } from '../shared/color-service';

interface Party {
    name: string;
    nSeats: number;
    color: string;
    borderWidth: number;
    borderColor: string;
}

@Component({
    imports: [StandardPage, MatButtonModule],
    templateUrl: './arch-input-form.html',
    styleUrl: './arch-input-form.scss',
})
export class ArchInputFormPage {
    private readonly colorService = inject(ColorService);
    protected readonly parties = signal<readonly Readonly<Party>[]>([]);

    protected addParty() {
        const party = this.newParty();

        this.parties.set(this.parties().concat([party]));
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

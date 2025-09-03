import { Component } from '@angular/core';
import { FillingStrategy } from 'parliamentarch/geometry';

@Component({
  selector: 'app-archinputform',
  imports: [],
  templateUrl: './archinputform.html',
  styleUrl: './archinputform.scss'
})
export class Archinputform {
    // imports for the template
    FillingStrategy = FillingStrategy;

    fillingStrategy = FillingStrategy.DEFAULT;
    isAdvancedHidden = true;

    toggleAdvanced() {
        this.isAdvancedHidden = !this.isAdvancedHidden;
    }
}

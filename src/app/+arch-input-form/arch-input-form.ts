import { Component } from '@angular/core';
import { StandardPage } from '../shared/standard-page/standard-page';
import { MatButtonModule } from '@angular/material/button';

@Component({
  imports: [StandardPage, MatButtonModule],
  templateUrl: './arch-input-form.html',
  styleUrl: './arch-input-form.scss',
})
export class ArchInputFormPage {}

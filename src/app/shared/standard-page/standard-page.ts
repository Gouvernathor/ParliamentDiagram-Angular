import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-standard-page',
  imports: [RouterLink, MatCardModule, MatToolbarModule],
  templateUrl: './standard-page.html',
  styleUrl: './standard-page.scss',
})
export class StandardPage {}

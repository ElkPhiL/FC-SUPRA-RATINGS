import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-match-create',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-match-create.component.html',
  styleUrls: ['./admin-match-create.component.scss'],
})
export class AdminMatchCreateComponent {}

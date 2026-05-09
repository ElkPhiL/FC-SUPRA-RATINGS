import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-player-create',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-player-create.component.html',
  styleUrls: ['./admin-player-create.component.scss'],
})
export class AdminPlayerCreateComponent {}

import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-player-edit',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-player-edit.component.html',
  styleUrls: ['./admin-player-edit.component.scss'],
})
export class AdminPlayerEditComponent {
  get id() {
    return this.route.snapshot.paramMap.get('id');
  }

  constructor(private route: ActivatedRoute) {}
}

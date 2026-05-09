import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-lineup',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-lineup.component.html',
  styleUrls: ['./admin-lineup.component.scss'],
})
export class AdminLineupComponent {
  get id() {
    return this.route.snapshot.paramMap.get('id');
  }

  constructor(private route: ActivatedRoute) {}
}

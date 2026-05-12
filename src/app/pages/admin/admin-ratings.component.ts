import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-ratings',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-ratings.component.html',
  styleUrls: ['./admin-ratings.component.scss'],
})
export class AdminRatingsComponent {
  get id() {
    return this.route.snapshot.paramMap.get('id');
  }

  constructor(private route: ActivatedRoute) {}
}

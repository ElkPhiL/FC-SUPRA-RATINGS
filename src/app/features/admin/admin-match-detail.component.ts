import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-match-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-match-detail.component.html',
  styleUrls: ['./admin-match-detail.component.scss'],
})
export class AdminMatchDetailComponent {
  get id() {
    return this.route.snapshot.paramMap.get('id');
  }

  constructor(private route: ActivatedRoute) {}
}

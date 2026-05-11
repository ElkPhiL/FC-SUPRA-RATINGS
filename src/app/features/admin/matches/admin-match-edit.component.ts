import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-match-edit',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-match-edit.component.html',
  styleUrls: ['./admin-match-edit.component.scss'],
})
export class AdminMatchEditComponent {
  get id() {
    return this.route.snapshot.paramMap.get('id');
  }

  constructor(private route: ActivatedRoute) {}
}

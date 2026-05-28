import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ClubsService } from '../../../services/clubs.service';
import { ClubFormComponent } from '../../../components/club-form/club-form.component';


@Component({
  selector: 'app-admin-club-create',
  standalone: true,
  imports: [ClubFormComponent],
  templateUrl: './admin-club-create.component.html',
  styleUrls: ['./admin-club-create.component.scss'],
})
export class AdminClubCreateComponent {
  loading = signal(false);
  message = signal('');

  constructor(
    private clubsService: ClubsService,
    private router: Router
  ) {}

  async create(payload: any) {
    try {
      this.loading.set(true);

      await this.clubsService.create(payload);

      this.message.set('Club créé');
      this.router.navigate(['/admin/clubs']);
    } catch {
      this.message.set('Erreur création');
    } finally {
      this.loading.set(false);
    }
  }
}
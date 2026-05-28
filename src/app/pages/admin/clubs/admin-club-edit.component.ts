import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClubFormComponent } from '../../../components/club-form/club-form.component';
import { ClubsService } from '../../../services/clubs.service';
import { Club } from '../../../models/club.model';

@Component({
  selector: 'app-admin-club-edit',
  standalone: true,
  imports: [CommonModule, ClubFormComponent],
  templateUrl: './admin-club-edit.component.html',
  styleUrls: ['./admin-club-edit.component.scss'],
})
export class AdminClubEditComponent implements OnInit {
  club = signal<Club | null>(null);

  loading = signal(true);
  saving = signal(false);
  message = signal('');

  id!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clubsService: ClubsService
  ) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.load();
  }

  async load() {
    try {
      const data = await this.clubsService.getById(this.id);
      this.club.set(data);
    } catch {
      this.message.set('Erreur chargement club');
    } finally {
      this.loading.set(false);
    }
  }

  async update(payload: any) {
    try {
      this.saving.set(true);

      await this.clubsService.update(this.id, payload);

      this.message.set('Club modifié');

      this.router.navigate(['/admin/clubs']);

    } catch {
      this.message.set('Erreur modification');
    } finally {
      this.saving.set(false);
    }
  }
}
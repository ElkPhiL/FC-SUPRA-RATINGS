import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Club } from '../../../models/club.model';
import { ClubsService } from '../../../services/clubs.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-clubs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-clubs.component.html',
  styleUrls: ['./admin-clubs.component.scss'],
})
export class AdminClubsComponent {
  clubs = signal<Club[]>([]);
  loading = signal(true);
  message = signal('');

  constructor(private clubsService: ClubsService) {
    this.loadClubs();
  }

  async loadClubs() {
    this.loading.set(true);
    this.message.set('');

    try {
      const matches = await this.clubsService.getAll();
      this.clubs.set(matches);

      if (!this.clubs.length) {
        this.message.set('Aucun club enregistré pour l’instant.');
      }
    } catch (error: any) {
      console.error('Erreur lors du chargement des clubs', error);
      this.message.set(`Erreur de chargement: ${error?.message ?? 'Erreur inconnue'}`);
    } finally {
      this.loading.set(false);
    }
  }

  async deleteClub(id: number) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce club ?')) {
      return;
    }
    this.loading.set(true);
    this.message.set('');
    try {
      await this.clubsService.delete(id);
      this.message.set('Club supprimé');
      this.loadClubs();
    } catch (error: any) {
      console.error('Erreur lors de la suppression du club', error);
      this.message.set(`Erreur de suppression: ${error?.message ?? 'Erreur inconnue'}`);
    } finally {
      this.loading.set(false);
    }
  }
}
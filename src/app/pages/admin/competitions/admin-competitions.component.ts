import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Competition } from '../../../models/competition.model';
import { CompetitionsService } from '../../../services/competitions.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-competitions',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-competitions.component.html',
  styleUrls: ['./admin-competitions.component.scss'],
})
export class AdminCompetitionsComponent {
  competitions = signal<Competition[]>([]);
  loading = signal(true);
  message = signal('');

  constructor(private competitionsService: CompetitionsService) {
    this.loadCompetitions();
  }

  async loadCompetitions() {
    this.loading.set(true);

    try {
      const competitions = await this.competitionsService.getAll();

      this.competitions.set(competitions);

      if (competitions.length === 0) {
        this.message.set('Aucune compétition enregistrée.');
      }
    } catch (error: any) {
      this.message.set(`Erreur: ${error?.message}`);
    } finally {
      this.loading.set(false);
    }
  }

  async deleteCompetition(id: number) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette compétition ?')) {
      return;
    }
    this.loading.set(true);
    this.message.set('');
    try {
      await this.competitionsService.delete(id);
      this.message.set('Compétition supprimée');
      this.loadCompetitions();
    } catch (error: any) {
      console.error('Erreur lors de la suppression de la compétition', error);
      this.message.set(`Erreur de suppression: ${error?.message ?? 'Erreur inconnue'}`);
    } finally {
      this.loading.set(false);
    }
  }
}
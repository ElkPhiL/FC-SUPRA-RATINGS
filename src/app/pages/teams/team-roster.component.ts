import { Component, signal, computed, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayersService } from '../../services/players.service';
import { Player } from '../../models/player.model';
import { PlayerCardComponent } from '../../components/player-card/player-card.component';

@Component({
  selector: 'app-team-roster',
  standalone: true,
  imports: [CommonModule, PlayerCardComponent],
  templateUrl: './team-roster.component.html',
  styleUrls: ['./team-roster.component.scss'],
})
export class TeamRosterComponent implements OnInit {
  // 🎯 Reçoit automatiquement la valeur du paramètre :id défini dans ton RouterModule
  @Input() id!: string; 

  private playersService = inject(PlayersService);

  players = signal<Player[]>([]);
  teamName = signal<string>('Équipe');
  loading = signal(true);
  message = signal('');

  private sortMethod = (a: Player, b: Player) => (a.number ?? 0) - (b.number ?? 0);

  // Signaux calculés (identiques à ton implémentation, propres et réactifs)
  gardiens = computed(() => 
    this.players().filter(p => ['GK', 'GARDIEN'].includes((p.best_position ?? '').toUpperCase())).sort(this.sortMethod)
  );

  defenseurs = computed(() => 
    this.players().filter(p => ['CB', 'RB', 'LB', 'LWB', 'RWB'].includes((p.best_position ?? '').toUpperCase())).sort(this.sortMethod)
  );

  milieux = computed(() => 
    this.players().filter(p => ['CM', 'CDM', 'CAM', 'RM', 'LM'].includes((p.best_position ?? '').toUpperCase())).sort(this.sortMethod)
  );

  attaquants = computed(() => 
    this.players().filter(p => ['ST', 'RW', 'LW'].includes((p.best_position ?? '').toUpperCase())).sort(this.sortMethod)
  );

  ngOnInit() {
    if (this.id) {
      this.loadRoster(Number(this.id));
    } else {
      this.message.set("Aucun identifiant d'équipe fourni dans l'URL.");
      this.loading.set(false);
    }
  }

  async loadRoster(teamId: number) {
    this.loading.set(true);
    this.message.set('');

    try {
      const roster = await this.playersService.getPlayersByTeam(teamId);
      this.players.set(roster);

      if (roster.length > 0) {
        // Extrait dynamiquement le nom de l'équipe depuis le premier joueur trouvé pour le titre
        const firstPlayerTeam = roster[0].team;
        if (firstPlayerTeam) {
          this.teamName.set(firstPlayerTeam.name);
        }
      } else {
        this.message.set('Aucun joueur trouvé dans cet effectif.');
      }
    } catch (error: any) {
      console.error('Erreur lors du chargement de l\'effectif:', error);
      this.message.set(`Erreur: ${error.message || 'Impossible de charger l\'effectif'}`);
    } finally {
      this.loading.set(false);
    }
  }
}
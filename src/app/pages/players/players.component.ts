import { Component, signal, computed } from '@angular/core'; // 👈 Ajout de computed
import { CommonModule } from '@angular/common';
import { PlayersService } from '../../services/players.service';
import { Player } from '../../models/player.model';
import { PlayerCardComponent } from '../../components/player-card/player-card.component';

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [CommonModule, PlayerCardComponent],
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss'],
})
export class PlayersComponent {
  players = signal<Player[]>([]);
  loading = signal(true);
  message = signal('');

  // 🛠️ FONCTION DE TRI COMMUNE (Par numéro de maillot croissant)
  private sortMethod = (a: Player, b: Player) => (a.number ?? 0) - (b.number ?? 0);

  // 🔄 LISTES CALCULÉES ET TRIÉES DYNAMIQUEMENT
  gardiens = computed(() => 
    this.players().filter(p => ['GK', 'GARDIEN'].includes((p.best_position ?? '').toUpperCase()))
                   .sort(this.sortMethod)
  );

  defenseurs = computed(() => 
    this.players().filter(p => ['CB', 'RB', 'LB', 'LWB', 'RWB'].includes((p.best_position ?? '').toUpperCase()))
                   .sort(this.sortMethod)
  );

  milieux = computed(() => 
    this.players().filter(p => ['CM', 'CDM', 'CAM', 'RM', 'LM'].includes((p.best_position ?? '').toUpperCase()))
                   .sort(this.sortMethod)
  );

  attaquants = computed(() => 
    this.players().filter(p => ['ST', 'RW', 'LW'].includes((p.best_position ?? '').toUpperCase()))
                   .sort(this.sortMethod)
  );

  constructor(private playersService: PlayersService) {
    this.loadPlayers();
  }

  async loadPlayers() {
    this.loading.set(true);
    this.message.set('');

    try {
      const players = await this.playersService.getPlayersWithPositions();
      this.players.set(players);

      if (!players.length) {
        this.message.set('Aucun joueur actif trouvé.');
      }
    } catch (error: any) {
      console.error('Erreur lors du chargement des joueurs', error);
      this.message.set(`Erreur de chargement: ${error.message || 'Erreur inconnue'}`);
    } finally {
      this.loading.set(false);
    }
  }
}
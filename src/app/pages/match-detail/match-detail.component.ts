import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { Match } from '../../models/match.model';
import { Formation } from '../../models/formation.model';
import { Player } from '../../models/player.model';
import { LineupPitchComponent } from '../../components/lineup-pitch/lineup-pitch.component';
import { FORMATIONS } from '../../shared/constants/formations';
import { MatchesService } from '../../services/matches.service';
import { MatchPlayersService } from '../../services/match-players.service';
import { PlayersService } from '../../services/players.service';

@Component({
  selector: 'app-match-detail',
  imports: [CommonModule, LineupPitchComponent],
  templateUrl: './match-detail.component.html',
  styleUrl: './match-detail.component.scss',
})
export class MatchDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private playersService = inject(PlayersService);
  private matchesService = inject(MatchesService);
  private matchPlayersService = inject(MatchPlayersService);
  matchId = signal<number>(+this.route.snapshot.params['id']);
  match = signal<Match | null>(null);
  players = signal<Player[]>([]);
  loading = signal(true);
  error = signal('');

  formations = FORMATIONS;
  homeFormation = signal<Formation>(this.formations[0]);
  homeLineup = signal<Record<string, Player | null>>({});

  constructor(private supabaseService: SupabaseService) {
    this.loadPlayers();
    this.loadHomeLineup();
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadMatch(id);
    }
  }

  async loadMatch(id: string) {
    this.loading.set(true);
    this.error.set('');

    try {
      const { data, error } = await this.supabaseService.supabase
        .from('matches')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        this.error.set('Erreur lors du chargement du match');
        console.error('Error fetching match:', error);
      } else {
        this.match.set(data as Match);
      }
    } catch (err) {
      this.error.set('Une erreur est survenue');
      console.error('Error:', err);
    } finally {
      this.loading.set(false);
    }
  }

    async loadPlayers() {
    this.loading.set(true);

    try {
        const players = await this.playersService.getPlayersWithPositions();
        this.players.set(players);

        if (!players.length) {
        }

    } catch (error: any) {
    } finally {
        this.loading.set(false);
    }
  }

  async loadHomeLineup() {
    const matchId = this.matchId();

    // 1. Charger le match
    const match = await this.matchesService.getById(matchId);

    // 2. Trouver la formation correspondante
    const formation =
      this.formations.find(f => f.name === match.formation);

    if (formation) {
      this.homeFormation.set(formation);
    }

    // 3. Préparer les slots vides
    const lineup: Record<string, Player | null> = {};

    this.homeFormation().slots.forEach(slot => {
      lineup[slot.key] = null;
    });

    // 4. Charger les match players
    const matchPlayers =
      await this.matchPlayersService.getByMatch(matchId);

    // 5. Associer les joueurs aux slots
    matchPlayers
      .filter(mp => mp.role === 'starter')
      .forEach(mp => {

        const fullPlayer =
          this.players().find(p => p.id === mp.player_id);

        if (fullPlayer && mp.slot_key) {
          lineup[mp.slot_key] = fullPlayer;
        }
      });

    // 6. Update signal
    this.homeLineup.set(lineup);
  }

}

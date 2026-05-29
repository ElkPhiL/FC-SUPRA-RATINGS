import { Component, EventEmitter, Input, Output, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Player } from '../../models/player.model';
import { TeamsService } from '../../services/teams.service';

@Component({
  selector: 'app-player-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './player-card.component.html',
  styleUrls: ['./player-card.component.scss'],
})
export class PlayerCardComponent implements OnInit {

  @Input() player!: Player;
  @Input() showActions = false;

  @Output() delete = new EventEmitter<number>();

  private teamsService = inject(TeamsService);

  playerTeam = signal<any>(null);

  async ngOnInit() {
    // Si le joueur est lié à une équipe, on va chercher l'équipe et son club parent
    if (this.player?.current_team_id) {
      try {
        // Option A: Si ton teamsService possède une méthode qui ramène l'équipe avec son club
        const teamData = await this.teamsService.getById(this.player.current_team_id);
        this.playerTeam.set(teamData);
      } catch (error) {
        console.error("Impossible de charger l'équipe du joueur", error);
      }
    }
  }

  onDelete(id: number) {
    this.delete.emit(id);
  }

  calculateAge(dateOfBirth: string | null): number | null {
    if (!dateOfBirth) {
      return null;
    }
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
}
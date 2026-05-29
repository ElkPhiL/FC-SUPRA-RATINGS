// admin-club-edit.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { ClubFormComponent } from '../../../components/club-form/club-form.component';
import { ClubsService } from '../../../services/clubs.service';
import { TeamsService } from '../../../services/teams.service'; 
import { Club } from '../../../models/club.model';
import { Team, TeamAgeGroup, TeamPayload } from '../../../models/team.model';

@Component({
  selector: 'app-admin-club-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, ClubFormComponent],
  templateUrl: './admin-club-edit.component.html',
  styleUrls: ['./admin-club-edit.component.scss'],
})
export class AdminClubEditComponent implements OnInit {
  club = signal<Club | null>(null);
  teams = signal<Team[]>([]);

  loading = signal(true);
  saving = signal(false);
  message = signal('');
  
  newTeamName = signal('');

  // --- SIGNALS & ÉTATS POUR LA MODALE ---
  isModalOpen = signal(false);
  selectedTeam = signal<Team | null>(null);
  savingTeam = signal(false);
  
  // Objet modifiable lié au formulaire de la modale
  editFormState = {
    name: '',
    gender: 'M' as any,
    level: 'Pro' as any,
    age_group: null as TeamAgeGroup | null,
    logo_url: null as string | null,
    active: true
  };

  id!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clubsService: ClubsService,
    private teamsService: TeamsService
  ) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.load();
  }

  async load() {
    try {
      this.loading.set(true);
      const [clubData, teamsData] = await Promise.all([
        this.clubsService.getById(this.id),
        this.teamsService.getByClubId(this.id)
      ]);
      
      this.club.set(clubData);
      this.teams.set(teamsData);
    } catch {
      this.message.set('Erreur de chargement des données');
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
      this.message.set('Erreur modification club');
    } finally {
      this.saving.set(false);
    }
  }

  // --- GESTION DES ÉQUIPES ---

  async addTeam() {
    if (!this.newTeamName().trim()) return;

    // 1. Récupérer le logo du club parent depuis le signal
    const parentClubLogo = this.club()?.logo_url || null;

    // 2. Construire le payload avec le logo par défaut
    const payload: TeamPayload = {
      club_id: this.id,
      name: this.newTeamName().trim(),
      gender: 'M',
      level: 'Pro',
      age_group: null,
      logo_url: parentClubLogo, // <-- Le logo du club est injecté ici par défaut
      active: true
    };

    try {
      const createdTeam = await this.teamsService.create(payload);
      
      // 3. Mettre à jour l'affichage local
      this.teams.update(prev => [...prev, createdTeam]);
      
      // 4. Reset le champ texte d'ajout rapide
      this.newTeamName.set('');
    } catch {
      this.message.set('Erreur lors de la création de l\'équipe');
    }
  }

  async deleteTeam(teamId: number) {
    if (!confirm('Voulez-vous vraiment supprimer cette équipe ?')) return;

    try {
      await this.teamsService.delete(teamId);
      this.teams.update(prev => prev.filter(t => t.id !== teamId));
    } catch {
      this.message.set('Erreur lors de la suppression de l\'équipe');
    }
  }

  // --- LOGIQUE DE LA MODALE ---

  openEditModal(team: Team) {
    this.selectedTeam.set(team);
    
    // On copie les valeurs actuelles de l'équipe dans l'état du formulaire
    this.editFormState = {
      name: team.name,
      gender: team.gender,
      level: team.level,
      age_group: team.age_group,
      logo_url: team.logo_url,
      active: team.active
    };
    
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.selectedTeam.set(null);
  }

  async saveTeamDetails() {
    const currentTeam = this.selectedTeam();
    if (!currentTeam) return;

    try {
      this.savingTeam.set(true);
      
      // Construction du payload mis à jour
      const updatedPayload: TeamPayload = {
        club_id: currentTeam.club_id,
        name: this.editFormState.name,
        gender: this.editFormState.gender,
        level: this.editFormState.level || null,
        age_group: this.editFormState.age_group || null,
        logo_url: this.editFormState.logo_url || null,
        active: this.editFormState.active
      };

      await this.teamsService.update(currentTeam.id, updatedPayload);

      // Mise à jour de l'affichage local via le signal
      this.teams.update(prev =>
        prev.map(t => t.id === currentTeam.id ? { ...t, ...updatedPayload } : t)
      );

      this.closeModal();
    } catch {
      this.message.set('Erreur lors de la mise à jour des détails de l\'équipe');
    } finally {
      this.savingTeam.set(false);
    }
  }
}
// admin-competition-edit.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { CompetitionFormComponent } from '../../../components/competition-form/competition-form.component';
import { CompetitionsService } from '../../../services/competitions.service';
import { Competition } from '../../../models/competition.model';

@Component({
  selector: 'app-admin-competition-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, CompetitionFormComponent],
  templateUrl: './admin-competition-edit.component.html',
  styleUrls: [],
})
export class AdminCompetitionEditComponent implements OnInit {
  competition = signal<Competition | null>(null);

  loading = signal(true);
  saving = signal(false);
  message = signal('');

  id!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private competitionsService: CompetitionsService,
  ) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.load();
  }

  async load() {
    try {
      this.loading.set(true);
      const [competitionData] = await Promise.all([
        this.competitionsService.getById(this.id),
      ]);
      
      this.competition.set(competitionData);
    } catch {
      this.message.set('Erreur de chargement des données');
    } finally {
      this.loading.set(false);
    }
  }

  async update(payload: any) {
    try {
      this.saving.set(true);
      await this.competitionsService.update(this.id, payload);
      this.message.set('Competition modifié');
      this.router.navigate(['/admin/competitions']);
    } catch {
      this.message.set('Erreur modification competition');
    } finally {
      this.saving.set(false);
    }
  }
}
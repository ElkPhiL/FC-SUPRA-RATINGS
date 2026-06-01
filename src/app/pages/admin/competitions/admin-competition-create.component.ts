import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CompetitionsService } from '../../../services/competitions.service';
import { CompetitionFormComponent } from '../../../components/competition-form/competition-form.component';


@Component({
  selector: 'app-admin-competition-create',
  standalone: true,
  imports: [CompetitionFormComponent],
  templateUrl: './admin-competition-create.component.html',
  styleUrls: ['./admin-competition-create.component.scss'],
})
export class AdminCompetitionCreateComponent {
  loading = signal(false);
  message = signal('');

  constructor(
    private competitionsService: CompetitionsService,
    private router: Router
  ) {}

  async create(payload: any) {
    try {
      this.loading.set(true);

      await this.competitionsService.create(payload);

      this.message.set('Competition créé');
      this.router.navigate(['/admin/competitions']);
    } catch {
      this.message.set('Erreur création');
    } finally {
      this.loading.set(false);
    }
  }
}
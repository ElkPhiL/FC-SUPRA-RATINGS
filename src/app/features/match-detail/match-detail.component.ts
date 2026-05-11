import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SupabaseService } from '../../core/services/supabase.service';
import { Match } from '../admin/matches/models/match.model';

@Component({
  selector: 'app-match-detail',
  imports: [CommonModule],
  templateUrl: './match-detail.component.html',
  styleUrl: './match-detail.component.scss',
})
export class MatchDetailComponent implements OnInit {
  match = signal<Match | null>(null);
  loading = signal(true);
  error = signal('');

  constructor(
    private route: ActivatedRoute,
    private supabaseService: SupabaseService
  ) {}

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
}

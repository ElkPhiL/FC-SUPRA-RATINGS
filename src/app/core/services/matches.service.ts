import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface Match {
  id: number;
  match_date: string | null;
  opponent: string;
  competition: string | null;
  home_away: string | null;
  venue: string | null;
  fc_supra_score: number | null;
  opponent_score: number | null;
  status: string | null;
  created_at: string | null;
}

export type CreateMatchPayload = Omit<Match, 'id' | 'created_at'>;

@Injectable({
  providedIn: 'root',
})
export class MatchesService {
  constructor(private supabaseService: SupabaseService) {}

  async getMatches(): Promise<Match[]> {
    const { data, error } = await this.supabaseService.supabase
      .from('matches')
      .select('*')
      .order('match_date');

    if (error) {
      console.error('Error fetching matches:', error);
      throw error;
    }

    return (data as Match[]) ?? [];
  }

  async createMatch(match: CreateMatchPayload): Promise<Match> {
    const { data, error } = await this.supabaseService.supabase
      .from('matches')
      .insert([match])
      .select()
      .single();

    if (error) {
      console.error('Error creating match:', error);
      throw error;
    }

    return data as Match;
  }
}

import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface Match {
  id: string;
  date: string;
  home_team: string;
  away_team: string;
  home_score?: number;
  away_score?: number;
  status?: string;
}

export type CreateMatchPayload = Omit<Match, 'id'>;

@Injectable({
  providedIn: 'root',
})
export class MatchesService {
  constructor(private supabaseService: SupabaseService) {}

  async getMatches(): Promise<Match[]> {
    const { data, error } = await this.supabaseService.supabase
      .from('matches')
      .select('*')
      .order('date');

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

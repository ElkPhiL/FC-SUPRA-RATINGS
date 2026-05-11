import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Match, MatchPayload } from '../../features/admin/matches/models/match.model';

@Injectable({
  providedIn: 'root',
})
export class MatchesService {
  constructor(private supabaseService: SupabaseService) {}

  async getAll(): Promise<Match[]> {
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

  async create(match: MatchPayload): Promise<Match> {
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

  async getById(id: number): Promise<Match> {
    const { data, error } = await this.supabaseService.supabase
      .from('matches')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching match with id ${id}:`, error);
      throw error;
    }

    return data as Match;
  }

  async update(id: number, match: MatchPayload): Promise<void> {
    const { error } = await this.supabaseService.supabase
      .from('matches')
      .update(match)
      .eq('id', id);

    if (error) {
      console.error(`Error updating match with id ${id}:`, error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    const { error } = await this.supabaseService.supabase
      .from('matches')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting match with id ${id}:`, error);
      throw error;
    }
  }
}

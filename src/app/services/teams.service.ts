import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Team, TeamPayload } from '../models/team.model';

@Injectable({
  providedIn: 'root',
})
export class TeamsService {
  constructor(private supabaseService: SupabaseService) {}

  async getAll(): Promise<Team[]> {
    const { data, error } = await this.supabaseService.supabase
      .from('teams')
      .select('*')

    if (error) {
      console.error('Error fetching teams:', error);
      throw error;
    }

    return (data as Team[]) ?? [];
  }

  async create(team: TeamPayload): Promise<Team> {
    const { data, error } = await this.supabaseService.supabase
      .from('teams')
      .insert([team])
      .select()
      .single();

    if (error) {
      console.error('Error creating team:', error);
      throw error;
    }

    return data as Team;
  }

    async getById(id: number): Promise<Team> {
        const { data, error } = await this.supabaseService.supabase
        .from('teams')
        .select(`
            *,
            club:clubs (
            id,
            name,
            logo_url
            )
        `)
        .eq('id', id)
        .single();

        if (error) {
        console.error(`Error fetching team with id ${id}:`, error);
        throw error;
        }

        return data as Team;
    }

  async getByClubId(clubId: number): Promise<Team[]> {
    const { data, error } = await this.supabaseService.supabase
        .from('teams')
        .select('*')
        .eq('club_id', clubId)
        .order('name', { ascending: true });

    if (error) {
        console.error(`Error fetching teams for club ${clubId}:`, error);
        throw error;
    }

    return (data as Team[]) ?? [];
  }

  async update(id: number, team: TeamPayload): Promise<void> {
    const { error } = await this.supabaseService.supabase
      .from('teams')
      .update(team)
      .eq('id', id);

    if (error) {
      console.error(`Error updating team with id ${id}:`, error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    const { error } = await this.supabaseService.supabase
      .from('teams')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting team with id ${id}:`, error);
      throw error;
    }
  }
}

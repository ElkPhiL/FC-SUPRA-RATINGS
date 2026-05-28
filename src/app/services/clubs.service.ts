import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Club, ClubPayload } from '../models/club.model';

@Injectable({
  providedIn: 'root',
})
export class ClubsService {
  constructor(private supabaseService: SupabaseService) {}

  async getAll(): Promise<Club[]> {
    const { data, error } = await this.supabaseService.supabase
      .from('clubs')
      .select('*')

    if (error) {
      console.error('Error fetching clubs:', error);
      throw error;
    }

    return (data as Club[]) ?? [];
  }

  async create(club: ClubPayload): Promise<Club> {
    const { data, error } = await this.supabaseService.supabase
      .from('clubs')
      .insert([club])
      .select()
      .single();

    if (error) {
      console.error('Error creating club:', error);
      throw error;
    }

    return data as Club;
  }

  async getById(id: number): Promise<Club> {
    const { data, error } = await this.supabaseService.supabase
      .from('clubs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching club with id ${id}:`, error);
      throw error;
    }

    return data as Club;
  }

  async update(id: number, club: ClubPayload): Promise<void> {
    const { error } = await this.supabaseService.supabase
      .from('clubs')
      .update(club)
      .eq('id', id);

    if (error) {
      console.error(`Error updating club with id ${id}:`, error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    const { error } = await this.supabaseService.supabase
      .from('clubs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting club with id ${id}:`, error);
      throw error;
    }
  }
}

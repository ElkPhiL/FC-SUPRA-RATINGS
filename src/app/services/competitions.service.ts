import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Competition, CompetitionPayload } from '../models/competition.model';

@Injectable({
  providedIn: 'root',
})
export class CompetitionsService {
  constructor(private supabaseService: SupabaseService) {}

  async getAll(): Promise<Competition[]> {
    const {data, error} = await this.supabaseService.supabase
      .from('competitions')
      .select('*')

      if (error) {
        console.error('Error fetching competitions:', error);
        throw error;
      }

      return (data as Competition[]) ?? [];
  }
  async create(competition: CompetitionPayload): Promise<Competition> {
    const { data, error } = await this.supabaseService.supabase
      .from('competitions')
      .insert([competition])
      .select()
      .single();

    if (error) {
      console.error('Error creating competition:', error);
      throw error;
    }

    return data as Competition;
  }

  async getById(id: number): Promise<Competition> {
    const { data, error } = await this.supabaseService.supabase
      .from('competitions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching competition with id ${id}:`, error);
      throw error;
    }

    return data as Competition;
  }

  async update(id: number, competition: CompetitionPayload): Promise<void> {
    const { error } = await this.supabaseService.supabase
      .from('competitions')
      .update(competition)
      .eq('id', id);

    if (error) {
      console.error(`Error updating competition with id ${id}:`, error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    const { error } = await this.supabaseService.supabase
      .from('competitions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting competition with id ${id}:`, error);
      throw error;
    }
  }
}
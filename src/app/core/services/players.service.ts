// src/app/core/services/players.service.ts

import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Player, PlayerPayload } from '../../features/admin/players/models/player.model';

@Injectable({
  providedIn: 'root',
})
export class PlayersService {
  constructor(private supabase: SupabaseService) {}

  async getAll(): Promise<Player[]> {
    const { data, error } = await this.supabase.supabase
      .from('players')
      .select('*')
      .order('number');

    if (error) throw error;

    return data as Player[];
  }

  async getById(id: number): Promise<Player> {
    const { data, error } = await this.supabase.supabase
      .from('players')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return data as Player;
  }

  async create(payload: PlayerPayload): Promise<Player> {
    const { data, error } = await this.supabase.supabase
      .from('players')
      .insert(payload)
      .select()
      .single();

    if (error) throw error;

    return data as Player;
  }

  async update(id: number, payload: Partial<PlayerPayload>): Promise<Player> {
    const { data, error } = await this.supabase.supabase
      .from('players')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return data as Player;
  }

  async delete(id: number): Promise<void> {
    const { error } = await this.supabase.supabase
      .from('players')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
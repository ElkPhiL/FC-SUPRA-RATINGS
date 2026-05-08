import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface Player {
  id: string;
  name: string;
  username?: string;
  number: number;
  position?: string;
  active: boolean;
  avatar_url?: string;
}

export type CreatePlayerPayload = Omit<Player, 'id' | 'avatar_url'>;

@Injectable({
  providedIn: 'root',
})
export class PlayersService {
  constructor(private supabaseService: SupabaseService) {}

  async getPlayers(): Promise<Player[]> {
    const { data, error } = await this.supabaseService.supabase
      .from('players')
      .select('*')
      .eq('active', true)
      .order('number');

    if (error) {
      console.error('Error fetching players:', error);
      throw error;
    }

    return (data as Player[]) ?? [];
  }

  async createPlayer(player: CreatePlayerPayload): Promise<Player> {
    const { data, error } = await this.supabaseService.supabase
      .from('players')
      .insert([player])
      .select()
      .single();

    if (error) {
      console.error('Error creating player:', error);
      throw error;
    }

    return data as Player;
  }
}

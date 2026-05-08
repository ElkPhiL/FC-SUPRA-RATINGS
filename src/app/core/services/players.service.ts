import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface Player {
  id: number;
  first_name: string | null;
  last_name: string | null;
  display_name: string;
  number: number;
  position: string | null;
  nationality: string | null;
  photo_url: string | null;
  active: boolean;
  created_at: string | null;
}

export type CreatePlayerPayload = Omit<Player, 'id' | 'created_at'>;

@Injectable({
  providedIn: 'root',
})
export class PlayersService {
  constructor(private supabaseService: SupabaseService) {}

  async getPlayers(): Promise<Player[]> {
    console.log('Tentative de récupération des joueurs...');

    const { data, error } = await this.supabaseService.supabase
      .from('players')
      .select('*')
      .eq('active', true)
      .order('number');

    console.log('Résultat de la requête:', { data, error });

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

import { Injectable } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';

import { PlayerPosition } from '../shared/constants/player.constants';

@Injectable({
  providedIn: 'root',
})
export class PlayerPositionsService {

  constructor(private supabase: SupabaseService) {}

  async createPlayerPositions(
    playerId: number,
    positions: PlayerPosition[]
    ) {

    if (!positions.length) {
        return;
    }

    const rows = positions.map(position => ({
        player_id: playerId,
        position,
    }));

    const { error } =
        await this.supabase.supabase
        .from('player_positions')
        .insert(rows);

    if (error) {
        throw error;
    }
  }

  async updatePlayerPositions(
    playerId: number,
    positions: PlayerPosition[]
    ) {

    await this.supabase.supabase
        .from('player_positions')
        .delete()
        .eq('player_id', playerId);

    await this.createPlayerPositions(
        playerId,
        positions
    );
  }

  async getPlayerPositions(playerId: number) {

    const { data, error } =
      await this.supabase.supabase
        .from('player_positions')
        .select('*')
        .eq('player_id', playerId);

    if (error) {
      throw error;
    }

    return data.map(row => row.position);
  }
}
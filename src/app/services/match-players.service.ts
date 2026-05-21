import { Injectable } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';
import { MatchPlayer, MatchPlayerPayload } from '../models/match-players.model';

@Injectable({
  providedIn: 'root',
})
export class MatchPlayersService {

  constructor(private supabase: SupabaseService) {}

  // =====================================================
  // GET PLAYERS FOR MATCH
  // =====================================================

  async getByMatch(matchId: number): Promise<MatchPlayer[]> {
    const { data, error } = await this.supabase.supabase
      .from('match_players')
      .select('*')
      .eq('match_id', matchId);

    if (error) throw error;

    return data as MatchPlayer[];
  }

  // =====================================================
  // ADD ONE PLAYER TO MATCH
  // =====================================================

  async addPlayer(payload: MatchPlayerPayload): Promise<MatchPlayer> {
    const { data, error } = await this.supabase.supabase
      .from('match_players')
      .insert(payload)
      .select()
      .single();

    if (error) throw error;

    return data as MatchPlayer;
  }

  // =====================================================
  // ADD MANY (LINEUP SAVE - IMPORTANT)
  // =====================================================

  async addMany(payloads: MatchPlayerPayload[]): Promise<MatchPlayer[]> {
    const { data, error } = await this.supabase.supabase
      .from('match_players')
      .insert(payloads)
      .select();

    if (error) throw error;

    return data as MatchPlayer[];
  }

  // =====================================================
  // UPDATE PLAYER IN MATCH
  // =====================================================

  async update(id: number, payload: Partial<MatchPlayerPayload>): Promise<MatchPlayer> {
    const { data, error } = await this.supabase.supabase
      .from('match_players')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return data as MatchPlayer;
  }

  // =====================================================
  // DELETE PLAYER FROM MATCH
  // =====================================================

  async delete(id: number): Promise<void> {
    const { error } = await this.supabase.supabase
      .from('match_players')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // =====================================================
  // CLEAR MATCH (useful when resetting lineup)
  // =====================================================

  async deleteByMatch(matchId: number): Promise<void> {
    const { error } = await this.supabase.supabase
      .from('match_players')
      .delete()
      .eq('match_id', matchId);

    if (error) throw error;
  }
}
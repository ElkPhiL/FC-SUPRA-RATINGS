import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerRatingsService {

  private supabase = inject(SupabaseService).supabase;
  userId = signal<string | null>(null);
  ratings = signal<any[]>([]);

  constructor() {
    this.loadUser();
  }

  async loadUser() {

    const { data, error } = await this.supabase.auth.getUser();

    if (error || !data.user) {
      return;
    }

    this.userId.set(data.user.id);
  }

  async loadRatings(matchId: number) {

    const { data, error } = await this.supabase
      .from('player_ratings')
      .select(`
        *,
        match_players!inner (
          id,
          match_id,
          player_id
        )
      `)
      .eq('match_players.match_id', matchId);

    if (error) {
      console.error(error);
      return;
    }

    this.ratings.set(data ?? []);
  }

  async ratePlayer(
    matchPlayerId: number,
    rating: number
  ) {

    const { data: userData, error: userError } = await this.supabase.auth.getUser();

    if (userError || !userData?.user) {
      console.error('No user logged in');
      return;
    }

    const userId = userData.user.id;

    const { error } = await this.supabase
      .from('player_ratings')
      .upsert(
        {
          match_player_id: matchPlayerId,
          user_id: userId,
          rating
        },
        {
          onConflict: 'user_id,match_player_id'
        }
      )

    if (error) {
      console.error(error);
    }
  }

  getAverageRating(matchPlayerId: number): number {

    const ratings = this.ratings()
      .filter(r => r.match_player_id === matchPlayerId);

    if (!ratings.length) {
      return 0;
    }

    const avg =
      ratings.reduce((sum, r) => sum + r.rating, 0)
      / ratings.length;

    return Number(avg.toFixed(1));
  }

  getRatingCount(matchPlayerId: number): number {

    return this.ratings()
      .filter(r => r.match_player_id === matchPlayerId)
      .length;
  }

  getUserRating(matchPlayerId: number): number | null {

    const userId = this.userId();

    if (!userId) {
      return null;
    }

    const rating = this.ratings()
      .find(r =>
        r.match_player_id === matchPlayerId &&
        r.user_id === userId
      );

    return rating?.rating ?? null;
  }

}
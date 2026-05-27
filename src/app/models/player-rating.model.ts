export interface PlayerRating {
  id?: number;

  match_player_id: number;

  user_id: string;

  rating: number;

  created_at?: string;
  updated_at?: string;
}
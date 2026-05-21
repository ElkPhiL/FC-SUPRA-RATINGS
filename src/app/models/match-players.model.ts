export interface MatchPlayer {
  id: number;
  match_id: number;
  player_id: number;
  role: string;
  position_played: string | null;
  created_at: string | null;
  is_captain: boolean;
}

export type MatchPlayerPayload = Omit<MatchPlayer, 'id' | 'created_at'>;
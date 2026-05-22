export interface MatchPlayer {
  id: number;
  match_id: number;
  player_id: number;
  role: string;
  position_played: string | null | undefined;
  created_at: string | null;
  is_captain: boolean;
  slot_key: string | null;
}

export type MatchPlayerPayload = Omit<MatchPlayer, 'id' | 'created_at'>;
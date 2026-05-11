export interface Match {
  id: number;
  match_date: string | null;
  opponent: string;
  competition: string | null;
  home_away: string | null;
  venue: string | null;
  fc_supra_score: number | null;
  opponent_score: number | null;
  status: string | null;
  created_at: string | null;
}

export type MatchPayload = Omit<Match, 'id' | 'created_at'>;
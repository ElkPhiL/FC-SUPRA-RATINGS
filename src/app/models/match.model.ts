export interface Match {
  id: number;
  match_date: string | null;
  opponent: string;
  competition: string | null;
  venue: string | null;
  home_score: number | null;
  away_score: number | null;
  status: string | null;
  created_at: string | null;
  home_formation: string | null;
  away_formation: string | null;
}

export type MatchPayload = Omit<Match, 'id' | 'created_at'>;
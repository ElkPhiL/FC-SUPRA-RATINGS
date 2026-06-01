export interface Match {
  id: number;
  match_date: string | null;
  competition_id: number | null;
  venue: string | null;
  home_team_id: number;
  away_team_id: number;
  home_score: number | null;
  away_score: number | null;
  home_formation: string | null;
  away_formation: string | null;
  status: string | null;
  created_at: string | null;

  home_team?: {
    id: number;
    name: string;
    logo_url: string | null;
  };

  away_team?: {
    id: number;
    name: string;
    logo_url: string | null;
  };

  competition?: {
    id: number;
    name: string;
    logo_url: string | null;
  };
}

export type MatchPayload = Omit<Match, 'id' | 'created_at'>;
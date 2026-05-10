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

export interface PlayerPayload {
  first_name: string | null;
  last_name: string | null;
  display_name: string;
  number: number;
  position: string | null;
  nationality: string | null;
  photo_url: string | null;
  active: boolean;
}
import { PlayerPosition } from "../shared/constants/player.constants";
// Importe tes interfaces Team et Club si elles sont dans des fichiers séparés
// import { Team } from "./team.model"; 

export interface Player {
  id: number;
  first_name: string | null;
  last_name: string | null;
  display_name: string;
  number: number;
  best_position: PlayerPosition | null;
  positions: PlayerPosition[];
  nationality: string | null;
  photo_url: string | null;
  active: boolean;
  created_at: string | null;
  date_of_birth: string | null;
  best_foot: 'left' | 'right' | null;
  height_cm: number | null;
  weight_kg: number | null;
  current_team_id: number | null;

  team?: {
    id: number;
    name: string;
    logo_url: string | null;
    club?: {
      id: number;
      name: string;
      logo_url: string | null;
    };
  } | null;
}

export type PlayerPayload = Omit<Player, 'id' | 'created_at' | 'team'>;

export type PlayerFormPayload = PlayerPayload & {
  imageFile?: File | null;
};
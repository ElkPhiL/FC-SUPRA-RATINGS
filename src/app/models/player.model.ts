import { PlayerPosition } from "../shared/constants/player.constants";

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
}

export type PlayerPayload = Omit<Player, 'id' | 'created_at'>;

export type PlayerFormPayload = PlayerPayload & {
  imageFile?: File | null;
};
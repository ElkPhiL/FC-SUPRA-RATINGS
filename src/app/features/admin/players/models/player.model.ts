import { PlayerPosition } from "../../../../shared/constants/player.constants";

export interface Player {
  id: number;
  first_name: string | null;
  last_name: string | null;
  display_name: string;
  number: number;
  position: PlayerPosition | null;
  nationality: string | null;
  photo_url: string | null;
  active: boolean;
  created_at: string | null;
}

export type PlayerPayload = Omit<Player, 'id' | 'created_at'>;

export type PlayerFormPayload = PlayerPayload & {
  imageFile?: File | null;
};
import { PlayerPosition } from "../shared/constants/player.constants";

export interface FormationSlot {
  key: string;
  label: PlayerPosition;
  x: number;
  y: number;
}

export interface Formation {
  name: string;
  slots: FormationSlot[];
}
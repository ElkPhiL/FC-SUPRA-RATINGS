export const PLAYER_RULES = {
  MIN_NUMBER: 1,
  MAX_NUMBER: 99,
};

export const PLAYER_POSITIONS = [
  undefined,
  'GK',
  'LWB',
  'RWB',
  'LB',
  'RB',
  'CB',
  'CDM',
  'CM',
  'LM',
  'RM',
  'CAM',
  'LW',
  'RW',
  'ST'
] as const;

export type PlayerPosition = typeof PLAYER_POSITIONS[number];
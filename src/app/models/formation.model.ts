export interface FormationSlot {
  key: string;
  label: string;
  x: number;
  y: number;
}

export interface Formation {
  name: string;
  slots: FormationSlot[];
}
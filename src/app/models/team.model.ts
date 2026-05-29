export interface Team {
    id: number;
    club_id: number;
    name: string;
    gender: 'M' | 'F' | 'X';
    level: 'Pro' | 'Semipro' | 'Amateur' | null;
    age_group: TeamAgeGroup | null;
    logo_url: string | null;
    active: boolean;
    created_at: string | null;
}

export type TeamPayload = Omit<Team, 'id' | 'created_at'>;

export enum TeamAgeGroup { 
    senior,
    U23,
    U22,
    U21,
    U20,
    U19,
    U18,
    U17,
    U16,
    U15,
    U14
}
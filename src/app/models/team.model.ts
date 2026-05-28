export interface Team {
    id: number;
    club_id: number;
    name: string;
    gender: Gender;
    level: TeamLevel | null;
    age_group: TeamAgeGroup | null;
    logo_url: string | null;
    active: boolean;
}

export enum Gender {
    male,
    female
}

export enum TeamLevel {
    pro,
    semipro,
    amateur
}

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
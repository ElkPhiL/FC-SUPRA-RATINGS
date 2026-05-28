export interface Club {
    id: number;
    name: string;
    short_name: string;
    slug: string;
    logo_url: string | null;
    city: string | null;
    country: string | null;
    founded_year: number | null;
    colors: ClubColors | null;
    created_at: string | null;
}

export type ClubPayload = Omit<Club, 'id' | 'created_at'>;

export interface ClubColors {
  primary: string;
  secondary: string;
  alternate?: string;
}
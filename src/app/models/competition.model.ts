export interface Competition {
    id: number;
    name: string;
    slug: string;
    country: string | null;
    level: string | null;
    logo_url: string | null;
    created_at: string | null;
}

export type CompetitionPayload = Omit<Competition, 'id' | 'created_at'>;
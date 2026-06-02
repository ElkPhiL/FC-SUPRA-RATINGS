export type CompetitionType = 'league' | 'cup' | 'super_cup' | 'friendly';
export type CompetitionScope = 'provincial' | 'national' | 'continental' | 'international';
export type CompetitionEntityType = 'clubs' | 'nations';
export type CompetitionGender = 'men' | 'women' | 'mixed';

export interface Competition {
    id: number;
    name: string;               // Ex: "Ligue 1 Arkema", "UEFA Champions League"
    slug: string;               // Ex: "ligue-1-arkema"
    logo_url: string | null;
    created_at: string | null;
    
    type: CompetitionType;          // Format : Championnat, Coupe, Supercoupe...
    scope: CompetitionScope;        // Portée géographique : Pays, Continent, Monde
    entity_type: CompetitionEntityType; // Qui joue : Des clubs (PSG, Real) ou des pays (France, Brésil)
    gender: CompetitionGender;      // Genre de la compétition : Homme, Femme, Mixte
    
    geographic_zone: string | null; // Ex: "FR" (National), "UEFA" ou "Europe" (Continental), null ou "World" (International)
    level: number | null;       // Niveau hiérarchique (ex: 1 pour D1/Ligue 1, 2 pour D2/Ligue 2). 
}

export type CompetitionPayload = Omit<Competition, 'id' | 'created_at'>;
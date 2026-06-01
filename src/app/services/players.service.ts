// players.service.ts

import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

import {
  Player,
  PlayerPayload,
  PlayerFormPayload
} from '../models/player.model';
import { PlayerPositionsService } from './player-positions.service';
import { PlayerPosition } from '../shared/constants/player.constants';

@Injectable({
  providedIn: 'root',
})
export class PlayersService {

  constructor(private supabase: SupabaseService, private playerPositionsService: PlayerPositionsService) {}

  // =====================================================
  // GET
  // =====================================================

  async getById(id: number): Promise<Player> {
    const { data, error } = await this.supabase.supabase
      .from('players')
      .select(`
        *,
        team:teams (
          id,
          name,
          logo_url,
          club:clubs (
            id,
            name,
            logo_url
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    return data as Player;
  }

  async getAll() {
    const { data, error } = await this.supabase.supabase
      .from('players')
      .select(`
        *,
        player_positions (
          position
        ),
        team:teams (
          id,
          name,
          logo_url,
          club:clubs (
            id,
            name,
            logo_url
          )
        )
      `);

    if (error) {
      throw error;
    }

    return data.map(player => {
      // 1. Extraction et tri des positions (ton code existant corrigé pour la parenthèse du .map)
      const sortedPositions = (player.player_positions?.map((p: any) => p.position) || [])
        .sort((a: PlayerPosition, b: PlayerPosition) => {
          if (a === player.best_position) return -1;
          if (b === player.best_position) return 1;
          return 0;
        });

      // 2. On retourne l'objet complet incluant les positions aplaties ET les relations team/club
      return {
        ...player,
        positions: sortedPositions,
        team: player.team ?? null // Évite les soucis de typage si le joueur n'a pas d'équipe
      };
    });
  }

  async getPlayersByTeam(teamId: number) {
    const { data, error } = await this.supabase.supabase
      .from('players')
      .select(`
        *,
        player_positions (
          position
        ),
        team:teams (
          id,
          name,
          logo_url,
          club:clubs (
            id,
            name,
            logo_url
          )
        )
      `)
      .eq('current_team_id', teamId); // 🎯 Le filtre magique !

    if (error) throw error;

    return data.map(player => {
      const sortedPositions = (player.player_positions?.map((p: any) => p.position) || [])
        .sort((a: any, b: any) => {
          if (a === player.best_position) return -1;
          if (b === player.best_position) return 1;
          return 0;
        });

      return {
        ...player,
        positions: sortedPositions,
        team: player.team ?? null
      };
    });
  }

  // =====================================================
  // CREATE
  // =====================================================

  async create(payload: PlayerFormPayload): Promise<Player> {

    console.log('PlayersService.create received:', payload);

    let photoUrl = payload.photo_url ?? null;

    if (payload.imageFile) {
      console.log('Uploading image:', payload.imageFile);
      photoUrl = await this.supabase.uploadPlayerImage(payload.imageFile);
      console.log('Image uploaded, photoUrl:', photoUrl);
    }

    const playerInsert = {
      first_name: payload.first_name,
      last_name: payload.last_name,
      display_name: payload.display_name,
      number: payload.number,
      best_position: payload.best_position,
      nationality: payload.nationality,
      photo_url: photoUrl,
      active: payload.active,
      date_of_birth: payload.date_of_birth,
      best_foot: payload.best_foot,
      height_cm: payload.height_cm,
      weight_kg: payload.weight_kg,
      current_team_id: payload.current_team_id
    };

    const { data, error } = await this.supabase.supabase
      .from('players')
      .insert(playerInsert)
      .select()
      .single();

    if (error) throw error;

    await this.playerPositionsService
    .createPlayerPositions(
      data.id,
      payload.positions
    );

    return data as Player;
  }

  // =====================================================
  // UPDATE
  // =====================================================

  async update(id: number, payload: PlayerFormPayload): Promise<Player> {

    const current = await this.getById(id);

    let photoUrl = current.photo_url;

    if (payload.imageFile) {

      if (current.photo_url) {
        await this.supabase.deletePlayerImage(current.photo_url);
      }

      photoUrl = await this.supabase.uploadPlayerImage(payload.imageFile);
    }

    const playerUpdate: Partial<PlayerPayload> = {
      first_name: payload.first_name,
      last_name: payload.last_name,
      display_name: payload.display_name,
      number: payload.number,
      best_position: payload.best_position,
      nationality: payload.nationality,
      photo_url: photoUrl,
      active: payload.active,
      date_of_birth: payload.date_of_birth,
      best_foot: payload.best_foot,
      height_cm: payload.height_cm,
      weight_kg: payload.weight_kg,
      current_team_id: payload.current_team_id
    };

    const { data, error } = await this.supabase.supabase
      .from('players')
      .update(playerUpdate)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    await this.playerPositionsService
    .updatePlayerPositions(
      data.id,
      payload.positions
    );

    return data as Player;
  }

  // =====================================================
  // DELETE
  // =====================================================

  async delete(id: number): Promise<void> {

    const current = await this.getById(id);

    if (current.photo_url) {
      await this.supabase.deletePlayerImage(current.photo_url);
    }

    const { error } = await this.supabase.supabase
      .from('players')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
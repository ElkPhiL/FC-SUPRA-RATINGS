// players.service.ts

import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

import {
  Player,
  PlayerPayload,
  PlayerFormPayload
} from '../models/player.model';

@Injectable({
  providedIn: 'root',
})
export class PlayersService {

  constructor(private supabase: SupabaseService) {}

  // =====================================================
  // GET
  // =====================================================

  async getAll(): Promise<Player[]> {
    const { data, error } = await this.supabase.supabase
      .from('players')
      .select('*')
      .order('number');

    if (error) throw error;

    return data as Player[];
  }

  async getById(id: number): Promise<Player> {
    const { data, error } = await this.supabase.supabase
      .from('players')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return data as Player;
  }

  async getActive(): Promise<Player[]> {
    const { data, error } = await this.supabase.supabase
      .from('players')
      .select('*')
      .eq('active', true)
      .order('number');

    if (error) throw error;

    return data as Player[];
  }

  async getNonActive(): Promise<Player[]> {
    const { data, error } = await this.supabase.supabase
      .from('players')
      .select('*')
      .eq('active', false)
      .order('number');

    if (error) throw error;

    return data as Player[];
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

    const dbPayload: PlayerPayload = {
      first_name: payload.first_name,
      last_name: payload.last_name,
      display_name: payload.display_name,
      number: payload.number,
      position: payload.position,
      nationality: payload.nationality,
      photo_url: photoUrl,
      active: payload.active
    };

    const { data, error } = await this.supabase.supabase
      .from('players')
      .insert(dbPayload)
      .select()
      .single();

    if (error) throw error;

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

    const dbPayload: Partial<PlayerPayload> = {
      first_name: payload.first_name,
      last_name: payload.last_name,
      display_name: payload.display_name,
      number: payload.number,
      position: payload.position,
      nationality: payload.nationality,
      photo_url: photoUrl,
      active: payload.active
    };

    const { data, error } = await this.supabase.supabase
      .from('players')
      .update(dbPayload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

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
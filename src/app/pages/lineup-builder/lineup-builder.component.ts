import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Player } from '../../models/player.model';
import { PlayersService } from '../../services/players.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FORMATIONS } from '../../shared/constants/formations';
import { PlayerOnPitch } from '../../components/player-on-pitch/player-on-pitch.component';

@Component({
    selector: 'app-lineup-builder',
    standalone: true,
    imports: [CommonModule, DragDropModule, PlayerOnPitch],
    templateUrl: './lineup-builder.component.html',
    styleUrls: ['./lineup-builder.component.scss'],
})

export class LineupBuilderComponent {
    players = signal<Player[]>([]);
    loading = signal(true);
    message = signal('');

    formations = FORMATIONS;
    selectedFormation = signal(this.formations[0]);

    lineup = signal<Record<string, Player | null>>({});
    previewingSlot = signal<string | null>(null);
    previewPlayer = signal<Player | null>(null);

    constructor(private playersService: PlayersService) {
        this.loadPlayers();
        this.resetLineup();
    }

    async loadPlayers() {
        this.loading.set(true);
        this.message.set('');

        try {
            const players = await this.playersService.getActive();
            this.players.set(players);

            if (!players.length) {
            this.message.set('Aucun joueur actif trouvé.');
            }
        } catch (error: any) {
            console.error('Erreur lors du chargement des joueurs', error);
            console.error('Détails de l\'erreur:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
            });
            this.message.set(`Erreur de chargement: ${error.message || 'Erreur inconnue'}`);
        } finally {
            this.loading.set(false);
        }
    }

    resetLineup() {
        const obj: any = {};

        this.selectedFormation().slots.forEach(slot => {
            obj[slot.key] = null;
        });

        this.lineup.set(obj);
    }

    isPlayerUsed(player: Player): boolean {
        return Object.values(this.lineup()).some(p => p?.id === player.id);
    }

    dropPlayer(event: any, slotKey: string) {
        const player = event.item.data as Player;
        const current = { ...this.lineup() };

        const fromSlot = this.findPlayerSlot(player.id);

        if (fromSlot) {
            // joueur vient du terrain
            const targetPlayer = current[slotKey];

            if (targetPlayer) {
            current[fromSlot] = targetPlayer; // swap
            } else {
            current[fromSlot] = null;
            }
        }

        current[slotKey] = player;

        this.lineup.set(current);
        this.clearPreview();
    }

    previewSlot(event: any, slotKey: string) {
        this.previewPlayer.set(event.item.data);
        this.previewingSlot.set(slotKey);
    }

    clearPreview() {
        this.previewPlayer.set(null);
        this.previewingSlot.set(null);
    }

    changeFormation(event:any) {
        const name = event.target.value;

        const formation = this.formations.find(f => f.name === name);

        if (!formation) return;

        this.selectedFormation.set(formation);
    }

    slotIds() {
        return this.selectedFormation().slots.map(s => s.key);
    }

    allDropLists() {
        return ['playersList', ...this.slotIds()];
    }

    deleteFromSlot(slotKey: string) {
        const current = { ...this.lineup() };
        current[slotKey] = null;
        this.lineup.set(current);
    }

    findPlayerSlot(playerId: number): string | null {
        for (const [slot, player] of Object.entries(this.lineup())) {
            if (player?.id === playerId) return slot;
        }
        return null;
    }
}
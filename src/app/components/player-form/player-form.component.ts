import { Component, EventEmitter, Input, Output, OnChanges, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Player } from '../../models/player.model';
import { PLAYER_POSITIONS, PlayerPosition } from '../../shared/constants/player.constants';
import { PositionPickerComponent } from '../position-picker/position-picker.component';
import { PlayerCardComponent } from '../player-card/player-card.component';

@Component({
  selector: 'app-player-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PositionPickerComponent, PlayerCardComponent],
  templateUrl: './player-form.component.html',
  styleUrls: ['./player-form.component.scss'],
})
export class PlayerFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() player!: Player;
  @Input() loading = false;

  @Output() submitForm = new EventEmitter<any>();

  form: FormGroup;
  positions = PLAYER_POSITIONS;
  
  // Objet qui alimente directement la carte de preview
  playerPreview!: Player;

  selectedFile: File | null = null;
  dragActive = false;
  
  // Pour éviter les fuites de mémoire avec valueChanges
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      first_name: [''],
      last_name: [''],
      display_name: ['', Validators.required],
      number: [null, [Validators.required, Validators.min(1), Validators.max(99)]],
      best_position: [''],
      positions: [[]],
      nationality: [''],
      photo_url: [''],
      active: [true],
      date_of_birth: [''],
      best_foot: [''],
      height_cm: [null, [Validators.min(0)]],
      weight_kg: [null, [Validators.min(0)]],
    });
  }

  ngOnInit() {
    // Initialise l'objet de preview par défaut
    this.updatePreview(this.form.value);

    // ⚡ LA MAGIE : Écoute en temps réel les changements des inputs du formulaire
    this.form.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(formValues => {
        this.updatePreview(formValues);
      });
  }

  ngOnChanges() {
    if (this.player) {
      this.form.patchValue(this.player, { emitEvent: false });
      // Force la mise à jour de l'aperçu avec les données du joueur reçues
      this.updatePreview(this.form.value);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Fusionne les valeurs actuelles du formulaire avec l'état d'origine du joueur
   */
  private updatePreview(formValues: any) {
    this.playerPreview = {
      ...this.player,       // Garde l'ID ou autres propriétés hors formulaire
      ...formValues,        // Écrase avec les saisies en cours (nom, prénom, numéro, etc.)
      // Si une nouvelle photo locale est sélectionnée, on l'utilise, sinon on garde l'ancienne
      photo_url: formValues.photo_url || (this.player?.photo_url ?? '')
    };
  }

  onFileSelected(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      this.handleFile(file);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.dragActive = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.dragActive = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.dragActive = false;
    const file = event.dataTransfer?.files?.[0];
    if (file) {
      this.handleFile(file);
    }
  }

  handleFile(file: File) {
    if (!file.type.startsWith('image/')) return;

    this.selectedFile = file;

    // Convertit l'image locale en base64 pour que la balise <img> de ta carte puisse l'afficher instantanément
    const reader = new FileReader();
    reader.onload = () => {
      const base64Image = reader.result as string;
      
      // On pousse la string base64 dans le control 'photo_url' du formulaire.
      // Cela va automatiquement déclencher le valueChanges et mettre à jour le playerPreview !
      this.form.patchValue({ photo_url: base64Image });
    };
    reader.readAsDataURL(file);
  }

  onFavoritePositionChange(position: PlayerPosition | null) {
    this.form.patchValue({ best_position: position ?? '' });
  }

  onPositionsSelectedChange(positions: PlayerPosition[]) {
    this.form.patchValue({ positions: positions });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Avant d'envoyer le payload au parent, on peut nettoyer le photo_url 
    // si c'est du base64 pour éviter de surcharger si ton backend préfère recevoir le `imageFile`.
    const formValueRaw = { ...this.form.value };
    if (this.selectedFile) {
      formValueRaw.photo_url = this.player?.photo_url || ''; // Optionnel: reset à l'ancienne URL si le serveur gère l'upload
    }

    const payload = {
      ...formValueRaw,
      imageFile: this.selectedFile
    };

    this.submitForm.emit(payload);
  }
}
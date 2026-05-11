import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { Player } from '../models/player.model';
import { PLAYER_POSITIONS } from '../../../../shared/constants/player.constants';

@Component({
  selector: 'app-player-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './player-form.component.html',
  styleUrls: ['./player-form.component.scss'],
})
export class PlayerFormComponent implements OnChanges {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() player?: Player | null;
  @Input() loading = false;

  @Output() submitForm = new EventEmitter<any>();

  form: FormGroup;
  positions = PLAYER_POSITIONS;

  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  dragActive = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      first_name: [''],
      last_name: [''],
      display_name: ['', Validators.required],
      number: [null, [Validators.required, Validators.min(1), Validators.max(99)]],
      position: [''],
      nationality: [''],
      photo_url: [''],
      active: [true],
    });
  }

  ngOnChanges() {
    if (this.player) {
      this.form.patchValue(this.player);

      if (this.player.photo_url) {
        this.imagePreview = this.player.photo_url;
      }
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files?.[0];
    console.log('File selected:', file);
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
    this.dragActive = false;

    const file = event.dataTransfer?.files?.[0];
    if (file) {
      this.handleFile(file);
    }
  }

  handleFile(file: File) {
    console.log('Handling file:', file.name, file.type, file.size);
    if (!file.type.startsWith('image/')) {
      console.log('Not an image, skipping');
      return;
    }

    this.selectedFile = file;
    console.log('Selected file set:', this.selectedFile);

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
      console.log('Image preview loaded');
    };
    reader.readAsDataURL(file);
  }

  removeImage() {
    this.selectedFile = null;
    this.imagePreview = null;
    this.form.patchValue({ photo_url: '' });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.form.value,
      imageFile: this.selectedFile
    };

    console.log('Player Form Submit:', {
      formValue: this.form.value,
      selectedFile: this.selectedFile,
      payload: payload
    });

    this.submitForm.emit(payload);
  }
}
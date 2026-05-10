import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { Player } from '../models/player.model';

@Component({
  selector: 'app-player-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './player-form.component.html',
})
export class PlayerFormComponent implements OnChanges {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() player?: Player | null;
  @Input() loading = false;

  @Output() submitForm = new EventEmitter<any>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      first_name: [''],
      last_name: [''],
      display_name: ['', Validators.required],
      number: [null, [Validators.required, Validators.min(1)]],
      position: [''],
      nationality: [''],
      photo_url: [''],
      active: [true],
    });
  }

  ngOnChanges() {
    if (this.player) {
      this.form.patchValue(this.player);
    }
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitForm.emit(this.form.value);
  }
}
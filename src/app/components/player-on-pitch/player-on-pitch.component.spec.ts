import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerOnPitch } from './player-on-pitch.component';

describe('PlayerOnPitch', () => {
  let component: PlayerOnPitch;
  let fixture: ComponentFixture<PlayerOnPitch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerOnPitch],
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerOnPitch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

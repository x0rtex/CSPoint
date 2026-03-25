import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerCreateComponent } from './player-create';

describe('PlayerCreate', () => {
  let component: PlayerCreateComponent;
  let fixture: ComponentFixture<PlayerCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerCreateComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

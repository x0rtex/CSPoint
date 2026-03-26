import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerDetailComponent } from './player-detail';
import { RouterTestingModule } from '@angular/router/testing';

describe('PlayerDetailComponent', () => {
  let component: PlayerDetailComponent;
  let fixture: ComponentFixture<PlayerDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerDetailComponent, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerDetailComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

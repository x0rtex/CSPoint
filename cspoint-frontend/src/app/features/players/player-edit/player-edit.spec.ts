import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerEditComponent } from './player-edit';
import { RouterTestingModule } from '@angular/router/testing';

describe('PlayerEdit', () => {
  let component: PlayerEditComponent;
  let fixture: ComponentFixture<PlayerEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerEditComponent, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerEditComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

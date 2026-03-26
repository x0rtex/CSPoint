import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeamDetailComponent } from './team-detail';
import { RouterTestingModule } from '@angular/router/testing';

describe('TeamDetailComponent', () => {
  let component: TeamDetailComponent;
  let fixture: ComponentFixture<TeamDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamDetailComponent, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamDetailComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

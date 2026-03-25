import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamEditComponent } from './team-edit';

describe('TeamEditComponent', () => {
  let component: TeamEditComponent;
  let fixture: ComponentFixture<TeamEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamEditComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamCreateComponent } from './team-create';

describe('TeamCreate', () => {
  let component: TeamCreateComponent;
  let fixture: ComponentFixture<TeamCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamCreateComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchFormComponent } from './match-form';

describe('MatchForm', () => {
  let component: MatchFormComponent;
  let fixture: ComponentFixture<MatchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MatchFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchCreateComponent } from './match-create';

describe('MatchCreate', () => {
  let component: MatchCreateComponent;
  let fixture: ComponentFixture<MatchCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchCreateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MatchCreateComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

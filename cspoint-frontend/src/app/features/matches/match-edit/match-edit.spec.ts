import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchEditComponent } from './match-edit';

describe('MatchEdit', () => {
  let component: MatchEditComponent;
  let fixture: ComponentFixture<MatchEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MatchEditComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

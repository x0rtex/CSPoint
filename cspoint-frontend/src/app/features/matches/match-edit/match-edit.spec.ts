import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatchEditComponent } from './match-edit';
import { RouterTestingModule } from '@angular/router/testing';

describe('MatchEdit', () => {
  let component: MatchEditComponent;
  let fixture: ComponentFixture<MatchEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchEditComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MatchEditComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

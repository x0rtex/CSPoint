import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatchDetailComponent } from './match-detail';
import { RouterTestingModule } from '@angular/router/testing';

describe('MatchDetail', () => {
  let component: MatchDetailComponent;
  let fixture: ComponentFixture<MatchDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchDetailComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MatchDetailComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

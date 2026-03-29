import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatchListComponent } from './match-list';
import { RouterTestingModule } from '@angular/router/testing';

describe('MatchListComponent', () => {
  let component: MatchListComponent;
  let fixture: ComponentFixture<MatchListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchListComponent, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

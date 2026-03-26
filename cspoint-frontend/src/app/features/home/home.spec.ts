import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HomeComponent } from './home';
import { NewsService } from '../news/news.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        {
          provide: NewsService,
          useValue: {
            getHltvNews: () =>
              of([
                {
                  title: 'HLTV News',
                  link: 'https://www.hltv.org/news/1/test',
                  date: 'Thu, 01 Jan 2026 00:00:00 GMT',
                  imageUrl: 'https://placehold.co/640x360/png?text=HLTV+News',
                  description: 'Sample description',
                },
              ]),
          },
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders HLTV news items', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('HLTV News');
    expect(compiled.textContent).toContain('Read on HLTV');
  });
});

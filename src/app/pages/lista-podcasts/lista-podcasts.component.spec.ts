import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPodcastsComponent } from './lista-podcasts.component';

describe('ListaPodcastsComponent', () => {
  let component: ListaPodcastsComponent;
  let fixture: ComponentFixture<ListaPodcastsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaPodcastsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaPodcastsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPodcastComponent } from './lista_podcast.component';

describe('ListaPodcastComponent', () => {
  let component: ListaPodcastComponent;
  let fixture: ComponentFixture<ListaPodcastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaPodcastComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaPodcastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarPodcastsComponent } from './gestionar-podcasts.component';

describe('GestionarPodcastsComponent', () => {
  let component: GestionarPodcastsComponent;
  let fixture: ComponentFixture<GestionarPodcastsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarPodcastsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionarPodcastsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

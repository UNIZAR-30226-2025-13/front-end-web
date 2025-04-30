import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarPodcastersComponent } from './gestionar-podcasters.component';

describe('GestionarPodcastersComponent', () => {
  let component: GestionarPodcastersComponent;
  let fixture: ComponentFixture<GestionarPodcastersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarPodcastersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionarPodcastersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

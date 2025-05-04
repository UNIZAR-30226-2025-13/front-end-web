import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarPodcastComponent } from './editar-podcast.component';

describe('EditarPodcastComponent', () => {
  let component: EditarPodcastComponent;
  let fixture: ComponentFixture<EditarPodcastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarPodcastComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarPodcastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

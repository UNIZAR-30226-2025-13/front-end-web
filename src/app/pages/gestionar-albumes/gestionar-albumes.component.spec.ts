import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarAlbumesComponent } from './gestionar-albumes.component';

describe('GestionarAlbumesComponent', () => {
  let component: GestionarAlbumesComponent;
  let fixture: ComponentFixture<GestionarAlbumesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarAlbumesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionarAlbumesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

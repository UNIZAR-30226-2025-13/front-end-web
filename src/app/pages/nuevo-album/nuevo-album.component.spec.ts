import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoAlbumComponent } from './nuevo-album.component';

describe('NuevoAlbumComponent', () => {
  let component: NuevoAlbumComponent;
  let fixture: ComponentFixture<NuevoAlbumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevoAlbumComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevoAlbumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

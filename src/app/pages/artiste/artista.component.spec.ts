import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistaComponent } from './artista.component';

describe('ArtisteComponent', () => {
  let component: ArtistaComponent;
  let fixture: ComponentFixture<ArtistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtistaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArtistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
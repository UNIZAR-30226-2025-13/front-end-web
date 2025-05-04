import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarCancionesComponent } from './gestionar-canciones.component';

describe('GestionarCancionesComponent', () => {
  let component: GestionarCancionesComponent;
  let fixture: ComponentFixture<GestionarCancionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarCancionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionarCancionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

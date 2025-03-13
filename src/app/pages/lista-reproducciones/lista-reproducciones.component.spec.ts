import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaReproduccionesComponent } from './lista-reproducciones.component';

describe('ListaReproduccionesComponent', () => {
  let component: ListaReproduccionesComponent;
  let fixture: ComponentFixture<ListaReproduccionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaReproduccionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaReproduccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

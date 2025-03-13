import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaReproducionesComponent } from './lista-reproduciones.component';

describe('ListaReproducionesComponent', () => {
  let component: ListaReproducionesComponent;
  let fixture: ComponentFixture<ListaReproducionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaReproducionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaReproducionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoCancionComponent } from './nuevo-cancion.component';

describe('NuevoCancionComponent', () => {
  let component: NuevoCancionComponent;
  let fixture: ComponentFixture<NuevoCancionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevoCancionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevoCancionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

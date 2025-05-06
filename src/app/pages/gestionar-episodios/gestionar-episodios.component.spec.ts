import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarEpisodiosComponent } from './gestionar-episodios.component';

describe('GestionarEpisodiosComponent', () => {
  let component: GestionarEpisodiosComponent;
  let fixture: ComponentFixture<GestionarEpisodiosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarEpisodiosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionarEpisodiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

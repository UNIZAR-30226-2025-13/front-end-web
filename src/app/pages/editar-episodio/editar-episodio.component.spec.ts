import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarEpisodioComponent } from './editar-episodio.component';

describe('EditarEpisodioComponent', () => {
  let component: EditarEpisodioComponent;
  let fixture: ComponentFixture<EditarEpisodioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarEpisodioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarEpisodioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

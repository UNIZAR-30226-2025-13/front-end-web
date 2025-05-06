import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoEpisodioComponent } from './nuevo-episodio.component';

describe('NuevoEpisodioComponent', () => {
  let component: NuevoEpisodioComponent;
  let fixture: ComponentFixture<NuevoEpisodioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevoEpisodioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevoEpisodioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

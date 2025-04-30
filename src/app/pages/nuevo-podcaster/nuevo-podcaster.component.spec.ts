import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoPodcasterComponent } from './nuevo-podcaster.component';

describe('NuevoPodcasterComponent', () => {
  let component: NuevoPodcasterComponent;
  let fixture: ComponentFixture<NuevoPodcasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevoPodcasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevoPodcasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

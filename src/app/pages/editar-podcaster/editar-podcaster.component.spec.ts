import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarPodcasterComponent } from './editar-podcaster.component';

describe('EditarPodcasterComponent', () => {
  let component: EditarPodcasterComponent;
  let fixture: ComponentFixture<EditarPodcasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarPodcasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarPodcasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

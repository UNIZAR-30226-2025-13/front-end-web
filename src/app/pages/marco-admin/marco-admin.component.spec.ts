import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarcoAdminComponent } from './marco-admin.component';

describe('MarcoAdminComponent', () => {
  let component: MarcoAdminComponent;
  let fixture: ComponentFixture<MarcoAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarcoAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarcoAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

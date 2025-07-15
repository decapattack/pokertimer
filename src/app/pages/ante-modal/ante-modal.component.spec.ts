import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnteModalComponent } from './ante-modal.component';

describe('AnteModalComponent', () => {
  let component: AnteModalComponent;
  let fixture: ComponentFixture<AnteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnteModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

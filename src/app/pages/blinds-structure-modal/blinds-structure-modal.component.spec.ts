import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlindsStructureModalComponent } from './blinds-structure-modal.component';

describe('BlindsStructureModalComponent', () => {
  let component: BlindsStructureModalComponent;
  let fixture: ComponentFixture<BlindsStructureModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlindsStructureModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlindsStructureModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalPlayersModalComponent } from './total-players-modal.component';

describe('TotalPlayersModalComponent', () => {
  let component: TotalPlayersModalComponent;
  let fixture: ComponentFixture<TotalPlayersModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalPlayersModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TotalPlayersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

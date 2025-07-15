import { TestBed } from '@angular/core/testing';

import { ClockStateService } from './clock-state.service';

describe('ClockStateService', () => {
  let service: ClockStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClockStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

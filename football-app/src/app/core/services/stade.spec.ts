import { TestBed } from '@angular/core/testing';

import { StadeService } from './stade.service';

describe('Stade', () => {
  let service: StadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

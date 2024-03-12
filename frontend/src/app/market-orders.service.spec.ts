import { TestBed } from '@angular/core/testing';

import { MarketOrdersService } from './market-orders.service';

describe('MarketOrdersService', () => {
  let service: MarketOrdersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarketOrdersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

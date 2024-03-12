import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketOrdersComponent } from './market-orders.component';

describe('MarketOrdersComponent', () => {
  let component: MarketOrdersComponent;
  let fixture: ComponentFixture<MarketOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketOrdersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MarketOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

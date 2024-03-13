import { Component, OnDestroy, OnInit, effect } from '@angular/core';
import { MarketOrdersService } from '../market-orders.service';
import { CommonModule } from '@angular/common';

interface MarketOrders {
  Id: number,
  ItemTypeId: string
  LocationId: number
  QualityLevel: number
  EnchantmentLevel: number
  UnitPriceSilver: number
  Amount: number
  AuctionType: string
  Expires: Date
  ItemGroupTypeId: string
}

@Component({
  selector: 'app-market-orders',
  standalone: true,
  imports: [MarketOrdersComponent, CommonModule],
  templateUrl: './market-orders.component.html',
  styleUrl: './market-orders.component.css'
})
export class MarketOrdersComponent {

  marketOrders: MarketOrders[] = []

  isDisableImg : boolean = false

  marketOrdersSignals = this.marketOrdersService.marketOrdersSignals

  i = 0

  constructor(private marketOrdersService: MarketOrdersService) {
    effect(() => {

      let marketOrdersObject = JSON.parse(this.marketOrdersSignals())

      this.marketOrders.unshift(marketOrdersObject)
    });
  }

  disableImg($event : Event){
    console.log($event)
  }

}

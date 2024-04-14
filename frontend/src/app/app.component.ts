import {Component, inject, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {CardModule} from 'primeng/card';
import {LegendComponent} from './market-prices/legend/legend.component';
import {MenuItem, PrimeNGConfig} from 'primeng/api';
import {TabMenuModule} from 'primeng/tabmenu';
import {MarketOrdersComponent} from './market-orders/market-orders.component';
import {NgIf} from '@angular/common';
import {MarketHistoryComponent} from "./market-history/market-history.component";
import {MarketPricesComponent} from "./market-prices/market-prices.component";
import {ItemsListComponent} from "./items-list/items-list.component";
import {CalcFarmPastureComponent} from "./calc-farm-pasture/calc-farm-pasture.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CardModule, LegendComponent, TabMenuModule, MarketOrdersComponent, NgIf, MarketHistoryComponent, MarketPricesComponent, ItemsListComponent, CalcFarmPastureComponent,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'alo.ninja';

  primengConfig = inject(PrimeNGConfig)

  items: MenuItem[] | undefined;

  activeItem: MenuItem | undefined;

  ngOnInit() {
    this.primengConfig.ripple = true;

    this.items = [{label: 'Market Prices', icon: 'pi pi-fw pi-calendar'}, {
      label: 'Market Orders', icon: 'pi pi-fw pi-home',
    }, {
      label: 'Market History', icon: 'pi pi-fw pi-home',
    }, {
      label: 'Items List', icon: 'pi pi-fw pi-home',
    }, {
      label: 'Calc Farm/Pasture', icon: 'pi pi-fw pi-home',
    }];

    this.activeItem = this.items[4];
  }

  onActiveItemChange(event: MenuItem) {
    this.activeItem = event;
  }
}

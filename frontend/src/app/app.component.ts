import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {CardModule} from 'primeng/card';
import {LegendComponent} from './market-prices/legend/legend.component';
import {MenuItem} from 'primeng/api';
import {TabMenuModule} from 'primeng/tabmenu';
import {MarketOrdersComponent} from './market-orders/market-orders.component';
import {NgIf} from '@angular/common';
import {MarketHistoryComponent} from "./market-history/market-history.component";
import {MarketPricesComponent} from "./market-prices/market-prices.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CardModule, LegendComponent, TabMenuModule, MarketOrdersComponent, NgIf, MarketHistoryComponent, MarketPricesComponent,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'alo.ninja';

  items: MenuItem[] | undefined;

  activeItem: MenuItem | undefined;

  ngOnInit() {
    this.items = [{label: 'Market Prices', icon: 'pi pi-fw pi-calendar'}, {
      label: 'Market Orders', icon: 'pi pi-fw pi-home',
    }, {
      label: 'Market History', icon: 'pi pi-fw pi-home',
    }];

    this.activeItem = this.items[0];
  }

  onActiveItemChange(event: MenuItem) {
    this.activeItem = event;
  }
}

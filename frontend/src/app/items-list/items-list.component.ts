import {Component, inject} from '@angular/core';
import {TieredMenuModule} from "primeng/tieredmenu";
import {MarketInfosService, PricesList} from "../market-infos.service";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {RippleModule} from "primeng/ripple";
import {CardModule} from "primeng/card";
import {TagModule} from "primeng/tag";

@Component({
  selector: 'app-items-list',
  standalone: true,
  imports: [
    TieredMenuModule,
    NgIf,
    RippleModule,
    NgForOf,
    CardModule,
    NgOptimizedImage,
    TagModule
  ],
  templateUrl: './items-list.component.html',
  styleUrl: './items-list.component.scss'
})
export class ItemsListComponent {

  protected marketInfos = inject(MarketInfosService)

  itemsList = this.marketInfos.itemsList;

  pricesList = this.marketInfos.pricesList;

  oue() {
    this.pricesList = this.marketInfos.pricesList;
  }
}

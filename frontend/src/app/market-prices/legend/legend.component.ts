import {CommonModule, NgClass, NgIf, NgOptimizedImage} from '@angular/common';
import {Component, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {FormsModule} from '@angular/forms';
import {TableModule} from "primeng/table";
import {ButtonModule} from "primeng/button";
import {TagModule} from "primeng/tag";
import {DropdownModule} from "primeng/dropdown";
import {TooltipModule} from 'primeng/tooltip';
import {MarketInfosService} from "../../market-infos.service";
import {SkeletonModule} from "primeng/skeleton";

export interface PricesListOld {
  item_id: string
  city: string
  quality: number
  sell_price_min: number
  sell_price_min_date: string
  sell_price_max: number
  sell_price_max_date: string
  buy_price_min: number
  buy_price_min_date: string
  buy_price_max: number
  buy_price_max_date: string
}

export interface PricesList {
  cityLong: string;
  item_id: string
  city: string
  avg: number
  totalWeight: number
  sell_price_min: number
  sell_price_max: number
  lastTime: number | string,
}


@Component({
  selector: 'app-legend',
  standalone: true,
  imports: [CommonModule, FormsModule, NgClass, NgIf, NgClass, TableModule, ButtonModule, TagModule, DropdownModule, TooltipModule, NgOptimizedImage, SkeletonModule],
  templateUrl: './legend.component.html',
  styleUrl: './legend.component.scss'
})
export class LegendComponent {

  private http = inject(HttpClient)
  private marketInfos = inject(MarketInfosService)

  resourceNameLists = this.marketInfos.resourceNameLists

  selectedResources = '' as keyof typeof this.resourceNameLists;

  selectedItemLevel !: string;

  //selectedResources: keyof typeof this.resourceNameLists = "Wood"
  pricesList: PricesList[][] = []
  cols = [{field: 'city', header: 'city'}, {field: 'quality', header: 'quality'}, {
    field: 'sell_price_min', header: 'sell_price_min'
  }];


  async prices() {

    this.pricesList = []

    let key = this.selectedResources;

    if (this.resourceNameLists[key] === undefined) {
      console.error('Item name does not match any resource list.');
      return;
    }

    /*
    let reqString = ""

    for (let index = 0; index < this.resourceNameLists[key].length; index++) {
      if (this.resourceNameLists[key][index] !== "") {

        reqString += `T${index + 1}_${this.selectedResources.toUpperCase()}_${},`
      }
    }
    */

    let data: PricesList[] = []

    console.log(`http://127.0.0.1:3909/getPrices?item=${key.toUpperCase()}&level=${this.selectedItemLevel}`)

    try {
      //data = await firstValueFrom(this.http.get<PricesList[]>(`https://west.albion-online-data.com/api/v2/stats/prices/${reqString}`));
      data = await firstValueFrom(this.http.get<PricesList[]>(`http://127.0.0.1:3909/getResourcesPrices?item=${key.toUpperCase()}&level=${this.selectedItemLevel}`));
    } catch (error) {
      console.error('Failed to fetch prices:', error);
      return;
    }

    console.log(data)

    data.forEach(value => {

      const tier: number = Number(value.item_id.charAt(1))

      if (this.pricesList[tier] === undefined) {
        this.pricesList[tier] = []
      }

      value.cityLong = value.city
      value.city = value.city.replace(" Market", "")

      value.lastTime = new Date(value.lastTime).toLocaleString()

      this.pricesList[tier].push(value)

      this.pricesList[tier].sort(this.compareByPrice)
    })
  }

  compareByPrice(a: PricesList, b: PricesList) {
    return a.avg - b.avg;
  }

  protected readonly Date = Date;
}


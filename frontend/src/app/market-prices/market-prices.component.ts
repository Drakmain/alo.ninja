import {AfterViewInit, Component, inject, QueryList, ViewChildren} from '@angular/core';
import {LegendComponent, PricesList} from "./legend/legend.component";
import {ButtonModule} from "primeng/button";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule} from "@angular/forms";
import {NgClass, NgForOf, NgIf, NgOptimizedImage, NgStyle} from "@angular/common";
import {TableModule} from "primeng/table";
import {MarketInfosService} from "../market-infos.service";
import {SkeletonModule} from "primeng/skeleton";
import {MultiSelectModule} from "primeng/multiselect";
import {TagModule} from "primeng/tag";
import {TooltipModule} from "primeng/tooltip";
import {PanelMenuModule} from "primeng/panelmenu";
import {MenubarModule} from "primeng/menubar";


@Component({
  selector: 'app-market-prices',
  standalone: true,
  imports: [LegendComponent, LegendComponent, ButtonModule, DropdownModule, FormsModule, NgForOf, TableModule, NgStyle, NgClass, NgIf, SkeletonModule, MultiSelectModule, NgOptimizedImage, TagModule, TooltipModule, PanelMenuModule, MenubarModule],
  templateUrl: './market-prices.component.html',
  styleUrl: './market-prices.component.scss'
})
export class MarketPricesComponent implements AfterViewInit {

  private marketInfos = inject(MarketInfosService)

  @ViewChildren(LegendComponent) legendComponents!: QueryList<LegendComponent>;
  legendResComp !: LegendComponent;
  legendProComp !: LegendComponent;

  date !: Date
  tab: Array<PricesList[][]> = []

  resourcesProList = this.marketInfos.resourcesCombList
  selectedResources: string = this.resourcesProList[0]

  itemLevel = this.marketInfos.itemLevel
  selectedItemLevel = this.itemLevel[0]

  citiesList = this.marketInfos.citiesList
  selectedCities = ["Thetford", "Fort Sterling", "Lymhurst", "Bridgewatch", "Martlock"]

  itemsList = this.marketInfos.itemsList;

  resourceNameLists = this.marketInfos.resourceNameLists

  products = Array.from({length: 9}).map((_, i) => `Item #${i}`);

  craftCostList: Array<{
    BuyCity: string,
    SellCity: string,
    Profit: number,
    MatRes: string,
    MatPro: string,
    SellCityPrice: number,
    BuyCityPrice0: number,
    BuyCityPrice1: number
  }> = []

  async onCitiesSelect() {
    console.log(this.selectedCities)
    await this.changeSplit()
  }

  async ngAfterViewInit() {

    console.log("ngAfterViewInit")

    const [legendComponent1, legendComponent2] = this.legendComponents.toArray();

    this.legendResComp = legendComponent1
    this.legendProComp = legendComponent2

    console.log("selectedResources " + this.selectedResources)
    console.log("Res = " + this.selectedResources.toString().split("/")[0] as keyof typeof this.resourceNameLists)
    console.log("Pro = " + this.selectedResources.toString().split("/")[1] as keyof typeof this.resourceNameLists)

    this.legendResComp.selectedResources = this.selectedResources.toString().split("/")[0] as keyof typeof this.resourceNameLists;
    this.legendProComp.selectedResources = this.selectedResources.toString().split("/")[1] as keyof typeof this.resourceNameLists;

    this.legendResComp.selectedItemLevel = this.selectedItemLevel
    this.legendProComp.selectedItemLevel = this.selectedItemLevel

    await Promise.all([this.legendProComp.prices(), this.legendResComp.prices()]);

    await this.changeSplit()
  }

  async changeSplit() {

    this.craftCostList = []

    console.log("legendResComp")
    console.log(this.legendResComp.selectedResources)
    console.log("legendProComp")
    console.log(this.legendProComp.selectedResources)

    for (let i = 2; i < this.legendResComp.pricesList.length - 1; i++) {

      if (this.legendProComp.pricesList[i] === undefined || this.legendResComp.pricesList[i + 1] === undefined) continue;

      this.legendProComp.pricesList[i] = this.legendProComp.pricesList[i].filter(value => this.selectedCities.includes(value.city));
      this.legendResComp.pricesList[i + 1] = this.legendResComp.pricesList[i + 1].filter(value => this.selectedCities.includes(value.city));

      if (this.legendProComp.pricesList[i] === undefined || this.legendResComp.pricesList[i + 1] === undefined) continue;

      console.log("0000000000000000000000000000000");
      console.log("Tier " + i);
      console.log("0000000000000000000000000000000");

      for (let y = 0; y < this.legendProComp.pricesList[i].length; y++) {
        if (this.legendProComp.pricesList[i][y] === undefined || this.legendResComp.pricesList[i + 1][y] === undefined) continue;

        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
        console.log("City Buy: " + this.legendProComp.pricesList[i][y].city);
        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");

        console.log("Pro Tier " + i + ": " + this.legendProComp.pricesList[i][y].sell_price_min);
        console.log("Res Tier " + (i + 1) + ": " + this.legendResComp.pricesList[i + 1][y].sell_price_min);

        let buyPrice = this.legendProComp.pricesList[i][y].sell_price_min + this.legendResComp.pricesList[i + 1][y].sell_price_min * 2;

        console.log("-----------------------------");

        for (let k = 0; k < this.legendProComp.pricesList[i + 1].length; k++) {

          if (!this.selectedCities.includes(this.legendProComp.pricesList[i + 1][k].city)) continue;

          if (this.legendProComp.pricesList[i + 1][k].sell_price_min === 0) continue;

          let profit = this.legendProComp.pricesList[i + 1][k].sell_price_min - buyPrice;

          console.log("City : " + this.legendProComp.pricesList[i + 1][k].city);
          console.log("City Sell Price: " + this.legendProComp.pricesList[i + 1][k].sell_price_min);
          console.log("Profit: " + profit);

          this.craftCostList.push({
            BuyCity: this.legendProComp.pricesList[i][y].city,
            BuyCityPrice0: this.legendResComp.pricesList[i + 1][y].sell_price_min,
            BuyCityPrice1: this.legendProComp.pricesList[i][y].sell_price_min,
            SellCity: this.legendProComp.pricesList[i + 1][k].city,
            SellCityPrice: this.legendProComp.pricesList[i + 1][k].sell_price_min,
            Profit: profit,
            MatPro: this.legendProComp.pricesList[i + 1][k].item_id.split('_')[0],
            MatRes: this.legendProComp.pricesList[i][y].item_id.split('_')[0]
          })
          console.log("-----------------------------");
        }
      }
    }

    this.craftCostList = this.craftCostList.sort((a, b) => (a.Profit > b.Profit ? -1 : 1));
    console.log(this.craftCostList)
  }

}

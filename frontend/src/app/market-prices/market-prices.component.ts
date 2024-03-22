import {AfterViewInit, Component, QueryList, ViewChildren} from '@angular/core';
import {LegendComponent, PricesList} from "./legend/legend.component";
import {ButtonModule} from "primeng/button";
import {DropdownChangeEvent, DropdownModule} from "primeng/dropdown";
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-market-prices',
  standalone: true,
  imports: [LegendComponent, LegendComponent, ButtonModule, DropdownModule, FormsModule, NgForOf],
  templateUrl: './market-prices.component.html',
  styleUrl: './market-prices.component.scss'
})
export class MarketPricesComponent implements AfterViewInit {

  @ViewChildren(LegendComponent) legendComponents!: QueryList<LegendComponent>;

  legendResComp !: LegendComponent;
  legendProComp !: LegendComponent;
  date !: Date
  tab: Array<PricesList[][]> = []
  selectedResources: string = "Wood/Planks"
  resourcesProList = ["Wood/Planks", "Rock/StoneBlock", "Hide/Leather", "Ore/MetalBar", "Fiber/Cloth"]
  resourceNameLists = {
    Wood: ["Rough Logs", "Birch Logs", "Chestnut Logs", "Pine Logs", "Cedar Logs", "Bloodoak Logs", "Ashenbark Logs", "Whitewood Logs"],
    Rock: ["Rough Stone", "Limestone", "Sandstone", "Travertine", "Granite", "Slate", "Basalt", "Marble"],
    Hide: ["Scraps of Hide", "Rugged Hide", "Thin Hide", "Medium Hide", "Heavy Hide", "Robust Hide", "Thick Hide", "Resilient Hide"],
    Ore: ["", "Copper Ore", "Tin Ore", "Iron Ore", "Titanium Ore", "Runite Ore", "Meteorite Ore", "Adamantium Ore"],
    Fiber: ["", "Cotton", "Flax", "Hemp", "Skyflower", "Amberleaf Cotton", "Sunflax", "Ghost Hemp"],

    Planks: ["", "Birch Planks", "Chestnut Planks", "Pine Planks", "Cedar Planks", "Bloodoak Planks", "Ashenbark Planks", "Whitewood Planks"],
    StoneBlock: ["", "Limestone Block", "Sandstone Block", "Travertine Block", "Granite Block", "Slate Block", "Basalt Block", "Marble Block"],
    Leather: ["", "Stiff Leather", "Thick Leather", "Worked Leather", "Cured Leather", "Hardened Leather", "Reinforced Leather", "Fortified Leather"],
    MetalBar: ["", "Copper Bat", "Bronze Bar", "Steel Bar", "Titanium Steel Bar", "Runite Steel Bar", "Meteorite Steel Bar", "Adamantium Steel Bar"],
    Cloth: ["", "Simple Cloth", "Neat Cloth", "Fine Cloth", "Ornate Cloth", "Lavish Cloth", "Opulent Cloth", "Baroque Cloth"]
  };

  arr : Array<{BuyCity : string, SellCity : string, Profit: Number, Mat: string}> = []

  async ngAfterViewInit() {

    const [legendComponent1, legendComponent2] = this.legendComponents.toArray();

    this.legendResComp = legendComponent1
    this.legendProComp = legendComponent2

    this.legendResComp.selectedResources = this.selectedResources.toString().split("/")[0] as keyof typeof this.resourceNameLists;
    this.legendProComp.selectedResources = this.selectedResources.toString().split("/")[1] as keyof typeof this.resourceNameLists;

    await this.legendResComp.prices()
    await this.legendProComp.prices()
  }

  async changeSplit(changes: DropdownChangeEvent) {

    this.arr = []

    console.log("selectedResources " + this.selectedResources)
    console.log("Res = " + this.selectedResources.toString().split("/")[0] as keyof typeof this.resourceNameLists)
    console.log("Pro = " + this.selectedResources.toString().split("/")[1] as keyof typeof this.resourceNameLists)

    this.legendResComp.selectedResources = this.selectedResources.toString().split("/")[0] as keyof typeof this.resourceNameLists;
    this.legendProComp.selectedResources = this.selectedResources.toString().split("/")[1] as keyof typeof this.resourceNameLists;

    await this.legendProComp.prices()
    await this.legendResComp.prices()
    console.log("legendResComp")
    console.log(this.legendResComp.selectedResources)
    console.log("legendProComp")
    console.log(this.legendProComp.selectedResources)

    let citiesList = ["Thetford", "Fort Sterling", "Lymhurst", "Bridgewatch", "Martlock", "Caerleon", "Brecilien"]

    for (let i = 2; i < this.legendResComp.pricesList.length - 1; i++) {

      console.log("0000000000000000000000000000000");
      console.log("Tier " + i);
      console.log("0000000000000000000000000000000");

      const proPrices = this.legendProComp.pricesList[i].filter(value => citiesList.includes(value.city));
      const resPrices = this.legendResComp.pricesList[i + 1].filter(value => citiesList.includes(value.city));

      for (let y = 0; y < proPrices.length; y++) {
        if (proPrices[y].sell_price_min === 0 || resPrices[y].sell_price_min === 0) continue;

        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
        console.log("City Buy: " + proPrices[y].city);
        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");

        console.log("Pro Tier " + i + ": " + proPrices[y].sell_price_min);
        console.log("Res Tier " + (i + 1) + ": " + resPrices[y].sell_price_min);

        let buyPrice = proPrices[y].sell_price_min + resPrices[y].sell_price_min;

        console.log("-----------------------------");

        for (let k = 0; k < this.legendProComp.pricesList[i + 1].length; k++) {

          if (this.legendProComp.pricesList[i + 1][k].sell_price_min === 0) continue;

          let profit = this.legendProComp.pricesList[i + 1][k].sell_price_min - buyPrice;
          console.log("City : " + this.legendProComp.pricesList[i + 1][k].city);
          console.log("City Sell Price: " + this.legendProComp.pricesList[i + 1][k].sell_price_min);
          console.log("Profit: " + profit);
          this.arr.push({BuyCity: proPrices[y].city, SellCity: this.legendProComp.pricesList[i + 1][k].city, Profit: profit, Mat: this.legendProComp.pricesList[i + 1][k].item_id})
          console.log("-----------------------------");
        }
      }
    }

    this.arr = this.arr.sort((a, b) => (a > b ? -1 : 1));
    console.log(this.arr)
  }

}

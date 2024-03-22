import {CommonModule, NgClass, NgIf} from '@angular/common';
import {Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {FormsModule} from '@angular/forms';
import {TableModule} from "primeng/table";
import {ButtonModule} from "primeng/button";
import {TagModule} from "primeng/tag";
import {DropdownModule} from "primeng/dropdown";

export interface PricesList {
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

@Component({
  selector: 'app-legend',
  standalone: true,
  imports: [CommonModule, FormsModule, NgClass, NgIf, NgClass, TableModule, ButtonModule, TagModule, DropdownModule],
  templateUrl: './legend.component.html',
  styleUrl: './legend.component.css'
})
export class LegendComponent {

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

  selectedResources = '' as keyof typeof this.resourceNameLists;

  //selectedResources: keyof typeof this.resourceNameLists = "Wood"
  pricesList: PricesList[][] = []
  cols = [{field: 'city', header: 'city'}, {field: 'quality', header: 'quality'}, {
    field: 'sell_price_min', header: 'sell_price_min'
  }];
  private http = inject(HttpClient)

  async prices() {

    this.pricesList = []

    let key = this.selectedResources;

    if (this.resourceNameLists[key] === undefined) {
      console.error('Item name does not match any resource list.');
      return;
    }

    let reqString = ""

    for (let index = 0; index < this.resourceNameLists[key].length; index++) {
      if (this.resourceNameLists[key][index] !== "") {
        reqString += `T${index + 1}_${this.selectedResources.toUpperCase()},`
      }
    }

    let data: PricesList[] = []

    try {
      data = await firstValueFrom(this.http.get<PricesList[]>(`https://west.albion-online-data.com/api/v2/stats/prices/${reqString}`));
    } catch (error) {
      console.error('Failed to fetch prices:', error);
      return;
    }

    data.forEach(value => {
      const tier: number = Number(value.item_id.charAt(1))

      if (this.pricesList[tier] === undefined) {
        this.pricesList[tier] = []
      }

      this.pricesList[tier].push(value)

      this.pricesList[tier].sort(this.compareByPrice)
    })
  }

  compareByPrice(a: PricesList, b: PricesList) {
    return a.sell_price_min - b.sell_price_min;
  }
}


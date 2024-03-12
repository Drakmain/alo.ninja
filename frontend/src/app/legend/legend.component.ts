import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';

interface PricesList {
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
  imports: [CommonModule, FormsModule],
  templateUrl: './legend.component.html',
  styleUrl: './legend.component.css'
})
export class LegendComponent {

  constructor(private http: HttpClient) { }

  selectedResource: keyof typeof this.resourceLists = "wood"

  recourcesList = ["wood", "rock", "hide", "ore", "fiber"]

  processedList = ["Plank", "Brick", "Leather", "Metal", "Cloth"]

  pricesList: PricesList[][] = []

  resourceLists = {
    wood: ["Rough Logs", "Birch Logs", "Chestnut Logs", "Pine Logs", "Cedar Logs", "Bloodoak Logs", "Ashenbark Logs", "Whitewood Logs"],
    rock: ["Rough Stone", "Limestone", "Sandstone", "Travertine", "Granite", "Slate", "Basalt", "Marble"],
    hide: ["Scraps of Hide", "Rugged Hide", "Thin Hide", "Medium Hide", "Heavy Hide", "Robust Hide", "Thick Hide", "Resilient Hide"],
    ore: ["", "Copper Ore", "Tin Ore", "Iron Ore", "Titanium Ore", "Runite Ore", "Meteorite Ore", "Adamantium Ore"],
    fiber: ["", "Cotton", "Flax", "Hemp", "Skyflower", "Amberleaf Cotton", "Sunflax", "Ghost Hemp"]
  };

  async prices(itemName: string) {

    let key = itemName as keyof typeof this.resourceLists;

    if (this.resourceLists[key] === undefined) {
      console.error('Item name does not match any resource list.');
      return;
    }

    let reqString = ""

    for (let index = 0; index < this.resourceLists[key].length; index++) {

      reqString += `T${index}_${itemName.toUpperCase()},`

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


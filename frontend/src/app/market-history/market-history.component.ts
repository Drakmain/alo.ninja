import {Component, inject, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ChartModule, UIChart, } from "primeng/chart";
import {firstValueFrom} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {ButtonModule} from "primeng/button";
import {DropdownChangeEvent, DropdownModule} from "primeng/dropdown";
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";

export interface LocationHistory {
  data: Data
  location: string
  item_id: string
  quality: number
}

export interface Data {
  timestamps: string[]
  prices_avg: number[]
  item_count: number[]
}

interface DataChart {
  datasets: Dataset[]
}

interface Dataset {
  label: string
  fill: boolean
  borderColor: string
  tension: number
  data: XY[]
}

interface XY {
  x: string,
  y: number
}

interface CitiesPriceHistory {
  [key: string]: DataChart;
}

@Component({
  selector: 'app-market-history',
  standalone: true,
  imports: [ChartModule, ButtonModule, DropdownModule, FormsModule, NgForOf],
  templateUrl: './market-history.component.html',
  styleUrl: './market-history.component.scss'
})
export class MarketHistoryComponent implements OnInit {

  selectedTimeScale = 1

  timeScaleList = [1, 24]

  selectedResources = "Wood/Planks"

  resourcesList = ["Wood/Planks", "Rock/StoneBlock", "Hide/Leather", "Ore/MetalBar", "Fiber/Cloth"]

  resourceNameLists = {
    Wood: ["Rough Logs", "Birch Logs", "Chestnut Logs", "Pine Logs", "Cedar Logs", "Bloodoak Logs", "Ashenbark Logs", "Whitewood Logs"],
    Rock: ["Rough Stone", "Limestone", "Sandstone", "Travertine", "Granite", "Slate", "Basalt", "Marble"],
    Hide: ["Scraps of Hide", "Rugged Hide", "Thin Hide", "Medium Hide", "Heavy Hide", "Robust Hide", "Thick Hide", "Resilient Hide"],
    Ore: ["", "Copper Ore", "Tin Ore", "Iron Ore", "Titanium Ore", "Runite Ore", "Meteorite Ore", "Adamantium Ore"],
    Fiber: ["", "Cotton", "Flax", "Hemp", "Skyflower", "Amberleaf Cotton", "Sunflax", "Ghost Hemp"],

    Planks: ["", "Birch Planks", "Chestnut Planks", "Pine Planks", "Cedar Planks", "Bloodoak Planks", "Ashenbark Planks", "Whitewood Planks"],
    StoneBlock: ["", "Limestone Block", "Sandstone Block", "Travertine Block", "Granite Block", "Slate Block", "Basalt Block", "Marble Block"],
    Leather: ["", "Stiff Leather", "Thick Leather", "Worked Leather", "Cured Leather", "Hardened Leather", "Reinforced Leather", "Fortified Leather"],
    Metal: ["", "Copper Bat", "Bronze Bar", "Steel Bar", "Titanium Steel Bar", "Runite Steel Bar", "Meteorite Steel Bar", "Adamantium Steel Bar"],
    Cloth: ["", "Simple Cloth", "Neat Cloth", "Fine Cloth", "Ornate Cloth", "Lavish Cloth", "Opulent Cloth", "Baroque Cloth"]
  };

  citiesList = ["Thetford", "Fort Sterling", "Lymhurst", "Bridgewatch", "Martlock", "Caerleon", "Brecilien"]

  citiesPriceHistoryRes: CitiesPriceHistory = {
    'Thetford': {datasets: []},
    'Fort Sterling': {datasets: []},
    'Lymhurst': {datasets: []},
    'Bridgewatch': {datasets: []},
    'Martlock': {datasets: []},
    'Caerleon': {datasets: []},
    'Brecilien': {datasets: []},
  };

  citiesPriceHistoryPro: CitiesPriceHistory = {
    'Thetford': {datasets: []},
    'Fort Sterling': {datasets: []},
    'Lymhurst': {datasets: []},
    'Bridgewatch': {datasets: []},
    'Martlock': {datasets: []},
    'Caerleon': {datasets: []},
    'Brecilien': {datasets: []},
  };

  options: any;
  private http = inject(HttpClient)

  @ViewChildren(UIChart) charts!: QueryList<UIChart>;

  async ngOnInit() {

    let res = this.selectedResources.toString().split("/")[0] as keyof typeof this.resourceNameLists;

    let pro = this.selectedResources.toString().split("/")[1] as keyof typeof this.resourceNameLists;

    await this.getData(res, this.citiesPriceHistoryRes)

    await this.getData(pro, this.citiesPriceHistoryPro)

    console.log(this.citiesPriceHistoryRes)
    console.log(this.citiesPriceHistoryPro)

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.options = {
      interaction: {
        intersect: false, mode: 'index',
      }, maintainAspectRatio: false, aspectRatio: 0.6, plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      }, scales: {
        x: {
          ticks: {
            color: textColorSecondary
          }, grid: {
            color: surfaceBorder, drawBorder: false
          }
        }, y: {
          ticks: {
            color: textColorSecondary
          }, grid: {
            color: surfaceBorder, drawBorder: false
          }
        }
      }
    }
  }

  async getData(key: "Hide" | "Planks" | "Rock" | "Ore" | "Wood" | "Fiber" | "StoneBlock" | "Cloth" | "Leather" | "Metal", citiesPriceHistory: CitiesPriceHistory) {

    if (this.resourceNameLists[key] === undefined) {
      console.error('Item name does not match any resource list.');
      return;
    }

    let reqString = this.resourceNameLists[key].map((_, index) => `T${index + 1}_${key.toUpperCase()}`).join(',')

    let data: LocationHistory[] = []

    console.log(`https://west.albion-online-data.com/api/v2/stats/charts/${reqString}?time-scale=24`)

    try {
      data = await firstValueFrom(this.http.get<LocationHistory[]>(`https://west.albion-online-data.com/api/v2/stats/charts/${reqString}?time-scale=${this.selectedTimeScale}`));
    } catch (error) {
      console.error('Failed to fetch prices:', error);
      return;
    }

    data.forEach(value => {

      let keyLocation = value.location

      if (citiesPriceHistory[keyLocation] !== undefined) {

        let prop = this.switchTier(value.item_id)

        let obj: XY[] = value.data.prices_avg.map((price, i) => ({
          x: value.data.timestamps[i], y: Number(price),
        }));

        obj.sort((a, b) => a.x.localeCompare(b.x));

        let tier = Number(value.item_id.charAt(1))

        let dataset: Dataset = {
          label: this.resourceNameLists[key][tier - 1], fill: false, borderColor: prop, tension: 0.4, data: obj
        }

        citiesPriceHistory[keyLocation].datasets.push(dataset)
      }

    })
  }

  switchTier(item_id: string): string {
    switch (item_id.split('_')[0]) {
      case 'T1':
        return '#353535'
      case 'T2':
        return '#635349'
      case 'T3':
        return '#3F5131'
      case 'T4':
        return '#355F78'
      case 'T5':
        return '#77221A'
      case 'T6':
        return '#C06B2A'
      case 'T7':
        return '#D1B044'
      case 'T8':
        return '#D0D0D0'
      default:
        throw new Error("No Tier parsed in params")
    }
  }

  async onDropdownTimeScaleChange($event: DropdownChangeEvent){
    this.selectedTimeScale = $event.value

    this.citiesPriceHistoryRes = {
      'Thetford': {datasets: []},
      'Fort Sterling': {datasets: []},
      'Lymhurst': {datasets: []},
      'Bridgewatch': {datasets: []},
      'Martlock': {datasets: []},
      'Caerleon': {datasets: []},
      'Brecilien': {datasets: []},
    };

    this.citiesPriceHistoryPro = {
      'Thetford': {datasets: []},
      'Fort Sterling': {datasets: []},
      'Lymhurst': {datasets: []},
      'Bridgewatch': {datasets: []},
      'Martlock': {datasets: []},
      'Caerleon': {datasets: []},
      'Brecilien': {datasets: []},
    };

    let res = this.selectedResources.toString().split("/")[0] as keyof typeof this.resourceNameLists;

    let pro = this.selectedResources.toString().split("/")[1] as keyof typeof this.resourceNameLists;

    await this.getData(res, this.citiesPriceHistoryRes)

    await this.getData(pro, this.citiesPriceHistoryPro)

    this.charts.forEach((chartInstance, index) => {
      chartInstance.refresh()
    });
  }

  async onDropdownItemChange($event: DropdownChangeEvent) {
    this.selectedResources = $event.value

    this.citiesPriceHistoryRes = {
      'Thetford': {datasets: []},
      'Fort Sterling': {datasets: []},
      'Lymhurst': {datasets: []},
      'Bridgewatch': {datasets: []},
      'Martlock': {datasets: []},
      'Caerleon': {datasets: []},
      'Brecilien': {datasets: []},
    };

    this.citiesPriceHistoryPro = {
      'Thetford': {datasets: []},
      'Fort Sterling': {datasets: []},
      'Lymhurst': {datasets: []},
      'Bridgewatch': {datasets: []},
      'Martlock': {datasets: []},
      'Caerleon': {datasets: []},
      'Brecilien': {datasets: []},
    };

    let res = this.selectedResources.toString().split("/")[0] as keyof typeof this.resourceNameLists;

    let pro = this.selectedResources.toString().split("/")[1] as keyof typeof this.resourceNameLists;

    await this.getData(res, this.citiesPriceHistoryRes)

    await this.getData(pro, this.citiesPriceHistoryPro)

    this.charts.forEach((chartInstance, index) => {
      chartInstance.refresh()
    });
  }
}

import {Component, inject} from '@angular/core';
import {CardModule} from "primeng/card";
import {DropdownModule} from "primeng/dropdown";
import {NgClass, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MultiSelectModule} from "primeng/multiselect";
import {DividerModule} from "primeng/divider";
import {ButtonModule} from "primeng/button";
import {MessageService} from "primeng/api";
import {PanelModule} from "primeng/panel";
import {PaginatorModule} from "primeng/paginator";

type SlotDetails = {
  food: number;
  foodType: string;
  offSpringBase: number;
  offSpringFocus: number;
  uniqueName: string;
  name: string;
  tier: string;
};

@Component({
  selector: 'app-calc-farm-pasture',
  standalone: true,
  imports: [CardModule, DropdownModule, NgForOf, FormsModule, NgIf, MultiSelectModule, NgOptimizedImage, DividerModule, ButtonModule, NgClass, PanelModule, PaginatorModule],
  templateUrl: './calc-farm-pasture.component.html',
  styleUrl: './calc-farm-pasture.component.scss',
  providers: [MessageService]
})
export class CalcFarmPastureComponent {

  messageService = inject(MessageService)

  items = [{
    label: 'Reset', icon: 'pi pi-refresh', command: () => {
      this.resetPlot(this.clickedPlot)
    }
  }, {
    label: 'Duplicate', icon: 'pi pi-copy', command: () => {
      this.duplicatePlot(this.clickedPlot)
    }
  }, {
    separator: true
  }, {
    label: 'Delete', icon: 'pi pi-times', command: () => {
      this.removePlot(this.clickedPlot)
    }
  }];

  farmSeedList: SlotDetails[] = [
    { food: 0, foodType: 'vegetable', offSpringBase: 0, offSpringFocus: 200, uniqueName: "T1_FARM_CARROT_SEED", name: "Carrot", tier: "tier1"},
    { food: 0, foodType: 'vegetable', offSpringBase: 0, offSpringFocus: 0, uniqueName: "T2_FARM_BEAN_SEED", name: "Bean", tier: "tier2" },
    { food: 0, foodType: 'vegetable', offSpringBase: 0, offSpringFocus: 0, uniqueName: "T3_FARM_WHEAT_SEED", name: "Wheat", tier: "tier3" },
    { food: 0, foodType: 'vegetable', offSpringBase: 0, offSpringFocus: 0, uniqueName: "T4_FARM_TURNIP_SEED", name: "Turnip", tier: "tier4" },
    { food: 0, foodType: 'vegetable', offSpringBase: 0, offSpringFocus: 0, uniqueName: "T5_FARM_CABBAGE_SEED", name: "Cabbage", tier: "tier5"},
    { food: 0, foodType: 'vegetable', offSpringBase: 0, offSpringFocus: 0, uniqueName: "T6_FARM_POTATO_SEED", name: "Potato", tier: "tier6"},
    { food: 0, foodType: 'vegetable', offSpringBase: 0, offSpringFocus: 0, uniqueName: "T7_FARM_CORN_SEED", name: "Corn", tier: "tier7"},
    { food: 0, foodType: 'vegetable', offSpringBase: 0, offSpringFocus: 0, uniqueName: "T8_FARM_PUMPKIN_SEED", name: "Pumpkin", tier: "tier8"},
  ];

  gardenSeedList: SlotDetails[] = [
    { food: 0, foodType: 'herb', offSpringBase: 0, offSpringFocus: 0, uniqueName: "T2_FARM_AGARIC_SEED", name: "Arcane Agaric", tier: "tier2" },
    { food: 0, foodType: 'herb', offSpringBase: 0, offSpringFocus: 0, uniqueName: "T3_FARM_COMFREY_SEED", name: "Brightleaf", tier: "tier3" },
    { food: 0, foodType: 'herb', offSpringBase: 0, offSpringFocus: 2, uniqueName: "T4_FARM_BURDOCK_SEED", name: "Crenellated", tier: "tier4" },
    { food: 0, foodType: 'herb', offSpringBase: 0, offSpringFocus: 0, uniqueName: "T5_FARM_TEASEL_SEED", name: "Dragon", tier: "tier5"},
    { food: 0, foodType: 'herb', offSpringBase: 0, offSpringFocus: 0, uniqueName: "T6_FARM_FOXGLOVE_SEED", name: "Elusive", tier: "tier6"},
    { food: 0, foodType: 'herb', offSpringBase: 0, offSpringFocus: 0, uniqueName: "T7_FARM_MULLEIN_SEED", name: "Firetouched", tier: "tier7"},
    { food: 0, foodType: 'herb', offSpringBase: 0, offSpringFocus: 0, uniqueName: "T8_FARM_YARROW_SEED", name: "Ghoul", tier: "tier8"},
  ];

  pastureAnimalList: SlotDetails[] = [
    { food: 10, foodType: 'vegetable', offSpringBase: 60, offSpringFocus: 140, uniqueName: "T3_FARM_CHICKEN_BABY", name: "Chicken", tier: "tier3"},
    { food: 10, foodType: 'vegetable', offSpringBase: 84, offSpringFocus: 104, uniqueName: "T3_FARM_OX_BABY", name: "Ox T3", tier: "tier3" },
    { food: 10, foodType: 'vegetable', offSpringBase: 84, offSpringFocus: 104, uniqueName: "T3_FARM_HORSE_BABY", name: "Foal T3", tier: "tier3" },
    { food: 10, foodType: 'vegetable', offSpringBase: 73.3, offSpringFocus: 126.7, uniqueName: "T4_FARM_GOAT_BABY", name: "Kid", tier: "tier4" },
    { food: 10, foodType: 'vegetable', offSpringBase: 78.7, offSpringFocus: 105.3, uniqueName: "T4_FARM_OX_BABY", name: "Ox T4", tier: "tier4"},
    { food: 10, foodType: 'vegetable', offSpringBase: 78.7, offSpringFocus: 105.3, uniqueName: "T4_FARM_HORSE_BABY", name: "Foal T4", tier: "tier4"},
    { food: 10, foodType: 'vegetable', offSpringBase: 80.0, offSpringFocus: 120, uniqueName: "T5_FARM_GOOSE_BABY", name: "Gosling", tier: "tier5"},
    { food: 90, foodType: 'vegetable', offSpringBase: 78.7, offSpringFocus: 105.3, uniqueName: "T5_FARM_OX_BABY", name: "Ox T5", tier: "tier5"},
    { food: 90, foodType: 'vegetable', offSpringBase: 78.7, offSpringFocus: 105.3, uniqueName: "T5_FARM_HORSE_BABY", name: "Foal T5", tier: "tier5"},
    { food: 10, foodType: 'vegetable', offSpringBase: 60, offSpringFocus: 140, uniqueName: "T6_FARM_SHEEP_BABY", name: "Lamb", tier: "tier6"},
    { food: 272, foodType: 'vegetable', offSpringBase: 81, offSpringFocus: 104.8, uniqueName: "T6_FARM_OX_BABY", name: "Ox T6", tier: "tier6"},
    { food: 272, foodType: 'vegetable', offSpringBase: 81, offSpringFocus: 104.8, uniqueName: "T6_FARM_HORSE_BABY", name: "Foal T6", tier: "tier6"},
    { food: 10, foodType: 'vegetable', offSpringBase: 86.7, offSpringFocus: 113.3, uniqueName: "T7_FARM_PIG_BABY", name: "Piglet", tier: "tier7"},
    { food: 805, foodType: 'vegetable', offSpringBase: 84.2, offSpringFocus: 104, uniqueName: "T7_FARM_OX_BABY", name: "Ox T7", tier: "tier7"},
    { food: 805, foodType: 'vegetable', offSpringBase: 84.2, offSpringFocus: 104, uniqueName: "T7_FARM_HORSE_BABY", name: "Foal T7", tier: "tier7"},
    { food: 805, foodType: 'vegetable', offSpringBase: 84.2, offSpringFocus: 104, uniqueName: "T8_FARM_COW_BABY", name: "Calf" , tier: "tier8"},
    { food: 2367, foodType: 'vegetable', offSpringBase: 87.4, offSpringFocus: 103.1, uniqueName: "T8_FARM_OX_BABY", name: "Ox T8" , tier: "tier8"},
    { food: 2367, foodType: 'vegetable', offSpringBase: 87.4, offSpringFocus: 103.1, uniqueName: "T8_FARM_HORSE_BABY", name: "Foal T8" , tier: "tier8"}
  ];

  kennelAnimalList: SlotDetails[] = [
    { food: 90, foodType: 'meat', offSpringBase: 0, offSpringFocus: 30, uniqueName: "T5_FARM_COUGAR_BABY", name: "Swiftclaw Cub", tier: "tier5"},
    { food: 90, foodType: 'meat', offSpringBase: 0, offSpringFocus: 30, uniqueName: "T5_FARM_MOABIRD_FW_BRIDGEWATCH_BABY", name: "Baby Moabird", tier: "tier5" },
    { food: 90, foodType: 'meat', offSpringBase: 0, offSpringFocus: 30, uniqueName: "T5_FARM_DIREBOAR_FW_LYMHURST_BABY", name: "Wild Boarlet", tier: "tier5" },
    { food: 90, foodType: 'meat', offSpringBase: 0, offSpringFocus: 30, uniqueName: "T5_FARM_DIREBEAR_FW_FORTSTERLING_BABY", name: "Winter Bear Cub", tier: "tier5" },
    { food: 90, foodType: 'meat', offSpringBase: 0, offSpringFocus: 30, uniqueName: "T5_FARM_SWAMPDRAGON_FW_THETFORD_BABY", name: "Baby Swamp Salamander", tier: "tier5"},
    { food: 272, foodType: 'meat', offSpringBase: 0, offSpringFocus: 24, uniqueName: "T6_FARM_DIREWOLF_GROWN", name: "Direwolf Pup", tier: "tier6"},
    { food: 272, foodType: 'vegetable', offSpringBase: 0, offSpringFocus: 24, uniqueName: "T6_FARM_GIANTSTAG_BABY", name: "Master's Fawn", tier: "tier6"},
    { food: 805, foodType: 'meat', offSpringBase: 0, offSpringFocus: 20, uniqueName: "T7_FARM_DIREBOAR_BABY", name: "Direboar Piglet", tier: "tier7"},
    { food: 805, foodType: 'meat', offSpringBase: 0, offSpringFocus: 20, uniqueName: "T7_FARM_SWAMPDRAGON_BABY", name: "Swamp Dragon Pup", tier: "tier7"},
    { food: 2367, foodType: 'meat', offSpringBase: 0, offSpringFocus: 15, uniqueName: "T8_FARM_DIREBEAR_BABY", name: "Direbear Cub", tier: "tier8"},
    { food: 2367, foodType: 'vegetable', offSpringBase: 0, offSpringFocus: 15, uniqueName: "T8_FARM_MAMMOTH_BABY", name: "Mammoth Calf", tier: "tier8"},
    { food: 2367, foodType: 'meat', offSpringBase: 0, offSpringFocus: 15, uniqueName: "T8_FARM_DIREWOLF_BABY", name: "Ghostwolf Pup", tier: "tier8"},
  ];

  selectedPlots: SlotDetails[][] = [];
  plotList: string[] = []
  clickedPlot: number | undefined = undefined
  cropFarmerLVL = 0;
  herbalistLVL = 0;
  animalBreederLVL = 0;
  chefLVL = 0;
  alchemistLVL = 0;

  addPlot(tier: string) {
    this.selectedPlots[this.plotList.length] = []
    this.plotList.push(tier);

    this.messageService.add({severity: 'success', summary: 'Succès', detail: `Plot '${tier}' added`});
    console.log(this.selectedPlots)
  }

  removePlot(clickedPlot: number | undefined) {

    if (clickedPlot === undefined) {
      this.messageService.add({severity: 'error', summary: 'Erreur', detail: 'Plot deleted'});
      return
    }

    this.plotList.splice(clickedPlot, 1)
    this.selectedPlots.splice(clickedPlot, 1)

    this.clickedPlot = undefined;

    this.messageService.add({severity: 'success', summary: 'Succès', detail: 'Plot deleted'});
  }

  resetPlot(clickedPlot: number | undefined) {

    if (clickedPlot === undefined) {
      this.messageService.add({severity: 'error', summary: 'Erreur', detail: 'Plot deleted'});
      return
    }

    this.selectedPlots[clickedPlot] = [];

    this.clickedPlot = undefined;

    this.messageService.add({severity: 'success', summary: 'Succès', detail: 'Plot rested'});
  }

  duplicatePlot(clickedPlot: number | undefined) {

    if (clickedPlot === undefined) {
      this.messageService.add({severity: 'error', summary: 'Erreur', detail: 'Plot deleted'});
      return
    }

    let plotName = this.plotList[clickedPlot]
    this.plotList = [...this.plotList.slice(0, clickedPlot), plotName, ...this.plotList.slice(clickedPlot)];

    let plotData = [...this.selectedPlots[clickedPlot]]
    this.selectedPlots = [...this.selectedPlots.slice(0, clickedPlot), plotData, ...this.selectedPlots.slice(clickedPlot)];

    this.clickedPlot = undefined;

    this.messageService.add({severity: 'success', summary: 'Succès', detail: 'Plot deduplicated'});
  }

  countElem(selectedPlot: SlotDetails[][], element: SlotDetails) {
    return selectedPlot.reduce((total, currentArray) => total + currentArray.reduce((count, currentValue) => count + (currentValue === element ? 1 : 0), 0), 0);
  }

  getPlotStyleClass(plot: string) {
    if (plot === 'Farm') {
      return 'tier1'
    } else if (plot === 'Herb Garden') {
      return 'tier2'
    } else if (plot === 'Pasture') {
      return 'tier3'
    } else if (plot === 'Kennel') {
      return 'tier4'
    }
    return ''
  }
}

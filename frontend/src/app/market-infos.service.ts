import {inject, Injectable} from '@angular/core';
import {MenuItem} from "primeng/api";
import {firstValueFrom} from "rxjs";
import {HttpClient} from "@angular/common/http";

export interface Item {
  LocalizationNameVariable: string
  LocalizationDescriptionVariable: string
  LocalizedNames: Localized | null
  LocalizedDescriptions: Localized | null
  Index: string
  _id: string
}

export interface Localized {
  "EN-US": string
  "DE-DE": string
  "FR-FR": string
  "RU-RU": string
  "PL-PL": string
  "ES-ES": string
  "PT-BR": string
  "IT-IT": string
  "ZH-CN": string
  "KO-KR": string
  "JA-JP": string
  "ZH-TW": string
  "ID-ID": string
  "TR-TR": string
  "AR-SA": string
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

@Injectable({
  providedIn: 'root'
})
export class MarketInfosService {

  selectedItem: Item[] = []
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
  resourcesCombList = ["Wood/Planks", "Rock/StoneBlock", "Hide/Leather", "Ore/MetalBar", "Fiber/Cloth"]
  itemLevel = ["0", "1", "2", "3", "4"]
  citiesList = ["Thetford", "Fort Sterling", "Lymhurst", "Bridgewatch", "Martlock", "Caerleon", "Brecilien"]
  baseCitiesList = ["Thetford", "Fort Sterling", "Lymhurst", "Bridgewatch", "Martlock"]
  itemsList: MenuItem[] = [{
    label: 'Accessories', items: [{
      label: 'Bag', command: () => {
        this.fetchItem('Bag');
      }
    }, {
      label: 'Cape', command: () => {
        this.fetchItem('Cape');
      }
    }]
  }, {
    label: 'Armor', items: [{
      label: 'Cloth', items: [{
        label: 'Armor', command: () => {
          this.fetchItem('ARMOR_CLOTH');
        }
      }, {
        label: 'Helmet', command: () => {
          this.fetchItem('HEAD_CLOTH');
        }
      }, {
        label: 'Shoes', command: () => {
          this.fetchItem('SHOES_CLOTH');
        }
      }]
    }, {
      label: 'Leather', items: [{
        label: 'Armor', command: () => {
          this.fetchItem('ARMOR_LEATHER');
        }
      }, {
        label: 'Helmet', command: () => {
          this.fetchItem('HEAD_LEATHER');
        }
      }, {
        label: 'Shoes', command: () => {
          this.fetchItem('SHOES_LEATHER');
        }
      }]
    }, {
      label: 'Plate', items: [{
        label: 'Armor', command: () => {
          this.fetchItem('ARMOR_PLATE');
        }
      }, {
        label: 'Helmet', command: () => {
          this.fetchItem('HEAD_PLATE');
        }
      }, {
        label: 'Shoes', command: () => {
          this.fetchItem('SHOES_PLATE');
        }
      }]
    }, {
      label: 'Unique', items: [{
        label: 'Armor'
      }, {
        label: 'Helmet'
      }, {
        label: 'Shoes'
      }]
    }]
  }, {
    label: 'City Resources', items: [{
      label: 'Beastheart', command: () => {
        this.fetchItem('FACTION_STEPPE');
      }
    }, {
      label: 'Shadowheart', command: () => {
        this.fetchItem('FACTION_CAERLEON');
      }
    }, {
      label: 'Montainheart', command: () => {
        this.fetchItem('FACTION_MOUNTAIN');
      }
    }, {
      label: 'Rockheart', command: () => {
        this.fetchItem('FACTION_HIGHLAND');
      }
    }, {
      label: 'Treeheart', command: () => {
        this.fetchItem('FACTION_FOREST');
      }
    }, {
      label: 'Vineheart', command: () => {
        this.fetchItem('FACTION_SWAMP');
      }
    },]
  }, {
    label: 'Consumable', items: [{
      label: 'Cooked',
    }, {
      label: 'Fish', command: () => {
        this.fetchItem('FISH_FRESHWATER');
      }
    }, {
      label: 'Fishing Bait', command: () => {
        this.fetchItem('FISHINGBAIT');
      }
    }, {
      label: 'Victory Emotes',
    }, {
      label: 'Map',
    }, {
      label: 'Other',
    }, {
      label: 'Potion', command: () => {
        this.fetchItem('POTION_CONSUMABLE');
      }
    }, {
      label: 'Vanity', command: () => {
        this.fetchItem('VANITY_CONSUMABLE');
      }
    }]
  }, {
    label: 'Farmable', items: [{
      label: 'Animal',
    }, {
      label: 'Seed',
    }]
  }, {
    label: 'Furniture', items: [{
      label: 'Banner',
    }, {
      label: 'Bed',
    }, {
      label: 'Chest',
    }, {
      label: 'Decoration',
    }, {
      label: 'Flag', command: () => {
        this.fetchItem('FLAG');
      }
    }, {
      label: 'Heretic', command: () => {
        this.fetchItem('FURNITUREITEM_HERETIC');
      }
    }, {
      label: 'Keeper', command: () => {
        this.fetchItem('FURNITUREITEM_KEEPER');
      }
    }, {
      label: 'Morgana', command: () => {
        this.fetchItem('FURNITUREITEM_MORGANA');
      }
    }, {
      label: 'Repair Kit', command: () => {
        this.fetchItem('REPAIRKIT');
      }
    }, {
      label: 'Table', command: () => {
        this.fetchItem('FURNITUREITEM_TABLE');
      }
    }, {
      label: 'Unique',
    }]
  }, {
    label: 'Gathering Gear', items: [{
      label: 'Harvester', items: [{
        label: 'Grab', command: () => {
          this.fetchItem('HEAD_GATHERER_FIBER');
        }
      }, {
        label: 'Backpack', command: () => {
          this.fetchItem('BACKPACK_GATHERER_FIBER');
        }
      }, {
        label: 'Cap', command: () => {
          this.fetchItem('HEAD_GATHERER_FIBER');
        }
      }, {
        label: 'Workboots', command: () => {
          this.fetchItem('SHOES_GATHERER_FIBER');
        }
      }]
    }, {
      label: 'Fisherman', items: [{
        label: 'Grab', command: () => {
          this.fetchItem('HEAD_GATHERER_FISH');
        }
      }, {
        label: 'Backpack', command: () => {
          this.fetchItem('BACKPACK_GATHERER_FISH');
        }
      }, {
        label: 'Cap', command: () => {
          this.fetchItem('HEAD_GATHERER_FISH');
        }
      }, {
        label: 'Workboots', command: () => {
          this.fetchItem('SHOES_GATHERER_FISH');
        }
      }]
    }, {
      label: 'Skinner', items: [{
        label: 'Grab', command: () => {
          this.fetchItem('HEAD_GATHERER_HIDE');
        }
      }, {
        label: 'Backpack', command: () => {
          this.fetchItem('BACKPACK_GATHERER_HIDE');
        }
      }, {
        label: 'Cap', command: () => {
          this.fetchItem('HEAD_GATHERER_HIDE');
        }
      }, {
        label: 'Workboots', command: () => {
          this.fetchItem('SHOES_GATHERER_HIDE');
        }
      }]
    }, {
      label: 'Miner', items: [{
        label: 'Grab', command: () => {
          this.fetchItem('HEAD_GATHERER_ORE');
        }
      }, {
        label: 'Backpack', command: () => {
          this.fetchItem('BACKPACK_GATHERER_ORE');
        }
      }, {
        label: 'Cap', command: () => {
          this.fetchItem('HEAD_GATHERER_ORE');
        }
      }, {
        label: 'Workbooks', command: () => {
          this.fetchItem('SHOES_GATHERER_ORE');
        }
      }]
    }, {
      label: 'Quarrier', items: [{
        label: 'Grab', command: () => {
          this.fetchItem('HEAD_GATHERER_ROCK');
        }
      }, {
        label: 'Backpack', command: () => {
          this.fetchItem('BACKPACK_GATHERER_ROCK');
        }
      }, {
        label: 'Cap', command: () => {
          this.fetchItem('HEAD_GATHERER_ROCK');
        }
      }, {
        label: 'Workbooks', command: () => {
          this.fetchItem('SHOES_GATHERER_ROCK');
        }
      }]
    }, {
      label: 'Lumberjack', items: [{
        label: 'Grab', command: () => {
          this.fetchItem('HEAD_GATHERER_WOOD');
        }
      }, {
        label: 'Backpack', command: () => {
          this.fetchItem('BACKPACK_GATHERER_WOOD');
        }
      }, {
        label: 'Cap', command: () => {
          this.fetchItem('HEAD_GATHERER_WOOD');
        }
      }, {
        label: 'Workbooks', command: () => {
          this.fetchItem('SHOES_GATHERER_WOOD');
        }
      }]
    }]
  }, {
    label: 'Laborers', items: [{
      label: 'Cropper',
    }, {
      label: 'Fisherman',
    }, {
      label: 'Gamekepper',
    }, {
      label: 'Fletcher',
    }, {
      label: 'Imbuer',
    }, {
      label: 'Mercenary',
    }, {
      label: 'Prospector',
    }, {
      label: 'Stonecutter',
    }, {
      label: 'Tinker',
    }, {
      label: 'Blacksmith',
    }, {
      label: 'Lumberjack',
    }]
  }, {
    label: 'Luxury Goods', items: [{
      label: 'Any',
    }, {
      label: 'Bridfewatch',
    }, {
      label: 'Caerleon',
    }, {
      label: 'Fort Sterling',
    }, {
      label: 'Lymhurst',
    }, {
      label: 'Martlock',
    }, {
      label: 'Thetford',
    }]
  }, {
    label: 'Magic', items: [{
      label: 'Arcane', command: () => {
        this.fetchItem('ARCANESTAFF');
      }
    }, {
      label: 'Cursed', command: () => {
        this.fetchItem('CURSEDSTAFF');
      }
    }, {
      label: 'Fire', command: () => {
        this.fetchItem('FIRESTAFF');
      }
    }, {
      label: 'Frost', command: () => {
        this.fetchItem('FROSTSTAFF');
      }
    }, {
      label: 'Holy', command: () => {
        this.fetchItem('HOLYSTAFF');
      }
    }, {
      label: 'Nature', command: () => {
        this.fetchItem('NATURESTAFF');
      }
    }, {
      label: 'Shapeshifter', command: () => {
        this.fetchItem('SHAPESHIFTER');
      }
    }]
  }, {
    label: 'Materials', items: [{
      label: 'Essence', command: () => {
        this.fetchItem('ESSENCE');
      }
    }, {
      label: 'Other',
    }, {
      label: 'Relic', command: () => {
        this.fetchItem('RELIC');
      }
    }, {
      label: 'Rune', command: () => {
        this.fetchItem('RUNE');
      }
    }, {
      label: 'Avalonian Shards',
    }, {
      label: 'Crystal Shards',
    }, {
      label: 'Soul', command: () => {
        this.fetchItem('SOUL');
      }
    }]
  }, {
    label: 'Melee', items: [{
      label: 'Axe', command: () => {
        this.fetchItem('MAIN_AXE');
      }
    }, {
      label: 'Dagger', command: () => {
        this.fetchItem('MAIN_DAGGER');
      }
    }, {
      label: 'Hammer', command: () => {
        this.fetchItem('MAIN_HAMMER');
      }
    }, {
      label: 'War Gloves', command: () => {
        this.fetchItem('KNUCKLES');
      }
    }, {
      label: 'Mace', command: () => {
        this.fetchItem('MAIN_MACE');
      }
    }, {
      label: 'Quaterstaff', command: () => {
        this.fetchItem('QUARTERSTAFF');
      }
    }, {
      label: 'Spear', command: () => {
        this.fetchItem('MAIN_SPEAR');
      }
    }, {
      label: 'Sword', command: () => {
        this.fetchItem('MAIN_SWORD');
      }
    }]
  }, {
    label: 'Mount', items: [{
      label: 'Armored Horse', command: () => {
        this.fetchItem('MOUNT_ARMORED_HORSE');
      }
    }, {
      label: 'Battle Mount',
    }, {
      label: 'Swiftclaw', command: () => {
        this.fetchItem('MOUNT_COUGAR');
      }
    }, {
      label: 'Direboar', command: () => {
        this.fetchItem('MOUNT_DIREBOAR');
      }
    }, {
      label: 'Direwolf', command: () => {
        this.fetchItem('MOUNT_DIREWOLF');
      }
    }, {
      label: 'Stag/Mose',
    }, {
      label: 'Mule', command: () => {
        this.fetchItem('MOUNT_MULE');
      }
    }, {
      label: 'Ox', command: () => {
        this.fetchItem('MOUNT_OX');
      }
    }, {
      label: 'Rare Mount',
    }, {
      label: 'Riding Horse', command: () => {
        this.fetchItem('MOUNT_HORSE');
      }
    }, {
      label: 'Swamp Dragon', command: () => {
        this.fetchItem('SWAMPDRAGON');
      }
    }]
  }, {
    label: 'Off-Hand', items: [{
      label: 'Book', command: () => {
        this.fetchItem('OFF_BOOK');
      }
    }, {
      label: 'Horn', command: () => {
        this.fetchItem('OFF_HORN');
      }
    }, {
      label: 'Orb', command: () => {
        this.fetchItem('OFF_ORB');
      }
    }, {
      label: 'Shield', command: () => {
        this.fetchItem('OFF_TOTEM');
      }
    }, {
      label: 'Torch', command: () => {
        this.fetchItem('OFF_TORCH');
      }
    }, {
      label: 'Totem', command: () => {
        this.fetchItem('OFF_TOTEM');
      }
    }]
  }, {
    label: 'Other', items: [{
      label: 'Mission Item',
    }, {
      label: 'Other',
    }, {
      label: 'Trash', command: () => {
        this.fetchItem('TRASH');
      }
    }]
  }, {
    label: 'Product', items: [{
      label: 'Animal',
    }, {
      label: 'Cooked',
    }, {
      label: 'Farming', command: () => {
        this.fetchItem('FARM');
      }
    }, {
      label: 'Journals', command: () => {
        this.fetchItem('CONTRACT');
      }
    }]
  }, {
    label: 'Ranged', items: [{
      label: 'Bow', command: () => {
        this.fetchItem('BOW');
      }
    }, {
      label: 'Crossbow', command: () => {
        this.fetchItem('CROSSBOW');
      }
    }]
  }, {
    label: 'Resource', items: [{
      label: 'Base', items: [{
        label: 'Fiber', command: () => {
          this.fetchItem('_FIBER');
        }
      }, {
        label: 'Hide', command: () => {
          this.fetchItem('_HIDE');
        }
      }, {
        label: 'Ore', command: () => {
          this.fetchItem('_ORE');
        }
      }, {
        label: 'Stone', command: () => {
          this.fetchItem('_ROCK');
        }
      }, {
        label: 'Wood', command: () => {
          this.fetchItem('_WOOD');
        }
      }]
    }, {
      label: 'Processed', items: [{
        label: 'Cloth', command: () => {
          this.fetchItem('_CLOTH');
        }
      }, {
        label: 'Leather', command: () => {
          this.fetchItem('_LEATHER');
        }
      }, {
        label: 'Metal Bar', command: () => {
          this.fetchItem('_METALBAR');
        }
      }, {
        label: 'Stone Block', command: () => {
          this.fetchItem('_STONEBLOCK');
        }
      }, {
        label: 'Planks', command: () => {
          this.fetchItem('_PLANKS');
        }
      }]
    }]
  }, {
    label: 'Tome', items: [{
      label: 'Tome of Insight',
    }, {
      label: 'Fiber Harvester Tomes',
    }, {
      label: 'Animal Skinner Tomes',
    }, {
      label: 'Ore Miner Tomes',
    }, {
      label: 'Quarrier Tomes',
    }, {
      label: 'Lumberjack Tomes',
    }]
  }, {
    label: 'Token', items: [{
      label: 'Arena Sigil',
    }, {
      label: 'Crystal League Token',
    }, {
      label: 'Event',
    }, {
      label: 'Map',
    }, {
      label: 'Other',
    }, {
      label: 'Royal Sigil',
    }]
  }, {
    label: 'Tool', items: [{
      label: 'Demolition Hammer', command: () => {
        this.fetchItem('TOOL_SIEGEHAMMER');
      }
    }, {
      label: 'Fishing Rod', command: () => {
        this.fetchItem('TOOL_FISHINGROD');
      }
    }, {
      label: 'Pickaxe', command: () => {
        this.fetchItem('TOOL_PICK');
      }
    }, {
      label: 'Sickle', command: () => {
        this.fetchItem('TOOL_SICKLE');
      }
    }, {
      label: 'Skinning Knife', command: () => {
        this.fetchItem('TOOL_KNIFE');
      }
    }, {
      label: 'Stone Hammer', command: () => {
        this.fetchItem('TOOL_HAMMER');
      }
    }, {
      label: 'Tracking Toolkit', command: () => {
        this.fetchItem('TOOL_TRACKING');
      }
    }, {
      label: 'Wood Axe', command: () => {
        this.fetchItem('TOOL_AXE');
      }
    }]
  }, {
    label: 'Trophies', items: [{
      label: 'Fiber',
    }, {
      label: 'Fishing',
    }, {
      label: 'General',
    }, {
      label: 'Hide',
    }, {
      label: 'Mercenary',
    }, {
      label: 'Ore',
    }, {
      label: 'Stone',
    }, {
      label: 'Wood',
    }]
  }];

  pricesList: { [key: string]: PricesList[] } = {};

  private http = inject(HttpClient)

  async fetchItem(item: string) {

    this.selectedItem = []

    try {
      this.selectedItem = await firstValueFrom(this.http.get<Item[]>(`http://127.0.0.1:3909/getItems?item=${item}`));

      let reqString = ""
      this.pricesList = {}

      this.selectedItem.forEach((item: Item) => {
        reqString += item._id + ","
      })

      let data = await firstValueFrom(this.http.get<PricesList[]>(`http://127.0.0.1:3909/getItemsPrices?items=${reqString}`));

      data.forEach(value => {

        if (this.pricesList[value.item_id] === undefined) {
          this.pricesList[value.item_id] = []
        }

        value.cityLong = value.city
        value.city = value.city.replace(" Market", "")

        value.lastTime = new Date(value.lastTime).toLocaleString()

        this.pricesList[value.item_id].push(value)
      })

      console.log(this.pricesList)

    } catch (error) {
      console.error('Failed to fetch prices:', error);
      return;
    }
  }
}

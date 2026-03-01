export enum WeaponName {
  // Assault Rifles
  M4 = "M4",
  AK47 = "AK47",
  SCAR = "SCAR",
  Famas = "Famas",

  // SMG
  Vector = "Vector",
  Viper = "Viper",
  UMP45 = "UMP45",
  MP7 = "MP7",

  // Sniper
  Longbow = "Longbow",
  Phantom = "Phantom",
  Dragunov = "Dragunov",

  // Shotgun
  Nova = "Nova",
  Bulldog = "Bulldog",
  Reaper = "Reaper",

  // Pistol
  Sidearm = "Sidearm",
  Deagle = "Deagle",
  Revolver = "Revolver",

  // Heavy
  Bazooka = "Bazooka",
  GrenadeLauncher = "GrenadeLauncher",
  Minigun = "Minigun",
}
export enum WeaponCategory {
  Assault = "Assault",
  Sniper = "Sniper",
  Shotgun = "Shotgun",
  SMG = "SMG",
  Pistol = "Pistol",
  Heavy = "Heavy",
}

export enum WeaponRarity {
  Common = "Common",
  Uncommon = "Uncommon",
  Rare = "Rare",
  Epic = "Epic",
  Legendary = "Legendary",
  Mythic = "Mythic",
}
export enum AmmoType {
  Light = "Light",
  Heavy = "Heavy",
  Shell = "Shell",
  Sniper = "Sniper",
  Rocket = "Rocket",
  Energy = "Energy",
}
export interface WeaponStats {
  damage: number;
  fireRate: number;
  accuracy: number;
  recoil: number;
  reloadTime: number;
  magazineSize: number;
  range: number;
}
export interface Weapon {
  id: string;
  name: WeaponName;
  category: WeaponCategory;
  rarity: WeaponRarity;
  ammoType: AmmoType;
  stats: WeaponStats;
  levelRequired: number;
  price: number;
}
export const weapons: Weapon[] = [
  {
    id: "w1",
    name: WeaponName.M4,
    category: WeaponCategory.Assault,
    rarity: WeaponRarity.Rare,
    ammoType: AmmoType.Light,
    levelRequired: 5,
    price: 3200,
    stats: {
      damage: 35,
      fireRate: 75,
      accuracy: 80,
      recoil: 40,
      reloadTime: 2.3,
      magazineSize: 30,
      range: 70,
    },
  },
  {
    id: "w2",
    name: WeaponName.Longbow,
    category: WeaponCategory.Sniper,
    rarity: WeaponRarity.Epic,
    ammoType: AmmoType.Sniper,
    levelRequired: 10,
    price: 5500,
    stats: {
      damage: 95,
      fireRate: 25,
      accuracy: 95,
      recoil: 85,
      reloadTime: 3.5,
      magazineSize: 5,
      range: 100,
    },
  },
  {
    id: "w3",
    name: WeaponName.Bazooka,
    category: WeaponCategory.Heavy,
    rarity: WeaponRarity.Legendary,
    ammoType: AmmoType.Rocket,
    levelRequired: 15,
    price: 10000,
    stats: {
      damage: 150,
      fireRate: 10,
      accuracy: 60,
      recoil: 100,
      reloadTime: 4.5,
      magazineSize: 1,
      range: 90,
    },
  },
];

type ShoeSizes = 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 | 51 | 52;
type ShirtSizesAlpha = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL';
type ShirtSizesEU = 44 | 46 | 48 | 50 | 52 | 54 | 56 | 58 | 60 | 62;
type TrouserSizes = 34 | 36 | 38 | 40 | 42 | 44 | 46 | 48 | 50 | 52 | 54 | 56 | 58 | 60 | 62;
type GloveSizes = 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface ClothingSizes {
  shoe?: ShoeSizes;
  shirt?: ShirtSizesAlpha | ShirtSizesEU;
  trousers?: TrouserSizes;
  jacket?: ShirtSizesAlpha | ShirtSizesEU;
  gloves?: GloveSizes;
  jumper?: ShirtSizesAlpha | ShirtSizesEU;
}
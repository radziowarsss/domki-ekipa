export interface Offer {
  n: string;   // nazwa
  w: string;   // województwo (kod)
  r: string;   // region
  loc: string; // lokalizacja + jezioro
  tT: string;  // dojazd z Torunia
  tI: string;  // dojazd z Inowrocławia
  cap: string; // pojemność
  one: string; // 'tak' | 'potw' | 'luka'
  price: string;
  pn: number;  // cena numerycznie (0 = nieznana)
  tmin: number; // dojazd w minutach (min z dwóch miast)
  balia: number; // 0/1
  jez: number;   // 0/1
  tel: string;
  link: string;
  note: string;
  feat: number;  // 0/1 TOP
}

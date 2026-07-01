// Uzupełnia tmin (dojazd w minutach) dla ofert z tmin==0 — szacunek wg regionu/lokalizacji.
import { readFileSync, writeFileSync } from 'node:fs';

const F = 'src/data/offers.json';
const offers = JSON.parse(readFileSync(F, 'utf8'));

const R = [
  [/koronowsk/i, 60],
  [/brodnick/i, 75],
  [/tuchol|bory/i, 70],
  [/w[łl]oc[łl]awsk|gostyni[ńn]/i, 55],
  [/powidz|skorz[ęe]cin|gniezn/i, 60],
  [/[śs]lesin|konin|mikorzyn|liche[ńn]|wilczyn|anastazew|skulsk/i, 70],
  [/pa[łl]uk|[żz]nin|chomi[ąa][żz]|g[ąa]saw|biskupin|wenecj|dobrylew/i, 55],
  [/kaszub|charzyk|wdzydz|brus|wiele|golubie|swornegac/i, 130],
  [/i[łl]awsk|jeziorak|siemiany|ostr[óo]da|jab[łl]onk|makowo/i, 120],
  [/p[łl]ock|soczewk|[łl][ąa]ck|matyld[óo]w|zdwor|grabina/i, 105],
  [/uniej[óo]w|jeziorsko|turek|p[ęe]czniew|popow|spycimierz/i, 100],
  [/kruszwic|inowroc[łl]aw|gop[łl]o|gniewkow|pako[śs][ćc]/i, 20],
];
const W = { 'warm-maz': 120, pomorskie: 130, mazowieckie: 105, lodzkie: 100, wielkopolskie: 70, 'kuj-pom': 70 };

function est(o) {
  const s = String(o.r || '') + ' ' + String(o.loc || '');
  for (const [re, min] of R) if (re.test(s)) return min;
  if (o.w && W[o.w]) return W[o.w];
  return 90;
}

let n = 0;
for (const o of offers) {
  if (!o.tmin || Number(o.tmin) === 0) { o.tmin = est(o); n++; }
}
writeFileSync(F, JSON.stringify(offers, null, 2), 'utf8');
console.log('[fix-tmin] uzupelniono tmin dla ' + n + ' ofert z ' + offers.length);

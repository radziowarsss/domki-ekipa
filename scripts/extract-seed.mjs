// Wyciąga tablicę DATA z domki-weekend.html i zapisuje jako src/data/offers.json
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';

const SRC = 'C:/Users/radzi/Downloads/domki-weekend.html';
const OUT = 'src/data/offers.json';

try {
  if (!existsSync(SRC)) {
    console.warn('[seed] Brak pliku źródłowego:', SRC, '— zostawiam istniejący offers.json');
    process.exit(0);
  }
  const html = readFileSync(SRC, 'utf8');
  const start = html.indexOf('const DATA=');
  if (start === -1) throw new Error('Nie znaleziono "const DATA=" w HTML');
  const arrStart = html.indexOf('[', start);
  const arrEnd = html.indexOf('];', arrStart);
  const arrText = html.slice(arrStart, arrEnd + 1); // do zamykającego ]
  // Trusted local content — ewaluujemy literał tablicy JS do obiektów:
  const data = Function('return (' + arrText + ')')();
  if (!Array.isArray(data) || data.length === 0) throw new Error('Pusta tablica DATA');
  mkdirSync('src/data', { recursive: true });
  writeFileSync(OUT, JSON.stringify(data, null, 2), 'utf8');
  console.log('[seed] OK:', data.length, 'ofert ->', OUT);
} catch (e) {
  console.error('[seed] Błąd:', e.message, '— zostawiam istniejący offers.json');
  // Nie wywalamy builda; jeśli offers.json istnieje, użyjemy go.
  if (!existsSync(OUT)) {
    mkdirSync('src/data', { recursive: true });
    writeFileSync(OUT, '[]', 'utf8');
  }
}

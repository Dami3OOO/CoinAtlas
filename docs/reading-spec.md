# CoinAtlas · BTC|ETH Ratio · Reading-Spezifikation

Stand: 15.11.2026. Diese Datei ist die gemeinsame Grundlage für alle Chats, die an CoinAtlas arbeiten.
Wer am Reading oder am BTC|ETH-Ratio-Tab etwas ändert, liest sie zuerst und hält sie aktuell.

## Ziel

Das Ratio stellt fest, welches der beiden Assets gegenüber dem anderen überbewertet ist. Daraus entstehen zwei Arten von Empfehlungen:

1. **Swaps** mit der überbewerteten Seite in die andere, nur an den großen, seltenen Punkten. Qualität vor Menge.
2. **Käufe** mit USDC in Fear und Extreme Fear, immer die günstigere Seite.

Sonst sagt das Reading bewusst, dass heute nichts zu tun ist. Es spielt keine Rolle, mit welchem Asset man endet: Jede gewonnene Runde vergrößert den gesamten Bestand.

## Formel (unverändert)

- Year Line: Median der letzten 365 Tage.
- All Time Line: gewichteter Median der ganzen Historie, ein Tag verliert alle 4 Jahre die Hälfte seines Gewichts.
  Getestet und verworfen: Cycle Line (Median der letzten 4 Jahre), Halbwertszeiten von 2, 3, 6 und 8 Jahren,
  "einmal halbieren und dann fest", ganz ohne Abwertung. 2 bis 4 Jahre funktionieren, 4 Jahre lieferte das beste Ergebnis.
- Punkte: jede Linie Mild 1 / Strong 2 / Extreme 3 (Abstand 10 / 35 / 70 %), Season 1, Dominance 1. Maximal 8.
- Uncertainty Marks und Certainty Mark wie bisher. Eine Gewichtungs-Suche (Season, Dominance, Fear & Greed stärker gewichtet) war schlechter.

## Phase

- **Linien-Abstand** = Year Line / All Time Line − 1, in %.
- **BTC-Phase:** Year Line über der All Time Line. **ETH-Phase:** darunter.
- **Neutral-Zone der Linien:** Abstand innerhalb ±10 %. Die Year Line war bisher dreimal länger dort
  (Jan–Feb 2019, Feb–Sep 2021, Jul 2023–Dez 2024), und jedes Mal folgte ein Seitenwechsel.
  Das Reading meldet deshalb beim Eintritt einen beginnenden Phasenwechsel.
- Seitenwechsel bisher: 29.01.2019 (zu BTC), 10.05.2021 (zu ETH), 15.04.2024 (zu BTC).
- Beobachtung des Nutzers (Kontext, kein Auslöser): Durchschnitts-Ratio pro Kalenderjahr
  2017–2018 ETH, 2019–2020 BTC, 2021–2024 ETH, 2025–2026 BTC. These: 2 BTC-Jahre, dann 4 ETH-Jahre.
  Ende des 2. BTC-Jahres lag der Linien-Abstand 2020 bei +21 %, 2026 bei +22 %.

## Haupt-Reading: Swap

Das Reading führt seine eigene Spur (beginnend in BTC) und weiß dadurch, ob seine letzte Empfehlung noch läuft.

- **Stufe A** (Ende eines alten BTC-Laufs) → BTC in ETH:
  Score ≥ +4 UND Linien-Abstand ≥ +40 % UND Fear & Greed ≤ 44.
- **Stufe B** (Rückkehr nach einem alten ETH-Lauf) → BTC in ETH:
  Score ≥ +2 UND Linien-Abstand ≤ −20 %.
- **Rückweg** → ETH in BTC: Ratio liegt mindestens 10 % unter der Year Line (die Year Line bewertet ETH als überbewertet).
  Gilt unabhängig vom Score: Die All Time Line reagiert langsam und zeigt dann oft noch BTC.
- Während eine Empfehlung läuft, sagt das Reading "ETH halten" und nennt den Punkt für den Rückweg.
- Ergebnis auf der Historie (Start 01.01.2019 mit 0,1 BTC, 0,3 % Gebühr pro Swap): ×4,35, 6 Runden, alle im Plus,
  schlechteste +2 %. Über 72 Startdaten Median ×2,58, nie unter "nur halten".
  Runden: 2020-01 +45 %, 2020-05 +15 %, 2022-06 +45 %, 2025-06 +65 %, 2025-11 +8 %, 2025-12 +2 %.
- Grenzen: Stufe B beruht auf einem einzigen Ereignis (Sommer 2022). Mit Score +1 statt +2 kippt sie (Dezember 2022, −51 %).
  2021 (+263 % möglich, Einstieg in Extreme Greed) ist mit keiner sauberen Regel erreichbar.

## Haupt-Reading: Kauf

- Fear oder Extreme Fear (≤ 44): Kauf mit USDC, und zwar die günstigere Seite (nicht die überbewertete).
  Stärker formuliert, wenn diese Seite in den letzten 90 Tagen auch stärker gefallen ist.
  Messung: günstige Seite in Fear ab Strong war nach einem Jahr an 72 % der Tage besser, mit beiden Hinweisen 78 %.
- Ohne Lean in Fear: Kauf dessen, was man schon hält.
- Greed: USDC behalten und auf Fear warten.

## Extreme Windows (Kontext, kein Auslöser)

Jahrestyp nach Kalender (Jahr mod 4): 1 = Bull, 2 = Bear, sonst Bridge. Ein Fenster ist 2 Monate lang und existiert nur,
wo jedes Jahr dieses Typs ein Extrem der Formel hatte:

- Bridge (2019, 2020, 2023, 2024): **Jan–Feb**. Auch am echten Tageshoch/-tief 4 von 4.
- Bear (2018, 2022, 2026): **Jun–Jul** und **Sep–Okt**.
- Bull (2021, 2025): **Mär–Apr**.

Das Reading nennt das Fenster, wenn heute darin liegt. Ein Strong-Signal ohne Swap-Empfehlung heißt im Fenster "worth watching".
Getestet und verworfen: Fenster als Auslöser (×0,85 statt ×4,35). Das Fenster sagt, wann ein Extrem kam,
nicht ob es schon da war und nicht die Richtung. Bull-Fenster: ausgelassene Signale endeten 0 von 2 Phasen im Plus.

## Text-Regeln

- Das Reading beginnt mit der Empfehlung, danach höchstens drei Fakten. Keine Statistiken, keine Prozentzahlen im Reading selbst.
- Jede Aussage im Reading bekommt im aufklappbaren Teil eine eigene W-Frage ("What is …", "Why …", "How …") mit den Zahlen des Tages.
  Ändert sich das Reading, ändern sich die Fragen.
- Nie "swap back" oder "If you swapped". Ein Swap ist immer ein normaler Swap: "Now is a good time to swap ETH into BTC."

## Dev-Hindsight

Zeigt, was nach dem gewählten Tag wirklich passiert ist, und beginnt mit einem Urteil, ob das Reading richtig lag.

## Entfernt

- Extra Reading für Mini-Swaps (7 % in 90 Tagen) samt Schalter.
- Die 17-%-Regel, die Greed-Bremse und die Regel "junge Overvaluation", ersetzt durch Stufe A und B.

## UI

- Ratio-Chart: Year Line und All Time Line immer sichtbar, keine Umschalt-Buttons. Ein senkrechter Pfeil zwischen beiden zeigt den Linien-Abstand in %.
- Valuation · Live ist entfernt (das war die erste Version des Readings).
- Past Years: jede Jahresbox ist schwach getönt, blau für ein BTC-Jahr, orange für ein ETH-Jahr (Jahresdurchschnitt gegen die heutige All Time Line).
  Ganz oben steht immer das kommende Jahr mit Jahrestyp, erwarteter Phase (These 2 BTC / 4 ETH) und seinen Extreme Months.
  Das kommende Jahr lässt sich aufklappen und zeigt seine Extreme Months, rechts steht "ETH Year · Expected".
  Ein runder ?-Knopf neben dem Titel "Past Years" erklärt Jahrestypen, Phasen, Neutral-Zone und Extreme Months. Fenster-Monate tragen einen weißen Monatsnamen.
- Explanation-Knopf: zentriert, ohne Pfeil, beim Überfahren dunkelgrau. Im Text steht "median" statt "middle".
- Settings breiten sich in Spalten aus.
- Coin-Liste: Rang-Pfeile (grün/rot), wenn ein Coin seit dem Snapshot von gestern auf- oder abgestiegen ist. In den Settings abschaltbar.
- Coin-Liste: Knopf "Years Ago" im Header (1 bis 8 Jahre). Sie zeigt den Binance-Tagesschluss
  (Paar SYMBOL/USDT) am selben Kalendertag vor X Jahren und daneben die Veränderung bis heute. Grenzen:
  "This Asset didn't exist X Years Ago" bedeutet genau genommen, dass das Paar auf Binance erst später gehandelt wurde.
  Ohne Binance-Paar steht "No price data from X years ago". USDT gilt immer als 1 $. Auto-Update lässt die Preise von damals stehen.
- Coin-Liste: Rang-Pfeile vergleichen mit dem Snapshot vom Vortag (UTC, data/snapshots/JJJJ-MM-TT.json). Schalter "Rank Change Arrows".

## Nachgeprüft

Das Reading der Seite, Tag für Tag mit nur den Daten des Tages gelesen, ergibt seit 2019 genau die 6 Runden oben und 0,4345 BTC.
Verteilung der Tage: 1.466 nichts zu tun, 1.189 Kauf in Fear, 209 ETH halten, 6 Swaps in ETH, 6 Swaps in BTC.

## Geprüft und verworfen (15.11.2026)

- Rückweg tiefer unter der Year Line: 12 % ×3,51, 15 % ×3,68, 20 % ×1,23 (gegen 10 % ×4,35). Tiefere Rückwege lassen Runden offen hängen.
- Tranchen (je ein Drittel bei verschiedenen Linien-Abständen): ×1,91 bis ×3,46, alle Runden weiter im Plus, aber weniger Ertrag.
- Stufe A schon ab 30 % Abstand: ×2,35, eine Runde −14 %.

## Held asset, Kauf-Satz, Extreme-Window-These (gebaut 15.11.2026)

- Solange keine Antwort da ist, ist das Reading ausgegraut und verschwommen, in der Mitte steht "Which asset are you holding right now?" mit Bitcoin / Ethereum.
  Nach der Antwort wird das Reading mit einer Animation sichtbar. Rechts neben dem Titel steht dann "Change Asset". Die Antwort gilt für den UTC-Tag (localStorage "coinatlas-holding").
  - BTC-Halter: "Now is a good time to swap BTC into ETH." bei Stufe A/B, sonst "Today is not a day to swap."
  - ETH-Halter: "Now is a good time to swap ETH into BTC." sobald das Ratio 10 % unter der Year Line liegt, sonst "Today is not a day to swap."
  - Ohne Antwort: die eigene Spur (nur deren Swap-Tage), sonst "Today is not a day to swap." "Hold your ETH" gibt es nicht mehr.
- Zweiter Satz, je nach Fear & Greed:
  - Fear / Extreme Fear: "It's currently a good time to buy Ethereum, amidst this period of Extreme Fear." (die günstigere Seite;
    ohne Lean "…to add to what you already hold, amidst this period of Fear.")
  - Greed / Extreme Greed: "You should hold onto your USDC, amidst this period of Greed."
  - Neutral direkt nach Greed: "Prepare your USDC for the next period of Fear." Messung seit 2018: 9 von 13 solcher Neutral-Abschnitte
    gingen weiter in Fear, erster Fear-Tag im Median nach 8 Tagen (in drei von vier Fällen innerhalb von 28 Tagen).
    Neutral nach Fear: 17 von 29 gingen zurück in Fear, dafür gibt es keinen Satz.
  - Sonst Neutral: nichts zum Kauf.
- Strong-Lean (Score ab 3) im Extreme Window ohne Swap, auf der Seite des Halters: "Swapping X into Y would be a good idea right now
  if you believe in the Extreme Window thesis." Explanation: "What is an Extreme Window?" und "Why could a swap inside an Extreme Window be a good idea?"
  mit den gemessenen Zahlen (innen etwa 7 von 10 im Plus, außen etwa 6 von 10, Bear-Fenster alle, Bull-Fenster keiner).
- Hindsight nach einem Kauf: der höchste Wert danach ("Afterwards the highest value of ETH was $X on <Datum>, a +Y% gain") statt des heutigen Werts,
  verglichen mit dem höchsten Wert der anderen Seite.

## Fear & Greed nach Jahrestyp (Messung 16.11.2026, Daten seit Februar 2018)

- Bear Years (2018, 2022, 2026): 72 bis 93 % der Tage in Fear, praktisch nie Extreme Greed. Juni ist der tiefste Monat (Ø 18; 26, 11, 16),
  passend zum Bear-Fenster Jun–Jul.
- Bull Years (2021, 2025): Januar in Greed (81, 72), Ende des Jahres in Fear (Dezember 29 und 22).
- Bridge Years: zweites Bridge-Jahr endet in Extreme Greed (2020 Nov/Dez 86/92, 2024 80/76). Das erste Bridge-Jahr ist gemischt
  (2019 endete in Fear, 2023 in Greed).
- Extreme folgen meist auf Extreme derselben Seite: nach Extreme Fear kam als nächstes Extrem 30-mal wieder Extreme Fear und 4-mal Extreme Greed.
- Alle Jahrestyp-Muster beruhen auf 2 bis 4 Jahren pro Typ. Kontext, keine Regel.

## Charts (Etappe 1 gebaut 18.11.2026)

- Knopf "Charts" im Header öffnet ein Vollbild. Zuerst wählt man das Asset aus einer gruppierten Liste mit Kurzbeschreibung, erst dann erscheint der Chart.
- Zeiteinheiten 1m, 3m, 5m, 15m, 1h, 4h, 1D, 1W, 1M (die zuletzt gewählte wird gemerkt). Live-Update alle 5 Sekunden, ältere Kerzen beim Scrollen nach links.
- Assets: BTCUSDT.P, ETHUSDT.P, TRXUSDT.P, POLUSDT.P, RENDERUSDT.P, SANDUSDT.P (Bitget USDT-Futures), BTCETH (Bitget Spot ETHBTC, umgedreht),
  Gruppe "Currencies" (früher "Binance"): BTCUSD, BTCEUR, BTCCHF (siehe unten), TOTAL200 / BTC.D / USDT.D (hauseigen aus den Snapshots, nur 1D/1W/1M, Daten ab 12.11.2026),
  WALCL (FRED, wöchentlich, 1W/1M, vom Snapshot-Job geholt nach data/fred-walcl.json).
- dominance.json hat als 6. Wert den USDT-Anteil an der Top-200-Marktkapitalisierung.
- Aussehen (Standard, über das Zahnrad "Chart settings" änderbar und im Browser gespeichert): Hintergrund #FFE0B2, keine Gitterlinien,
  Fadenkreuz schwarz gestrichelt, Körper grün #43b147 / rot #F23645, Ränder und Dochte schwarz, keine Hoch-/Tief-Markierungen, keine Linie für den
  letzten Preis. Schrift wie TradingView (Trebuchet MS), schwarze Achsenlinien, Zeitachse mit Tagen und Monatsnamen, Fadenkreuz-Beschriftung
  schwarz mit weißer Schrift ("Mon Nov 16, 2026   03:00"). Preisachse mit runden Schritten etwa alle 30 Pixel.
- Letzter Preis als Schild auf der Preisachse mit Restzeit bis zum Schließen der Kerze.
- Bitgets normaler Abruf liefert für 1W nur rund 13 Wochen; ältere Kerzen kommen beim Zurückscrollen über history-candles.
  Bitget misst dort endTime am Ende einer Kerze, deshalb fragt die Seite bis zur Mitte der ersten bekannten Kerze und behält nur, was davor liegt.
  Vorher fiel an dieser Nahtstelle eine Kerze heraus (Woche vom 17.08.2026).
- Fehlen in den Daten der Börse Kerzen, werden sie aus der nächstkleineren Zeiteinheit derselben Börse zusammengesetzt
  (1W und 1M aus 1D, 1D und 4h aus 1h, 1h aus 15m, 15m aus 5m, 5m und 3m aus 1m; höchstens zehn Lücken pro Abruf, die neuesten).
  Das gilt beim ersten Laden und bei jedem Nachladen beim Zurückscrollen.
  Oben rechts steht dann "N missing candles built from 1D". Was sich so nicht füllen lässt: "N candles missing from the exchange".
- Kerzen werden auf ganze Bildschirmpixel gezeichnet (eigene "rect"-Figur), sonst wirken sie bei 125 % Skalierung unscharf.
- Beim Wechsel der Zeiteinheit bleibt der Zeitpunkt am rechten Rand erhalten, notfalls werden ältere Kerzen nachgeladen.
- "Copy settings" kopiert die eigenen Einstellungen. Wer sie an Claude schickt, bekommt sie als Standard der Seite (CH_DEF in index.html).
- Kein Auto-Fit der Preisachse: Der Chart lässt sich frei nach oben und unten ziehen. Zoomen hält immer den rechten Rand fest, egal wo die Maus steht.
- Rechtsklick öffnet das Preisachsen-Menü: Reset price scale (Alt+R), Auto (fits data to screen), Invert scale (Alt+I),
  Regular / Percent (Alt+P) / Logarithmic (Alt+L), Move scale to left/right, Last price line, More settings.
  Nicht übernommen aus TradingView: Lock price to bar ratio, Scale price chart only, Indexed to 100, Labels, Plus button.
- Bibliothek: KLineChart 9.8.12 (Apache 2.0), unverändert in index.html eingebettet, mit NOTICE als Kommentar.
- Bitget-Zeiteinheiten werden mit Ausweich-Namen versucht (1Dutc, dann 1D usw.), weil die genauen Namen nicht getestet werden konnten.
- Weggelassen: DXY, JXY, BTC1!, NQ1! (lizenzpflichtige Börsendaten), kein TradingView-Embed, keine geschätzte Historie.
- CoinAtlas Currency Pairs (20.11.2026, ersetzt die Gruppe "Currencies"): BTCUSD von Bitstamp (btcusd), wenn Bitstamp nicht antwortet Binance BTCUSDT,
  ab 01.01.2018. BTCEUR und BTCCHF rechnet die Seite selbst: jede BTCUSD-Kerze mal EZB-Kurs USD→EUR bzw. USD→CHF desselben Tages
  (Frankfurter, an Wochenenden und Feiertagen der letzte bekannte). 1W und 1M werden aus den umgerechneten Tageskerzen gebaut.
  Oben rechts steht die Quelle, z. B. "CoinAtlas · Bitstamp BTC/USD × ECB EUR rate". Nur mit Nachbildungen getestet.
- Einheiten (20.11.2026): BTC.D und USDT.D zeigen auf Achse, Fadenkreuz, Preisschild und Kopfzeile "59.09%", TOTAL200 und WALCL in US-Dollar
  mit T/B/M ("2.142T"). Die Werte sind dafür in Dollar gespeichert (TOTAL200 roh, WALCL aus Millionen umgerechnet).
  Die Preisachse wird dort selbst auf die Breite der Beschriftung gesetzt, weil die Bibliothek sie an der rohen Zahl misst.
- CoinAtlas-Charts (TOTAL200, BTC.D, USDT.D, WALCL) als Kerzen statt blauer Fläche: jede Kerze öffnet beim Wert davor und schließt beim eigenen.
  In den Chart settings umschaltbar auf "Line" (schlichte Linie ohne Punkte, Farbe wählbar). Bei wenigen Werten werden die Kerzen breiter.
- Zeichenwerkzeuge (20.11.2026, zweite Fassung nach TradingView-Vorbild, Qualität vor Menge). Leiste links:
  Trend line (Extend none/left/right/both, Left/Right end Normal/Arrow, Preis-Labels auf der Skala, Stats mit Änderung, % und Kerzen),
  Horizontal line (Extend both/left/right, Preis-Label auf der Skala, Preis als Koordinate eingebbar),
  Vertical line (Extend both/up/down, Zeit-Label auf der Zeitachse),
  Rectangle (8 Griffe: Ecken und Kantenmitten, eine Kantenmitte bewegt nur ihre Kante; Rand, Hintergrund mit Deckkraft, Extend left/right,
  Middle line, Oben/Unten als Koordinaten; ausgewählt zeigt es Preis- und Zeitbereich auf den Achsen; Standardfarbe #9C27B0, 20 %),
  Fib retracement (TradingView-Stufen und Farben, 11 an und 12 zuschaltbar; Level 0 am zweiten Punkt; Trendlinie gestrichelt,
  Extend left/right, Reverse, Prices, Levels, Prozent, Labels links/rechts, Hintergrund mit Deckkraft; Fläche ist anklickbar),
  Date and price range (ersetzt Price label im Werkzeug-Menü): Box vom ersten zum zweiten Punkt mit Pfeilen, Label mit Änderung in Preis und %,
  Anzahl Kerzen und vergangener Zeit; blau steigend, rot fallend, Farben, Deckkraft, Label und Schriftgröße einstellbar. Alte Price labels bleiben sichtbar.
  Bedienung: Hand-Zeiger über einer Zeichnung; Box-Griffe an den Ecken rund, an den Kantenmitten eckig. Im Platzier-Modus wird das Fadenkreuz blau
  und es gibt keinen Punkt am Zeiger. Rechtsklick bricht das Platzieren ab. Strg (Mac: Cmd) gedrückt halten schaltet den Magneten zu.
  Das Preisachsen-Menü öffnet sich nur bei Rechtsklick auf die Preisachse.
  Magnet (Knopf oder Strg): fängt Fadenkreuz und Zeichnungspunkt im Umkreis von 18 px um Open/High/Low/Close ein und lässt erst nach 30 px los,
  eigene Umsetzung statt des Bibliotheks-Magneten. Tasten 1–6 wählen die Werkzeuge (Nummer klein unten rechts am Symbol).
  Leiste über einer ausgewählten Zeichnung mit Symbolen: Zahnrad (Einstellungen), Schloss (Lock), Mülleimer (Remove).
- Move to Landing Area (20.11.2026): Knopf in der Chart-Leiste links vom Zahnrad. Legt Asset + Zeiteinheit als Mini-Chart in die Landing Area
  (localStorage "coinatlas-minicharts"), mit den Zeichnungen des Assets (gesperrt), Live-Update alle 10 s, ohne Zoomen und Scrollen.
  Klick auf den Mini-Chart oder ⤢ öffnet ihn im Vollbild, ✕ entfernt ihn.
  Dazu Magnet, alle sperren, alle ausblenden, alle löschen. Ausgewählt: Leiste oben mit Farbe, Breite, Stil, ⚙, Lock, Remove.
  Doppelklick oder ⚙ öffnet die Einstellungen; Änderungen wirken sofort, "Save as default" gilt für neue Zeichnungen des Werkzeugs (chS.tdef).
  Entf/Backspace löscht, Esc schließt die Einstellungen oder bricht ein Werkzeug ab.
  Gespeichert pro Asset im Browser (localStorage "coinatlas-drawings") als Zeitpunkt + Preis plus Einstellungen, auf allen Zeiteinheiten an derselben Stelle.
  Die Zeitachse rechnet über die erste und neueste Kerze hinaus in Schritten der Zeiteinheit weiter, damit Zeichnungen in die Zukunft ihr Datum behalten.
  Zeichnungen der ersten Fassung werden beim Laden übernommen; Ray, Extended line, Parallel channel, Arrow und Text gibt es nicht mehr als Werkzeug.
  Noch nicht synchronisiert zwischen Geräten: kommt mit dem Account-System.
- Nächste Etappen: Long/Short mit RR, Rotated Rectangle, Account-System (Zeichnungen und Einstellungen geräteübergreifend).

## Settings (20.11.2026)

- Aufbau als Tabs (20.11.2026): links die Bereiche, rechts nur die Einstellungen des gewählten Bereichs; feste Größe 660 × 560 px,
  passt ohne Scrollen auf den Bildschirm; der zuletzt gewählte Bereich wird gemerkt. Auf schmalen Bildschirmen stehen die Bereiche oben.
- Reihenfolge: Header, Asset List, Locked Hovercharts, Fear & Greed Index, BTC|ETH Ratio (nur im Dev Mode, enthält Formula Date), Experimental.
- Header: Simple Market Sentiment Counter, je ein Schalter pro Header-Knopf (localStorage "coinatlas-header-hidden"), darunter breiter Knopf UI Moving Mode.
- Asset List: Main Source, Fallback Chart, List Range, Rank Change Arrows, Auto Update, Update Interval. Pulse Tint ist kein Schalter mehr
  (bleibt wie gespeichert, Standard an).
- Locked Hovercharts: Advanced Time Display ist standardmäßig an; darunter die Öffnungszeiten von London und New York (New Yorker und eigene Zeit).
- Linked Hover, Tint Strongest Months und Altcoin Dominance Line sind immer an und keine Schalter mehr.
- Experimental: Dev Mode, Party Mode.

## Customization (21.11.2026)

- Neuer Settings-Bereich "Customization" (vor Experimental) mit Unter-Tabs: Asset List (noch leer), Sentiment Squares (Skin ab +50 %, vorher unter
  Experimental), Portfolio Tint (Profit Tint grün/rot; Extra Tints ab "Starting at x % Profit" mit gewähltem Skin). Letzter Unter-Tab wird gemerkt.
- Skins als gemeinsame CSS-Klassen .fx .fx-<name>: Gold, Silver, Diamond, Emerald, Ruby, Sapphire (fließender Glanz, leichter Puls; Edelsteine mit Facetten,
  Diamond und Sapphire mit Funkeln). localStorage: "coinatlas-sq-fx", "coinatlas-pf-tint".

## Portfolio Manager: Allocation (21.11.2026)

- Breiter Knopf "Show Allocation" direkt unter der oberen Leiste (nicht im Edit-Modus); das Ringdiagramm öffnet sich unter der Asset-Liste.
  Höchstens 8 Stücke ab 2 %, alle Stablecoins zusammen als ein Stück "Stablecoins" in --stable-blue, Rest "Other". BTC orange, ETH blau. Legendenzeilen ohne Lücke
  (Hover springt direkt von Zeile zu Zeile, leerer Rand der Legende behält die Auswahl); Hover hebt Stück und Legende hervor und zeigt Name, % und Wert in der Mitte. Zustand gemerkt.
- Obere Leiste mit 4 Feldern: Total Balance, Stablecoins (Wert in Stablecoin-Blau, Anteil in % und Anzahl), Average Cost, Profit / Loss.
- Der Total-Balance-Chart öffnet sich einmalig von selbst, sobald zum ersten Mal ein Portfolio angezeigt wird (localStorage "top200-pf-total-shown").

## Sentiment Squares (21.11.2026, Rework, fertig)

- Jede Kachel ein Coin: Logo, darunter die Prozente; die Schrift schrumpft mit der Kachel (ab 6 px). Passt beides nicht, bleibt nur das Logo,
  damit man den Coin erkennt; die Zahl steht dann im Hover (Name immer im Hover), Fläche nach Bewegung (|%|^0,8 plus kleiner Sockel, damit ruhige Coins sichtbar bleiben),
  Farbe in 5 Stufen je Zeitraum (Grenzen z. B. 24H: 1/3/6/10 %). Grün links verankert, Rot rechts, jeweils als Squarified Treemap, der Stärkste außen.
- Sentiment Front: steht automatisch beim Flächenanteil der Gewinner. Beide Seiten sind fest angeordnet, die kleinere auf mindestens halber Breite.
  Die Front ist ein Fenster: Ziehen deckt Kacheln der einen Seite auf und die der anderen zu, ohne dass sich eine Kachel bewegt; sie hält dort an,
  wo eine Seite endet. "Auto" oder Doppelklick setzt sie zurück. "x% up" ist immer der echte Anteil der Coins.
- Animation: Kacheln, Front und Fenster gleiten bei jedem Update (alle 3 s) und Zeitraumwechsel an ihren Platz (1,1 s, weich auslaufend);
  Sprung >= 1/4 der ersten Farbstufe: kurzes Aufleuchten (1,6 s). Neuer Zeitraum oder neues Top: die Front geht zurück auf Auto,
  also genau ans Ende der dominanten Seite, die damit immer ganz sichtbar ist.
- Zeitraumwechsel: jede Kachel zeigt ihren eigenen Wert; sobald der neue da ist, springen die Kacheln gruppenweise (alle 0,22 s eine Handvoll,
  die stärksten zuerst) in den neuen Zeitraum, ohne auf den Rest zu warten. Wechselt ein Coin die Seite, fliegt er über die Front, die Farbe blendet über (1,4 s).
- Neue Kacheln erscheinen nicht auf einmal: alle 0,22 s eine Handvoll (mindestens 3, sonst 1/8 der wartenden, die stärksten zuerst), sie wachsen sanft auf.
- Größe gedeckelt bei 100 %: darüber wird eine Kachel nicht größer. Auswahl "Squares from +50%" (Settings > Customization > Sentiment Squares; Off oder ein Skin, Standard Off):
  Gold fließt und pulsiert golden, Diamond fließt eisig hellblau mit Facetten, Puls und einem Funkeln in der Ecke.
- Seitenwechsel: die Kachel fliegt auf der Flug-Ebene ihres neuen Fensters von ihrem alten zum neuen Platz und landet dann darin.
  Die Flug-Ebene läuft exakt mit der Front mit: fliegende Kacheln sind nur auf ihrer Seite der Linie sichtbar, die Linie deckt sie auf oder zu.
- Klick auf eine Kachel: die Liste scrollt zur Zeile des Coins und hebt sie hellgrau hervor wie die Suche. Locked Hovercharts öffnen von dort wie immer auf Today (1D).
- Bedienung: links "Top [1–200]" als Eingabefeld (Standard 200), rechts derselbe Zeitraum-Wähler wie bei den Locked Hovercharts:
  "grün / rot / blau" (steigende, fallende Coins, Stablecoins; wie der Simple Market Sentiment Counter) steht in der Zeile mit Top-Feld und
  Zeitraum-Wähler, genau unter dem Titel zentriert.
  Today (seit Tagesbeginn), 1H, 7D, 30D, 365D aus Coinpaprika tickers (eine Anfrage pro Minute), 4H aus Binance-5m-Kerzen (je Coin, alle 2 Minuten).
  Kein 24H (Today ersetzt es). Hand-Zeiger über den Kacheln.
  Stablecoins ausgelassen. Nur in der Landing Area (Vollbild verworfen, kommt eher mit der Mobile-Version). Einstellungen in localStorage "coinatlas-squares".

## Fear & Greed Index: Past Years (21.11.2026)

- Ersetzt "Average Monthly Index Value" und "Average Yearly Index Value". Eine Karte pro Jahr (neuestes oben) mit dem Durchschnitt aller Tage
  des Jahres (vorher: Durchschnitt der Monatsdurchschnitte, ohne laufenden Monat), Zyklus-Etikett und Farbe am Rand; Klick klappt die 12 Monate auf.
  Oben "All Years": jeder Kalendermonat über alle Jahre seit 2018. Mehrere Jahre gleichzeitig offen statt "Compare"; das laufende Jahr ist anfangs offen.
  Filter Bull / Bear / Bridge / All bleiben. Settings: ein Schalter "Show Past Years".
  Jahreszahl in der Farbe ihres Zyklus (Bull grün, Bear rot, Bridge orange). Oben das kommende Jahr (gestrichelt, "Upcoming", Zyklus schon bekannt),
  "All Years" ganz unten. In den Monaten (4 pro Reihe, 3 Reihen, wie im Ratio-Tab): der höchste Monat grün umrandet und getönt, der niedrigste rot; alle Monatsboxen gleich hoch.

## Portfolio Manager: Mehrere Wallets und Share (21.11.2026)

- Eingabe + "Save" (statt Load/Clear): Adresse wird in "top200-pf-wallets" gespeichert ([{addr, name, on, who}]), Eingabe wird geleert.
  Liste unter der Eingabe; beim Hover drei Knöpfe: Auge (ein-/ausblenden), Stift (Namen direkt in der Zeile tippen, Enter/Blur speichert, Esc bricht ab), X (entfernen).
- Alle eingeblendeten Wallets werden gescannt und zusammengezählt (gleiche Coins addiert, Chains vereinigt). Wallets, die nicht lesbar sind, stehen in der Fußnote.
  Swap-Suche über alle eingeblendeten EVM-Adressen. Durchschnittspreise gelten für alle Wallets zusammen (Schlüssel "wallets").
- Migration: die alte einzelne Adresse ("top200-pf-addr") wird zur ersten gespeicherten Wallet, ihre Durchschnittspreise/Käufe ziehen mit.
- Manuelles Portfolio ist nur angeboten, solange keine Wallet gespeichert ist; eine gespeicherte Wallet übernimmt.
- Stablecoins brauchen keinen Durchschnittspreis: pfAvgOf liefert ihren aktuellen Preis (Gewinn 0), die Zeile zeigt "Stable", kein Eingabefeld, kein Tint.
- Portfolio-Chart (Total und einzelne Assets): Zeitauswahl Today, 7D, 30D, 365D, All Time (intern 1D, 1W, 1M, 365D, ALL). Today bis 365D: Wert der
  heutigen Bestände am Anfang des Zeitraums gegen jetzt. All Time: der aktuelle Gewinn aus den Durchschnittspreisen (wie Profit / Loss), nicht der
  Anstieg seit dem ersten Kurs des Graphen; ohne Durchschnittspreise steht "Set Average Prices to see your gain".
- Hover-Charts wählen ihre Seite sofort: place() rechnet mit der Höhe eines vollen Charts (zuletzt gemessen, Start 330 px), auch solange
  "Loading chart…" angezeigt wird, und ein MutationObserver setzt die Position neu, sobald sich der Inhalt ändert.
- Titel im Manager und im PNG: "CoinAtlas Portfolio Manager" (Header-Knopf bleibt "Portfolio Manager").
- Share (oben rechts, absolut, Titel bleibt mittig): Menü Uncensored / Light Censor / Full Censor; die Wahl ist im Vorschaufenster fest
  (kein Umschalten), Fenster mit "Copy Image" und "Download PNG". Full Censor verbirgt zusätzlich die Durchschnittspreise.
  Bild wird selbst auf ein Canvas gezeichnet (2x): Titel + Datum, obere Leiste, alle Assets, Allocation, All-Time-Chart des Total Balance, Wasserzeichen
  (CoinAtlas-Logo + Name) unten rechts. Light Censor ersetzt jeden Betrag ($-Werte, Token-Mengen, P/L in $, Achsenwerte) durch Punkte; Preise und % bleiben.
  Ausgeblendete Wallets fehlen, Adressen erscheinen nie. Logos ohne CORS fallen auf Buchstaben zurück.

## Portfolio Manager: Manual Wallets und Feinschliff (21.11.2026)

- Manual Wallets stehen in derselben Liste wie Adressen ({manual, id, def: "Manual Wallet n", name, on, holdings}), gleiche Knöpfe (Auge, Stift, X);
  ein leerer Name zeigt wieder "Manual Wallet n". "+ Add Manual Wallet" unter der Liste (bei leerer Liste: "Add Manually"). Klick auf eine Manual Wallet
  öffnet ihre Coins im Edit-Modus ("Editing …"); Edit mit genau einer Manual Wallet bearbeitet diese, sonst nur die Durchschnittspreise.
  Adresse speichern löscht keine Manual Wallet. Das alte Hand-Portfolio wird zu Manual Wallet 1, seine Durchschnittspreise ziehen nach "wallets".
- Adress-Scans werden gemerkt (pfScanCache); Auge, X und Bearbeiten rechnen ohne neuen Scan neu zusammen.
- Total Balance: Klick öffnet/schließt den Chart, das Feld ist bei offenem Chart hellgrau (#2a2a28 wie .gear.active); das X am Chart ist weg.
  Zeitauswahl als übliches Dropdown (fg-yr-pick). Statistik-Mitte: "Current Portfolio Balance" (Asset: "Current Holdings Value").
- Zeitauswahl des Charts rechts wie überall. Öffnen von Chart und Diagramm scrollt so weit, dass beide ganz sichtbar sind, mit 24 px Abstand
  unten (pfScrollShow; beim Chart noch einmal, sobald er geladen ist und seine volle Höhe hat).
- Roadmap: Portfolio Manager ist grün (done); Netzwerke und Backend-Swaps stehen als "Portfolio Manager Network Additions" ganz unten.
- Show Allocation: aktiv hellgrau statt weiß; öffnen scrollt zum Diagramm. Stablecoin-Zeilen zeigen "Stablecoin".
- Full Censor verbirgt zusätzlich alle Gewinne in % (Punkte, Vorzeichen und Farbe bleiben), auch oben rechts im All-Time-Chart.

## Portfolio Manager: Durchschnittspreis (21.11.2026)

- Asset ohne Durchschnittspreis: graue Ebene über der Zeile, Knopf "Set Average Price". Vorher waren solche Zeilen unsichtbar:
  die Regel `.chart-container .empty` (202 px hoch) traf das leere Feld, weil die Karte auch chart-container ist.
- Preisfenster: Preis eintippen oder "Don't know your Average Price? Calculate it": Käufe als Menge zu Preis oder Menge an Tag
  (Tagesschlusskurs von Binance, SYMBOLUSDT 1d). Gewichteter Durchschnitt, "Use this price" übernimmt ihn.
  Gespeichert: localStorage "top200-pf-buys" (Käufe, abgewählte Swaps), "top200-pf-avgsrc" (Herkunft: hand, calc, swaps).
- Swaps: Blockscout (ohne Schlüssel) auf Ethereum, Base, Arbitrum, Optimism, Polygon; Token-Bewegungen (bis 10 Seiten) und interne
  Transaktionen (für ETH/POL als Gegenwert). Eine Transaktion, in der Stablecoins die Wallet verlassen und genau ein Token ankommt,
  ist ein Kauf zu Kosten ÷ Menge. Stablecoins nur über ihre bekannten Vertragsadressen (gegen gefälschte Tokens mit gleichem Namen).
  Ein Asset ohne Preis oder mit Preis aus Swaps bekommt den Swap-Durchschnitt; von Hand gesetzte Preise bleiben.
  Überweisungen zählen nie. Nur mit nachgebildeten Antworten getestet.
- Unter der Adresse (21.11.2026): ENS-Name/Basename, öffentliche Markierung und Wallet-Art (normal oder Smart-Contract-Wallet wie Safe),
  aus Blockscout (Ethereum und Base). Welche App jemand nutzt, lässt sich aus einer Adresse nicht ablesen.
- Später mit Backend: Solana, BNB Chain, Avalanche.

## Accounts (Plan, 20.11.2026, noch nicht gebaut)

- Keine E-Mail, keine Telefonnummer, kein Name. Wer CoinAtlas unterstützt, bekommt einen Account; die Seite bleibt für alle frei und werbefrei.
- Erstellen: zufällige Account-ID (z. B. CA-7K4M-92QX-HT3P), Passwort sofort setzen, Wiederherstellungs-Code zum Herunterladen.
- Freischalten: eigene Bitcoin-Adresse pro Account, abgeleitet aus dem xpub einer eigenen Tangem-Wallet nur für CoinAtlas (Dynamic Addresses).
  Jeder Betrag ab 5 $ zählt. Der Server kennt nur den xpub und kann kein Geld bewegen.
- Erkennen: Backend prüft offene Adressen jede Minute bei mempool.space (Ausweich: Blockstream), aktiv ab 1 Bestätigung.
  Nie mehr als 10 offene Adressen (Lückengrenze der Wallet).
- Sofort (Nutzer, 21.11.2026): Account wird frei, sobald die Zahlung unbestätigt im Netzwerk sichtbar ist (Sekunden).
  Einmalige Endprüfung nach 1 Bestätigung: hat diese Transaktion mindestens 5 $ an die Adresse gezahlt? Dann dauerhaft "bezahlt" mit Transaktions-ID,
  danach nie wieder geprüft (das Geld darf von den Adressen wegbewegt werden; geprüft wird die Transaktion, nicht das Guthaben).
  Keine Frist für die Bestätigung: der Server beobachtet die eine Transaktion, bis sie bestätigt ist. Gesperrt bzw. gelöscht wird nur, wenn sie verschwindet:
  ersetzt (ihre Eingänge in einer anderen Transaktion, bei mempool.space sofort sichtbar) oder nach etwa 2 Wochen unbestätigt vergessen. Später: USDC über Solana Pay, Lightning.
- Keine Zahlung (Nutzer, 21.11.2026): Passwort vor der Zahlung. Taucht innerhalb von 24 Stunden keine Zahlung auf, werden ID und Passwort gelöscht;
  erst dann geht die Adresse an einen neuen Account.
- Speichern: Cloudflare Workers + D1. Passwörter und Wiederherstellungs-Codes nur als Hash (PBKDF2/Argon2 mit Salz).
  Einstellungen und Zeichnungen werden im Browser mit einem Schlüssel aus dem Passwort verschlüsselt (Ende-zu-Ende).
- Security: xpub und Schlüssel nur in Cloudflare Secrets, nie im öffentlichen Repo; Login-Versuche begrenzt; Turnstile beim Erstellen;
  Sitzung in HttpOnly-Cookie; CORS nur für die CoinAtlas-Seite; nur HTTPS; keine IP-Adressen speichern; D1-Backups.
- Vor dem Start: erste Adressen aus dem xpub mit Tangem abgleichen; Kleinbetrag auf die 3. Adresse testen; rechtlich prüfen (Kauf, keine Spende).
- Schritte: 1. Account-ID, Passwort, synchronisierte Einstellungen. 2. Bitcoin-Zahlung. 3. USDC/ETH später (günstiges Netzwerk oder Bezahldienst).
  Ersetzt die 4-stellige PIN-Sperre.

## Snapshot-System (21.11.2026, überarbeitet)

- Zeitpunkt: offiziell direkt nach Mitternacht New York; ein Snapshot ist der Abschluss des New Yorker Tages, der gerade endete.
  GitHub startet den Job 4× zwischen 00:05 und 00:50 New Yorker Zeit (Sommer 04:xx UTC, Winter 05:xx UTC); scripts/snapshot-time.mjs lässt
  nur den ersten Lauf in der Mitternachtsstunde aufzeichnen ("ny": true). Ersatzlauf 17:15 UTC füllt nur einen fehlenden Tag ("late": true).
- Snapshot: Top 300 (Seite mit index.html?snapshot=1, Besucher sehen weiter 200): Symbol, Name, Preis, Market Cap, 24h-Volumen, Umlaufmenge.
  Volumen und Umlaufmenge nur von Coinpaprika, damit die Reihe vergleichbar bleibt. Total, Dominanz und "New in Top 200" aus den ersten 200.
- readings.json: das Reading des BTC|ETH Ratio für jeden Tag (Empfehlung, Schlüssel, Stufe, Phase, Linien-Abstand, Score, Marken, Ratio,
  Fear & Greed, Text), so wie die Formel es mit den Daten bis Tagesende sagte. Das ist der echte, vorher festgehaltene Track Record.
- derivatives.json (noch ungenutzt): Open Interest, Funding und Long/Short-Verhältnis von BTC und ETH bei Binance, Bybit, OKX, Bitget,
  Hyperliquid und Deribit; jede Börse einzeln (Binance und Bybit sperren US-Server). Binance füllt, wo erreichbar, die letzten 30 Tage nach.
- TOTAL200 rückwirkend: scripts/backfill-total200.mjs (Workflow "Backfill TOTAL200", von Hand): 365 Tage CoinGecko-Market-Caps der heutigen
  Top 500 (ohne Wrapped/Staked), pro Tag die 200 größten addiert. Coins, die damals Top 200 waren und heute nicht mehr in den Top 500 sind,
  fehlen, daher leicht zu niedrig; Quelle "CoinGecko backfill". Eigene Aufzeichnungen werden nie ersetzt; der Snapshots-Tab zeigt diese Tage nicht.
  Gelaufen am 21.11.2026: 355 Tage (22.11.2025–11.11.2026) aus 479 Coins. Naht: CoinGecko zählt anders als die eigene Liste, am Übergang
  11.11. → 12.11.2026 TOTAL200 2,51 → 2,37 Bio. $ (−6 %), BTC.D 59,0 → 60,2 %, USDT.D 7,0 → 7,6 %. Die Chart-Beschreibungen nennen das.

## Offene Punkte

- Kritischer Rundum-Test des neuen Systems (nur auf Wunsch des Nutzers).
- Reading des Tages wird ab 22.11.2026 mitgeschrieben (data/readings.json); nach einigen Monaten an ungesehenen Tagen prüfen.

## Scrollen (21.11.2026)

- Jeder Sprung der Seite (Suche, Klick in Sentiment Squares, Locked Charts, Mini-Charts, Portfolio-Chart und Allocation) läuft über smoothScrollY:
  ease in-out (kubisch), Dauer 420 ms + 12 × √Strecke, höchstens 1,4 s. Mausrad oder Touch des Nutzers bricht sofort ab; bei
  "reduzierter Bewegung" im System wird direkt gesprungen.
- Allocation scrollt mit 64 px Abstand unter dem Diagramm (Total-Balance-Chart: 24 px).

## Einstellungen: Hovercharts (21.11.2026)

- Der Bereich "Locked Hovercharts" heißt jetzt "Hovercharts" und hat zwei Unter-Tabs (wie Customization):
  - Hovercharts: Schalter an/aus (Standard an) und Größe 25 % bis 150 % in 5er-Schritten, 100 % heißt "Default".
    Gilt für alle Hovercharts (Liste, Sentiment Squares, Portfolio). Umsetzung über CSS zoom auf #pop; place() rechnet mit der echten Größe auf dem Schirm.
    Gespeichert in "coinatlas-hovercharts" ({on, size}). Aus = keine Hovercharts und keine Abfragen dafür.
  - Locked Hovercharts: die bisherigen Einstellungen, unverändert übernommen.
- Unter-Tabs merken sich den letzten Tab pro Bereich; der aktive Unter-Tab ist hellgrau (#2a2a28) statt weiß.
- Klick auf ein Asset in der Liste, dessen Locked Hoverchart schon offen ist: scrollt so, dass die Oberkante des Charts 16 px unter dem
  Bildschirmrand steht (vorher: Chart in der Mitte, bei hohen Charts zu tief). Der erste Klick öffnet den Chart nur, ohne zu scrollen
  (so kann man mehrere Assets nacheinander hinzufügen); erst ein zweiter Klick auf dasselbe Asset scrollt zu seinem Chart.
- Portfolio-Zeilen: hinter dem Wert steht, aus welchen Wallets der Coin kommt: Name der Wallet, sonst "Manual Wallet n" bzw. die gekürzte
  Adresse, bei Adressen mit den Netzwerken in Klammern ("Main Wallet (Ethereum, Base), XYZ"). Im Share-Bild heißt eine Adresse ohne Namen nur "Wallet".

## Asset-Tags (21.11.2026)

- Geprüft gegen den Snapshot vom 21.11.2026 (Top 200): vorher 70 Assets ohne Tag, jetzt 0.
- Neue Kategorien mit eigenem Filter im Filters-Fenster: AI, Gaming, Exchange (Börsen- und CeFi-Tokens), Gambling, Entertainment.
- Bestehende Listen ergänzt (Layer 1, Layer 2, DeFi, Infrastructure, Payment, Meme); FIDD (Fidelity Digital Dollar) ist ein Stablecoin;
  BEAM aus Privacy entfernt (der heutige BEAM ist das Gaming-Netzwerk).
- Ein Coin kann in mehreren Listen stehen (Filter); der Tag im Chart zeigt die erste Kategorie in der Reihenfolge Meme, Privacy, RWA,
  Exchange, Gambling, Entertainment, Gaming, AI, DeFi, Infrastructure, Payment, Layer 2, Layer 1.
- Täglich nach dem Snapshot (Workflow-Schritt "Record tags", scripts/record-tags.mjs): Kategorien von CoinGecko für alle Coins des Snapshots
  (Top 300) nach data/tags.json ({updated, source, coins, failed, tags: {SYM: [tag, …]}}). Eine Abfrage pro CoinGecko-Kategorie (20),
  ohne Schlüssel 13 s Pause, mit COINGECKO_KEY 2,2 s. Zuordnung über Namen, oder über das Symbol bei Rang ≤ 400. "stable" nur bei Preis 0,85–1,35.
  Die Seite übernimmt diese Tags nur für Coins ohne handgemachten Tag (die eigenen Listen haben Vorrang). Fehler stoppen den Snapshot nie.

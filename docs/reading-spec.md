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

- Geprüft gegen den Snapshot vom 21.11.2026 (Top 200): vorher 70 Assets ohne Tag, jetzt 2 (SHFL und RLB, Gambling wird bewusst nicht getaggt).
- Neue Kategorien mit eigenem Filter im Filters-Fenster: AI, Gaming, Exchange (Börsen- und CeFi-Tokens), Entertainment.
  Bewusst keine Kategorie Gambling: solche Coins bekommen keinen Gambling-Tag und es gibt keinen Filter dafür (auch nicht aus tags.json).
- Bestehende Listen ergänzt (Layer 1, Layer 2, DeFi, Infrastructure, Payment, Meme); FIDD (Fidelity Digital Dollar) ist ein Stablecoin;
  BEAM aus Privacy entfernt (der heutige BEAM ist das Gaming-Netzwerk).
- Ein Coin kann in mehreren Listen stehen (Filter); der Tag im Chart zeigt die erste Kategorie in der Reihenfolge Meme, Privacy, RWA,
  Exchange, Entertainment, Gaming, AI, DeFi, Infrastructure, Payment, Layer 2, Layer 1.
- Täglich nach dem Snapshot (Workflow-Schritt "Record tags", scripts/record-tags.mjs): Kategorien von CoinGecko für alle Coins des Snapshots
  (Top 300) nach data/tags.json ({updated, source, coins, failed, tags: {SYM: [tag, …]}}). Eine Abfrage pro CoinGecko-Kategorie (20),
  ohne Schlüssel 13 s Pause, mit COINGECKO_KEY 2,2 s. Zuordnung über Namen, oder über das Symbol bei Rang ≤ 400. "stable" nur bei Preis 0,85–1,35.
  Die Seite übernimmt diese Tags nur für Coins ohne handgemachten Tag (die eigenen Listen haben Vorrang). Fehler stoppen den Snapshot nie.

## Where can I stake? (21.11.2026)

- scripts/record-staking.mjs (nachts nach dem Snapshot, Schritt "Record staking"): feste, handverlesene Anbieterliste (PROVIDERS) – nur seit
  Jahren bekannte, geprüfte Anbieter ohne Verlust von Nutzergeld; kein Restaking, keine Börsen, keine Stablecoin-Renditen außer Aave (als "Lending").
  Raten von DefiLlama Yields, nur apyBase (keine Bonus-Token), über 30 % wird verworfen. Pro Coin die 3 besten Optionen; natives Staking ohne
  öffentliche Rate steht mit Link und ohne Zahl ("Rate on site") hinten. Ergebnis: data/staking.json ({updated, source, missing, assets}).
  Ohne Netz bzw. STAKING_OFFLINE=1 wird nur die Liste ohne Raten geschrieben; ein Fehler behält die letzte Datei.
- Liste: lavendelfarbenes Badge "STAKING APY 7.2%" (bzw. "LENDING APY …", "STAKING" ohne Rate) mit der besten Rate der Top 3; das
  "NEW IN TOP 200"-Badge ist jetzt gelb. Filter "Staking" im Filters-Fenster (nach Marketcap wie die Liste).
- Locked Hovercharts: Abschnitt "Staking" unter Tokenomics (Einstellung "Show Staking", Standard an): Name als Link (Hover zeigt die Domain),
  Art (Liquid/Native Staking, Lending), Locked/Unlocked, Rate (APR bei nativem Staking, sonst APY). Hinweis: nur echte Rate, kein Finanzrat,
  CoinAtlas verbindet sich nie mit der Wallet, "CoinAtlas is not sponsored by any of these Staking Providers" (fällt bei Partnerschaften weg).
- Verlauf: jede Nacht mit echten Raten wird zusätzlich in data/staking-history.json gespeichert (eine Zeile pro Tag:
  {"YYYY-MM-DD": {"ETH": {"Lido": 2.9, …}, …}}), nur Optionen mit Rate; ein erneut aufgenommener Tag wird ersetzt.
- Einstellungen, Asset List: "Tags" (an/aus) mit Unter-Schaltern Staking, Highest Gain, Highest Loss, New in Top 200
  (gespeichert in "coinatlas-list-tags"; umgesetzt über Klassen am body, die die Badges in der Liste ausblenden).
  Der Staking-Abschnitt der Locked Hovercharts hat seinen eigenen Schalter "Show Staking" (Hovercharts → Locked Hovercharts).
- Sentiment Squares haben keine Hovercharts mehr: ein Klick auf ein Quadrat springt zur Zeile in der Liste, dort zeigt sich der Chart.
- Staking-Fenster (Header-Knopf "Staking", in den Header-Einstellungen abschaltbar; Landing Area):
  - Liste: Suche, voller Knopf "Use Portfolio Manager Holdings", Zeilen # (Rang), Asset, beste Rate (APR/APY), Locked/Unlocked; nach Marketcap.
  - Klick auf ein Asset (oder auf ein Staking-Badge in der Liste): Rechner mit Menge in Token oder $ (Umschalten rechnet die Menge um),
    Dauer 1/3/6 Monate oder 1 Jahr (Dropdown rechts, gemerkt), Ergebnis für die Top 3 Anbieter: Belohnung in Token und $, Bestand am Ende.
    Liquid Staking und Lending mit Zinseszins (APY), natives Staking ohne (APR). Hinweis: heutige Rate angenommen, kein Finanzrat, nicht gesponsert.
  - Rate History: Linie der Rate des besten Anbieters in Lavendel aus data/staking-history.json, erst ab 30 aufgezeichneten Tagen
    (vorher Platzhalter mit "x of 30 so far"); Zeitraum = gewählte Dauer.
  - Portfolio-Ansicht: alle stakebaren Assets aus dem Portfolio Manager (lädt die gespeicherten Wallets wenn nötig) mit bester Rate,
    Belohnung in Token (+% in Token) und Bestand danach. Oben nur: "50% of your Portfolio can be staked: $X of $Y".
    Rechts in jeder Zeile das eigene Token-Wachstum in %. Keine Gesamtzahl unten (Prozente verschiedener Coins
    lassen sich nicht ehrlich addieren), nur der Sicherheits-Hinweis. Klick auf eine Zeile öffnet den Rechner.
- Native Raten (getestet über GitHub am 21.11.2026), Netzdurchschnitt vor Validator-Gebühr, im Eintrag als Hinweis vermerkt:
  ATOM, TIA, INJ: cosmos.directory "estimated_apr"; SOL: Validator-Inflation × Gesamtmenge ÷ gestakte Menge (offizielle RPC);
  ADA: Koios, Belohnungen einer abgeschlossenen Epoche ÷ aktiver Stake × 73; BNB: APY der aktiven Validatoren nach Stake gewichtet
  (api.bnbchain.org); HYPE: "predictedApr" der Woche nach Stake gewichtet (api.hyperliquid.xyz). Ohne freie verlässliche Quelle:
  AVAX (Glacier-Zahlen widersprüchlich), DOT (Subscan braucht Schlüssel), POL, OSMO (liefert 0) → "Rate on site".
- Zweite Runde (21.11.2026): AKT (cosmos.directory), APT (rewards_rate pro Epoche × Epochen pro Jahr), NEAR (max. Inflation ohne
  Protokoll-Anteil × Gesamtmenge ÷ gestakte Menge), TRX (TronScan annualizedRate der Super Representatives nach Stimmen gewichtet),
  EGLD (MultiversX /economics apr), HBAR (Hedera Mirror Node reward_rate_start × 365, nach rewarded stake gewichtet).
  Nicht möglich: SUI (öffentliches JSON-RPC abgeschaltet), TON (tonapi-Werte unrealistisch), XTZ (keine fertige Rate),
  KAVA, SEI, DYDX (cosmos.directory liefert 0 oder nichts), DOT über den Parity-Sidecar (Fehler).
- Workflow "Record staking" (record-staking.yml) holt die Raten auch von Hand, ohne Snapshot.
- Abdeckung (22.11.2026): Von den Top 200 haben sicher 73 Staking (45 natives Chain-Staking, 28 Staking im eigenen Protokoll), 18 unsicher.
  26 weitere Chains mit nativem Staking stehen jetzt nur mit Link (offizielle Staking-Seite oder Projektseite) und Locked/Unlocked drin,
  ohne Rate ("Rate on site"): GRAM, SUI, TAO, ICP, STX, DASH, FLR, XDC, GNO, SEI, XTZ, DCR, KAIA, RUNE, CFX, MON, IOTA, THETA, A, S, CHZ,
  QTUM, ZANO, BDX, VET, XEC. Ausgelassen, weil die offizielle Seite unklar ist: LUNC, KITE, M. Protokoll-Staking (AAVE, CRV, GMX …) fehlt noch.
- Links (22.11.2026 über GitHub geprüft: Status 200 und Seite über Staking): native Einträge zeigen direkt auf die Staking-Seite oder
  die offizielle Anleitung der Chain (z. B. cardano.org/stake-pool-delegation, slush.app/guides/stake-and-swap-sui, docs.iota.org …/stake,
  stake.tezos.com, Tonkeeper-Hilfeartikel, Vaulta-Guide, qtum.org/use-qtum/stake-qtum). Nur Projektseite, weil keine Staking-Seite
  gefunden wurde: ZANO, BDX. Der Name eines Eintrags beschreibt jetzt die verlinkte Seite (z. B. "TRON Stake 2.0", "Hedera Staking").
- Staking-Abschnitt in den Locked Hovercharts entfernt (samt Einstellung "Show Staking"): Staking läuft nur noch über das Staking-Fenster.
- Charts: Auswahl-Bildschirm "Which chart do you want to see?" liegt auf dunklem, verschwommenem Grund (rgba(18,18,17,.82) + blur) statt hellem.
- Portfolio-Chart (Total Balance und Assets): Zeitauswahl hat jetzt auch die Jahre (aktuelles Jahr bis 2017, mit Bull/Bear/Bridge Year).
- Einstellungen: Scrollen bleibt im Fenster (overscroll-behavior: contain), die Seite bewegt sich nicht mit.
- Simple Market Sentiment Counter nur noch an/aus, ohne Unter-Schalter für Grün, Rot, Stablecoins und Neutral.
- Roadmap: "Charts Additions" mit Backtesting; neuer Punkt "Final Settings Rework" direkt über Mobile.
- Customization: Kacheln statt Unter-Reitern. Jede Kachel zeigt Farbprobe, Namen und die aktuelle Einstellung ("Gold from +50%", "Off" …);
  ein Klick öffnet die Optionen, "‹ Customization" führt zurück (zuletzt offener Bereich gemerkt, "coinatlas-settings-cust").
  Neue Kachel "Time Travel": Ton der Vergangenheit, Sepia oder Gold ("coinatlas-tt-tone").

## Snapshots & Time Travel (22.11.2026)

- Snapshots (für alle, Landing Area): jeder eigene Tag (dominance.json ohne Backfill) als Zeile; aufgeklappt: Top-200-Marketcap, BTC/ETH-Dominanz,
  Fear & Greed, Ratio, Anzahl Coins, Reading-Text (readings.json), Derivate (Summe Open Interest, mittleres Funding, derivatives.json),
  Staking-Raten (staking-history.json), gegen den Vortag: neu/raus aus den Top 200, 5 beste/schlechteste. Knöpfe: "Time Travel to this day",
  "Download CSV/JSON", "Show the full list". Backup-Historie anderer Quellen nur im Dev Mode.
- Time Travel (Header-Knopf statt "Years Ago", Landing Area): Status (Live / "You are on …" + "Back to Live"), Schnellwahl (Last Snapshot,
  1 Week, 1 Month, 1 Year Ago, nur wenn aufgezeichnet), Monatskalender, nur aufgezeichnete Tage klickbar.
  Sprung: Overlay mit Unschärfe, Uhr dreht (rückwärts in die Vergangenheit), Datum rollt Tag für Tag (ease in-out, 1,5 s).
  Danach: Liste = Snapshot des Tages (Rang, Preis, Marketcap, Volumen, Umlauf; Logos/Details von heute), Tagesänderung gegen den vorigen Snapshot,
  Rang-Pfeile gegen den vorigen Snapshot, Breadth-Counter, Highest Gain/Loss, Portfolio-Werte, Staking-Raten des Tages, BTC|ETH Formula und
  Reading (RT.asOf), Fear & Greed (Reihe endet am Tag, Wert aus dem Snapshot), Sentiment Squares (nur "Today"). Live-Updates pausieren; neue
  Live-Daten warten auf den Rückweg. Ton Sepia oder Gold (Customization). Charts bleiben live (Backtesting kommt). "New in Top 200" ausgeblendet.
- Portfolio-Chart, vergangene Jahre: kein angehängter "Jetzt"-Punkt mehr am Ende (pfScale/pfSumSeries geben live, dom, frac weiter).
- Manual Wallet: der Stift öffnet zusätzlich die Coins der Wallet zum Bearbeiten (Coins links anklicken fügt sie hinzu).
- Tages-Charts für Time Travel: scripts/record-intraday.mjs (nachts, Schritt "Record intraday charts") speichert den "Today"-Chart des
  abgelaufenen New-York-Tages für die Top 200 in 5-Minuten-Schritten (Binance, sonst Bitget) nach data/intraday/YYYY-MM-DD.json
  ({date, start, step, sources, coins: {SYM: [288 Schlusskurse]}}). Im Time Travel zeigen Hovercharts und der 1D-Chart der Locked Hovercharts
  diesen Verlauf (eigener Chart-Cache, ganze Breite, "21 Nov 2026 · CoinAtlas Snapshot", Mitte "Price at the Snapshot"); ohne Aufzeichnung
  steht "No chart was recorded for this coin on this day". Aufgezeichnet wird ab dem 22.11.2026.
- Snapshots-Tab (Rework 22.11.2026): Liste der Tage wie früher; ein Tag öffnet eine eigene Ansicht ("‹ All Snapshots", [CSV] [JSON],
  "Time Travel to this day") mit ruhigen Kacheln, je ein Wert: Market Cap, Fear & Greed (Farbe der Zone), Dominance, BTC|ETH Ratio (Farbe
  der Phase), Sentiment Squares ([grün] [rot]), Movers, Derivatives, Staking. Ein Klick auf eine Kachel öffnet ihre Daten darunter
  (Reading-Text nur im Ratio-Panel, Dominanz als Balken mit Stablecoins und Altcoins, Derivate als Tabelle, Squares des Tages als kleine Karte [Today]).
  Unten ein breiter Knopf "Show Token List" mit [300 Coins]: Liste mit Rang, Name, [Tier 1-3] (Änderung gegen den vorigen Snapshot), Preis,
  Änderung, Marketcap; ein Klick zeigt den Tages-Chart des Coins direkt im Snapshots-Tab (nicht als Locked Hoverchart).
- UI-Regel: Zahlen und Zähler in eckigen Klammern, z. B. [300 Coins], [Tier 2], [12].
- Time Travel: Sprung kürzer (0,85 s), danach pulsiert der Ton (Sepia/Gold) von der Mitte über die Seite; Fehler beim Umschalten lassen das
  Overlay nie mehr hängen (Fear & Greed hatte im Time Travel eine verdeckte Variable und brach ab).
- Snapshots-Tab, zweiter Rework (22.11.2026): Titelzeile mit "‹ All Snapshots" links und "Download ▾" rechts ([CSV] Token List, [JSON] Full
  Snapshot, [PNG] Everything: Kacheln, Sentiment Squares und Top 50 auf einem Bild); Titel bleibt mittig. Einheitliche Kacheln (gleicher Grund,
  nur der Wert farbig), kein Movers mehr. Ein Klick öffnet das echte Fenster des Tages unten im Tab: Fear & Greed (Chart bis zum Tag, Halbkreis
  mit dem Wert, ohne Zeitauswahl; eigener Verlaufsname "snap-fg-grad"), BTC|ETH Ratio (ganzes Fenster mit RT.asOf, ohne Zeitauswahl),
  Dominance (Dominance Graph aus dem Ratio-Fenster), Sentiment Squares (gleicher Look, Top [1-200], verschiebbare Linie, nur [Today]),
  Staking (Liste wie im Staking-Fenster mit den Raten des Tages), Market Cap, Derivatives. Token-Liste und Fenster schließen sich gegenseitig;
  "Hide Token List" bleibt oben (sticky). In der Liste stehen [Tier] und % links neben dem Namen.
- Tagesänderung = Tages-Chart (Mitternacht bis Mitternacht New York, erster bis letzter Punkt); ohne Tages-Chart gegen den vorigen Snapshot.
  Gilt für Liste, Squares, PNG und Time Travel. Grund: die Snapshots bis 20.11. wurden noch um ~18:50 New York aufgenommen (alter Zeitplan).
- Time Travel: nach dem Sprung wächst der Ton (Sepia/Gold) als Kreis von der Bildschirmmitte, mit leuchtendem Rand (backdrop-filter + Maske),
  bis alles bedeckt ist; zurück zu Live öffnet sich ein klarer Kreis. Header wird mit getönt.
- Snapshot-PNG (Download ▾ → [PNG] Everything): zuerst eine Vorschau (wie beim Portfolio-Share), dann "Download PNG". Gebaut aus der echten UI
  (unsichtbarer Aufbau, mit html2canvas 1.4.1 von cdnjs fotografiert, Faktor 1,5): Kopf mit Logo, Karten TOTAL 200 (Wert + 7-Tage-Graph in Teal
  #2dd4bf), Fear & Greed (das echte Rad), BTC|ETH Ratio + Dominance, Sentiment Squares + Staking; die drei Ratio-Charts (Ratio, Season, Dominance);
  die Sentiment Squares mit Logos, Skins ab +50% und der weißen Front; die Top 50 als echte Listenzeilen in zwei Spalten mit Logo, [Tier] [Gewinn]
  neben dem Namen, Staking-, Highest-Gain/Loss-Badges, Preis, Marketcap, Pulse-Tönung wenn in der Liste an. Wasserzeichen unter den Squares
  und unten rechts (Logo + CoinAtlas). Open Interest nicht im Bild.
- Snapshots-Tab: "Market Cap" heißt TOTAL 200 (Teal, kleiner 7-Tage-Graph in der Kachel, großer Graph mit Werten im Fenster);
  Derivatives nur im Dev Mode.
- Snapshots-Fenster, Feinschliff: Charts zeigen das Kalenderjahr des Tages (1. Jan bis 31. Dez), die Daten enden am Tag: Fear & Greed (Jahresansicht),
  BTC|ETH Ratio (YEAR-Ansicht, Daten am Tag abgeschnitten, ohne Past Years), TOTAL 200 (alle Tage von dominance.json inkl. Backfill) und Staking
  (Klick auf ein Asset: beste Rate je Tag aus staking-history.json). TOTAL 200 und Staking mit Tooltip (Datum + Wert). Sentiment Squares mit der
  üblichen Zeitauswahl "Today", nicht klickbar; Karte 460 px hoch. Kein Scrollen beim Öffnen eines Fensters. "Previous Day" statt "Snapshot before".
- Snapshot-PNG im Querformat (3200 px Breite, ca. 3:2): links die Top 50; rechts drei Spalten (TOTAL 200 und Fear & Greed mit Jahres-Chart über dem
  Rad | Ratio, Season und Dominance untereinander, je mit dem Wert des Tages | Staking-Fenster mit den stakebaren Coins der Top 50), darunter die
  Sentiment Squares, die die restliche Höhe füllen. Die Karten ohne Chart (Ratio/Dominance, Squares/Staking) sind entfallen.

## Wochen-Snapshots, Time-Travel-Sperre, Bild-Feinschliff (22.11.2026)
- Snapshots-Tab: statt der Tage stehen Jahre (vergangene Jahre mit Daten, dieses und nächstes Jahr, z. B. 2027 und 2026). Ein Klick auf ein Jahr
  öffnet zwei Knöpfe, Weeks und Days. Weeks: echte ISO-Kalenderwochen (Montag bis Sonntag), "Week 47 [16 Nov – 22 Nov 2026] [6/7 Snapshots]",
  neueste oben. Days: die Tage des Jahres wie bisher.
- Wochenansicht: die Woche wird als ihr letzter aufgenommener Tag gezeigt, aber mit der Bewegung der ganzen Woche (Open des ersten Tages aus dem
  Tages-Chart bis zum Schluss des letzten Snapshots): Liste, Tiers, Squares, Kacheln. Darüber die 7 Tage als Knöpfe (Mo–So, fehlende ausgegraut),
  ein Klick öffnet den Tag. Chart eines Coins = die Tages-Charts der Woche hintereinander. Charts mit mehr Geschichte (F&G, Ratio, TOTAL 200)
  zeigen das Jahr bis zum letzten Tag. Download: PNG "CoinAtlas Weekly Snapshot", CSV der Liste des letzten Tages, JSON mit allen Tagen der Woche.
- Snapshot-PNG: Titel "CoinAtlas Daily Snapshot" bzw. "CoinAtlas Weekly Snapshot", Datum darunter weiß. Dominance Graph oben rechts mit
  [BTC] [ETH] [ALTS] (ALTS = 100 − BTC − ETH). F&G-Chart mit Monatsachse (Jan Apr Jul Oct Dec, auch auf der Seite in der Jahresansicht).
  BTC|ETH Reading des Tages als eigene Karte unter Fear & Greed, ohne Sätze, die sich auf die eigenen Bestände beziehen (mit "your").
  Einstellungen der Seite gelten im Bild (Tags aus bzw. einzelne Tags aus, Pulse). Schärfer: html2canvas Faktor 2 (6400 × 4266 px).
  Dateiname coinatlas-daily-snapshot-JJJJ-MM-TT.png bzw. coinatlas-weekly-snapshot-JJJJ-Www.png.
- Ein Tooltip-Design überall: die Jahres-Charts (TOTAL 200, Staking) nutzen jetzt den Tooltip der Preis-Charts (.price-tooltip, Datum + Wert),
  die gestrichelte weiße Linie und den weißen Punkt.
- Time Travel: alle Zeitauswahlen werden auf den Tag gesperrt und behalten ihr Aussehen (Menü öffnet sich nicht): Locked Hovercharts und
  Portfolio auf Today, Sentiment Squares auf Today, Fear & Greed und Monats-Durchschnitte auf das Jahr des Tages, BTC|ETH Ratio auf YEAR mit dem
  Jahr des Tages. Zurück zu Live stellt die vorherige Auswahl wieder her.
- Roadmap: "Snapshot Customization" (Fenster im Bild wählen, Listenlänge, eigener Name/Tag oben rechts in der Titelzeile).
- Snapshots-Knopf öffnet immer das aktuelle Jahr im Modus "Days".
- Snapshot-PNG: Staking zeigt nur Assets mit einer Rate des Tages ("Rate on site" fällt weg). Darunter, direkt neben den BTC|ETH-Charts, die Karte
  "BTC|ETH Reading": Titel rechts mit dem Ergebnis der Formel (z. B. [BTC Overvaluation Lean +2]), der Text in der Farbe des Readings dieses Tages
  (ohne Sätze zu den eigenen Beständen), darunter die Formel: Punkte je Datenpunkt (Ratio, Season, Dominance), Summe, Uncertainty- und Certainty-Marks.
- Snapshots-Tab: Tage, Wochen und Jahre werden beim Hover hellgrau (#2a2a28). PNG: Season-Wert = Season der Formel ([BTC Season …] orange, [ETH Season …] blau, [No Season] grau); die Ratio-Charts und der TOTAL-200-Chart wachsen, bis alle drei Spalten gleich hoch sind; unter TOTAL 200 stehen Today, Previous Day, Year Start, Year to Date, Year High/Low mit Datum und Abstand dazu.
- Wochen-PNG einer laufenden Woche: Datum oben mit [Week Still in Progress]. Skins (+50%) im Bild ohne Animation, ganzer Verlauf sichtbar, ruhiger Rand-Glanz. Klick auf eine Woche scrollt nicht mehr.
- PNG: unter dem Fear-&-Greed-Rad die Jahreskarte aus Past Years (Monatsdurchschnitte bis zum Tag + Jahresdurchschnitt). TOTAL 200 ohne Zahlenblock, Wert oben rechts in Teal.
- Sentiment Squares: Knopf Download neben Top öffnet eine Vorschau und speichert die aktuellen Squares als zentriertes Bild (2400 px breit, Faktor 2): Kopf mit Logo, Titel, Datum + Uhrzeit (im Time Travel der Tag), [Up]/[Down], Top und Zeitraum, Skins mit zufälligem Glanz-Moment, Wasserzeichen.
- Quellenangaben (überall dezent, 'Created using Data from …', Namen verlinkt): Beschreibung eines Assets zeigt die Quelle (CoinPaprika/CoinGecko/CoinLore) jetzt immer, nicht erst nach More. Fear & Greed: Alternative.me im Fenster und im Snapshot-PNG (unter der Karte). Staking-Fenster: DefiLlama und die eigenen Quellen der Netzwerke. Seitenfuß: alle Datenquellen (CoinGecko, CoinPaprika, CoinLore, Binance, Bitget, OKX, Bybit, KuCoin, Gate.io, Alternative.me, DefiLlama, FRED). Snapshot- und Squares-PNG: Quellen im Fußtext.
- Fear & Greed: kein Live-Wert mehr von CoinMarketCap (anderer Index); alle Werte von Alternative.me. CoinMarketCap aus dem Quellen-Fuß entfernt.
- Fear & Greed: Knopf Download oben rechts in der Titelzeile. Das Bild nimmt die gewählte Zeitauswahl, den Past-Years-Filter (z. B. nur Bear Years) und die aufgeklappten Jahre mit; Kopf mit Logo, Titel, Datum, [Zeitraum] [Filter]; Credit Alternative.me unten.
- Past Years: die Karte 'All Years' erscheint nur beim Filter All (auch im Bild).
- Fear-&-Greed-Bild im Querformat (1700 px, Faktor 2): links Chart in eigenen Proportionen, darunter Halbkreis und History; rechts Past Years; Credit unten.
- Fear & Greed: Monats- bzw. Datumsachse auch bei 30 Tagen / 365 Tagen. Roadmap: Customizable Image Export.
- Fear-&-Greed-Bild: zurück zum festen Querformat (Chart, Halbkreis + History links, Past Years rechts), ohne Editor und ohne automatisches Umsortieren. Roadmap: Customizable Image Export.
- Gram (TON) Staking-Link: Tonkeeper-Hilfeartikel ersetzt durch die Tonstakers-Anleitung (Liquid Staking). Roadmap: Tab Dragging & Quick Actions.
- Wöchentliches Backup (backup.yml, montags 09:37 UTC, auch von Hand): scripts/backup-zip.mjs baut eine ZIP 'CoinAtlas Backup/JJJJ/Week N JJJJ/T MON JJJJ/' mit snapshot.json, intraday.json und day.json (Dominanz, Reading, Derivatives, Staking des Tages), dazu Restore/data (der ganze data-Ordner zum Zurückspielen). Hängt als Release 'backup-JJJJ-Www' am Repo.
- Snapshots-Tab (Übersicht): Knopf Download oben rechts; Hover zeigt [ZIP] All Snapshots. Baut im Browser (JSZip 3.10.1 von cdnjs) eine ZIP 'CoinAtlas Snapshots/JJJJ/Week N JJJJ/T MON JJJJ/' mit snapshot.json, intraday.json, day.json, immer mit allen Tagen bis heute.
- Header TOTAL 200 und FOMC (beide standardmäßig aus, Settings → Header). TOTAL 200: Wert, Jahr-Auswahl, Jahres-Chart, Zahlen (Previous Day, Year Start/to Date, High/Low). FOMC: Countdown bis zur nächsten Zinsentscheidung (14:00 New York, auch in Ortszeit), Termine dieses und nächsten Jahres (Fed-Kalender, Revision vom 12.11.2026: Okt 2027 nur Strategie, Dez 2027 auf 16.–17. Nov verlegt). Roadmap: FOMC + News Calendar (Odds, News Calendar).
- Data Export (Header, standardmäßig aus): Live (bzw. im Time Travel der gereiste Tag, mit gelbem Hinweis) oder Snapshot. Live: CoinAtlas Default (das Snapshot-Bild aus den Live-Daten, Titel 'CoinAtlas Live Snapshot'), Fear & Greed, Sentiment Squares, BTC|ETH Ratio, Staking, TOTAL 200, FOMC als PNG (Fenster so wie eingestellt). Snapshot: Tag oder Woche als PNG, CSV, JSON. Download-Knöpfe in Fear & Greed und Sentiment Squares entfernt, im Snapshots-Tab bleiben sie. Roadmap: Data Export Customizability; Quick Action: Fenster auf Data Export ziehen.
- Time Travel gilt jetzt auch für das BTC|ETH-Ratio-Fenster (Daten enden am gereisten Tag) und FOMC (Stand Ende des Tages). Data Export: Liste der Export-Arten; Klick öffnet einen Picker: Quelle Live (Current Day / Current Week bis jetzt) oder Snapshot (Day / Week + Auswahl), Week für CoinAtlas Default und Sentiment Squares. Snapshot-Exporte anderer Fenster schalten die Seite kurz auf den Tag (Woche: Wochenbewegung) und zurück. Fenster-Exporte im Querformat: Teile fließen in 2–5 Spalten in Seitenbreite, lange Listen und Abschnitte werden aufgeteilt, Bedienelemente entfernt. Roadmap Mobile: auch alle Exporte und UIs.
- Data Export als Ablauf in Schritten, jeder Schritt ersetzt das ganze Fenster: gleich große Kacheln → Frage 'Which data do you want to export?' (Live/Snapshot, runde Knöpfe wie bei der Asset-Frage im Reading) → Range (Current Day/Week bzw. Day/Week) → Liste der Tage/Wochen. ‹ Back geht einen Schritt zurück. Live-Wochenbild = gleicher Titel wie im Snapshots-Tab (Weekly Snapshot, [Week Still in Progress]).
- Data Export Live: Tag = '[Day Still in Progress]' hinter dem Datum (CoinAtlas Default heißt dann 'CoinAtlas Daily Snapshot'), Woche = '[Week Still in Progress]', bei allen Export-Arten. Im Time Travel ohne Zusatz (der Tag ist abgeschlossen).
- Data Export: Exporte werden unsichtbar gebaut (kein Fenster öffnet sich auf der Seite). Eigene Desktop-Layouts: BTC|ETH Ratio (drei Charts nebeneinander mit Werten, alle Jahre in einer Reihe, Formel + Reading nebeneinander, kein Umrechner), Staking (nur Assets mit Rate, zwei Spalten), TOTAL 200 (breiter Jahres-Chart, Zahlen rechts), FOMC (Countdown links, Termine als Karten je Jahr).

## Grundsatz: A No-GitHub Future (25.11.2026)
- CoinAtlas soll später weg von GitHub: eigene Website und eigener Server, der 24/7 läuft (Roadmap, letzter Punkt).
- Bei jeder Entwicklung beachten: Daten bleiben als einfache JSON-Dateien mit festen Pfaden; alles Laden läuft über einen Loader (repoJson), dessen Quelle sich an einer Stelle umstellen lässt; Skripte laufen mit reinem Node (scripts/*.mjs), die GitHub-Workflows rufen nur diese Skripte auf; keine Funktion darf nur mit GitHub-Diensten gehen (Releases, Actions, raw.githubusercontent.com sind austauschbar).
- Roadmap: Proper Credit & Data Rules (vor Mobile): Bedingungen aller Datenquellen prüfen, Quellen in der geforderten Form nennen, Frage nach kommerzieller Nutzung kostenloser APIs klären.
- Live-Tag-Exporte: unter dem Datum eine zweite Zeile 'As of HH:MM Zeitzone · [Day Still in Progress]'.
- BTC|ETH-Export neu: echte UI des Fensters, für das Bild umgestellt: Spalte 1 Titel mit aktuellem Ratio (ohne Umrechner) und die drei Charts untereinander mit ihren Werten; Spalte 2 Past Years wie im Tab; Spalte 3 Formel und darunter das Reading.
- TOTAL 200: Zahlenblock entfernt; stattdessen ein Knopf über die ganze Breite „Marketcap Breakdown“ (Bitcoin, Ethereum, alle Stablecoins zusammen, Altcoins; Wert, Anteil, Balken; im Time Travel der Tag). Quellenzeile einzeilig, zentriert ganz unten, CoinGecko verlinkt. Gleiches im TOTAL-200-Export.
- Staking Rate History: ab dem ersten aufgenommenen Tag (keine 30 Tage mehr), Jahres-Chart in Lavendel wie TOTAL 200, Knöpfe für dieses und nächstes Jahr statt Zeitauswahl.
- Neuer Header-Knopf „Dominance“ (standardmäßig aus): Bitcoin, Ethereum, Stablecoins, Altcoins in % der Top 200, ein Jahres-Chart mit allen vier Linien, Tooltip mit allen Werten, Jahr-Auswahl. dominance.json hat dafür ein 7. Feld (alle Stablecoins %), Liste in scripts/stablecoins.mjs (gleich wie STABLECOINS der Seite); record-snapshot schreibt es nachts, backfill-total200 für die Tage davor.
- Reading in Exporten (Data Export BTC|ETH, Snapshot-PNG): das volle Reading wie auf der Seite nach der Asset-Wahl (gewähltes Asset, sonst BTC), nur Sätze mit swap/your fallen weg.
- Staking-Asset: beim Öffnen zuerst die Frage „How much X do you hold?“ (Eingabe, Continue / Continue without an Amount), Rest unscharf wie bei der Asset-Frage im Reading. Keine Zeitauswahl und kein $-Knopf mehr, Eingabefeld schmal und mittig. Anbieter anklickbar: eigene Ansicht mit Rate, Locked/Unlocked, Name des Anbieters als lila Link unter „Rate History“ (oben links nur Text, kein APY-Zusatz), Now / After 365 Days / Gain (Token, %, $) und der Rate History genau dieses Anbieters (staking-history.json hat alle Anbieter). Credit ganz unten unter dem Chart.
- Dominance: Kacheln anklickbar, dann nur diese Linie, auf ihren eigenen Bereich skaliert (Min/Max an der Achse); „‹ All four“ zurück. Stablecoins in Türkis (#2dd4bf, auch im Marketcap Breakdown). Data Export: neue Art „Dominance“ (Kacheln links, Jahres-Chart rechts).
- Staking-Asset: Mengen-Frage und Unschärfe wieder entfernt; Rate History nur noch in der Anbieter-Ansicht. Jahres-Charts (TOTAL 200, Staking, Dominance) haben eine Y-Achse rechts außerhalb des Charts mit runden Stufen (z. B. $2.2T, $2.4T … bzw. 0 %, 10 % …) und feinen Linien.
- Data Export: Knopf über die ganze Breite „Combine Exports“: zwei Exporte markieren (nummeriert 1 und 2), „Combine into one PNG“ baut beide (live bzw. Time-Travel-Tag) und legt sie in ein Bild, das erste über dem zweiten, zentriert. Test-Version.
- TOTAL 200 Y-Achse: nur ganze Billionen ($2T, $3T …), keine Linien durch den Chart; die Skala reicht bis zur nächsten ganzen Billion, wenn sie nah ist. Combine Exports: ein gemeinsamer Titel („CoinAtlas TOTAL 200 & Market Cap Dominance“), Datum darunter, ein Wasserzeichen unten rechts; CoinAtlas Default ist beim Kombinieren ausgegraut (enthält schon alles).
- Y-Achsen-Beschriftungen haben einen kleinen Strich davor, der genau die Höhe des Werts markiert. Dominance-Kacheln oben = gleiche Quelle wie Marketcap Breakdown (live aus der Liste bzw. im Time Travel der Tag); vorher kam Dominance aus dem letzten Snapshot und wich deshalb ab. Dominance-Export: Chart links, Werte rechts (wie TOTAL 200), dadurch beim Kombinieren beide Charts links.
- Data Export: Vorschau mit Lade-Anzeige öffnet sofort beim Klick; ein zweiter Klick während des Bauens wird ignoriert. Combine: eigenes Fortschrittsfenster („Building Sentiment Squares… [1/2]“, dann „Putting both into one image…“), Einzelvorschauen bleiben unsichtbar. Up/Down der Squares beim Kombinieren rechtsbündig.
- Stablecoin- und Altcoin-Dominanz werden jetzt jede Nacht gespeichert, nicht nur ausgerechnet: im Snapshot-Kopf ("stable", "alts" in %, neben btc/eth) und in dominance.json (Feld 7 Stablecoins %, Feld 8 Altcoins %). So ändert eine spätere Änderung der Stablecoin-Liste keinen vergangenen Tag. Nachgetragen für alle aufgenommenen Tage ab 12.11.2026; backfill-total200 schreibt beide Felder für die Tage davor. Die Seite (Dominance, Marketcap Breakdown im Time Travel, Snapshot-PNG mit [STABLES] [ALTS]) nimmt die gespeicherten Werte.
- Exporte folgen den Einstellungen des Fensters, das Layout bleibt: TOTAL 200 (gewähltes Jahr), Dominance (Jahr und fokussierte Linie, Kachel hervorgehoben), Staking (Suche), BTC|ETH, Fear & Greed, Sentiment Squares wie bisher; CoinAtlas Default unverändert. Ein vergangenes Jahr zeigt die gespeicherten Anteile seines letzten Tages; fehlen dort Stablecoin-Daten, steht „–“ statt einer Schätzung.
- Staking-Historie rückwirkend ab 01.01.2026 (Liquid Staking und Lending; ab 12.11. zählen die eigenen Aufnahmen, die nie ersetzt werden) (scripts/backfill-staking.mjs, Workflow „Backfill staking history“, Startdatum wählbar): DefiLlama liefert für jeden Pool den Tagesverlauf (/chart/{pool}); aufgenommene Tage werden nie ersetzt. Native Raten (Netzwerk-Quellen) haben keine Historie.
- Neue Raten (Test vom 27.11.2026 auf GitHub): Gram über tonapi.io wieder entfernt (12.9 % passte nicht zu Tonstakers' eigenen ~4–5 %), Tonstakers verlinkt auf app.tonstakers.com; dazu Liquid-Staking-Optionen aus DefiLlama: Bifrost vDOT (DOT), StackingDAO stSTX (STX), Sceptre sFLR (FLR). Sei und Osmosis über cosmos.directory eingebaut, liefern aber noch keinen Wert. Weiter ohne freie Quelle: Polkadot nativ (Subscan nur mit Key), Polygon, Sui (JSON-RPC abgeschaltet, GraphQL ohne APY), Tezos, ICP, TAO und die kleineren Chains.
- BTC|ETH-Fenster: Dominance Graph zeigt nur noch BTC und ETH (Linie, Legende, Tooltip); Stablecoins und Altcoins gibt es im Dominance-Fenster. Gilt auch für das Snapshot-PNG und den BTC|ETH-Export.
- FOMC: Termine zeigen nur den Tag der Entscheidung (z. B. „Wed, 9 Dec 2026“) statt beider Sitzungstage, im Fenster und im Export.
- Staking-Hinweis (Rate, not sponsored, Quellen) zentriert und mit mehr Abstand zum Chart.
- Nachgetragene Staking-Tage ohne Eintages-Spitzen: Werte über dem 1,8-Fachen oder unter einem 1,8tel des Medians von ±15 Tagen fallen weg (46 Stück), auch künftig im Backfill-Skript.

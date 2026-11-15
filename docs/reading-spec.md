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
  Ein Help-Knopf neben den Filtern erklärt Jahrestypen, Phasen, Neutral-Zone und Extreme Months. Fenster-Monate tragen einen gestrichelten gelben Rahmen.
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

- Über dem Reading: "Which asset are you holding right now?" mit Bitcoin / Ethereum. Die Antwort gilt für den UTC-Tag (localStorage "coinatlas-holding").
  - BTC-Halter: "Now is a good time to swap BTC into ETH." bei Stufe A/B, sonst "Today is not a day to swap."
  - ETH-Halter: "Now is a good time to swap ETH into BTC." sobald das Ratio 10 % unter der Year Line liegt, sonst "Today is not a day to swap."
  - Ohne Antwort: die eigene Spur (nur deren Swap-Tage), sonst "Today is not a day to swap." "Hold your ETH" gibt es nicht mehr.
- Kauf nur in Fear und Extreme Fear als zweiter Satz: "It's currently a good time to buy Bitcoin/Ethereum." (die günstigere Seite),
  ohne Lean "…to add to what you already hold." In Greed: "keep your USDC and wait for Fear." Sonst nichts zum Kauf.
- Strong-Lean (Score ab 3) im Extreme Window ohne Swap, auf der Seite des Halters: "Swapping X into Y would be a good idea right now
  if you believe in the Extreme Window thesis." Explanation: "What is an Extreme Window?" und "Why could a swap inside an Extreme Window be a good idea?"
  mit den gemessenen Zahlen (innen etwa 7 von 10 im Plus, außen etwa 6 von 10, Bear-Fenster alle, Bull-Fenster keiner).
- Hindsight nach einem Kauf: der höchste Wert danach ("Afterwards the highest value of ETH was $X on <Datum>, a +Y% gain") statt des heutigen Werts,
  verglichen mit dem höchsten Wert der anderen Seite.

## Offene Punkte

- Kritischer Rundum-Test des neuen Systems (nur auf Wunsch des Nutzers).
- Ab sofort das Reading des Tages mitschreiben, um die Regeln an ungesehenen Tagen zu prüfen.

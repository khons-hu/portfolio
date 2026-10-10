/* Portfolio guide with optional server-side AI and a local fallback. */
(function () {
  const normalize = text => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/g,'l').replace(/ß/g,'ss').replace(/[\u064b-\u065f\u0670\u0640]/g,'').replace(/[^\p{L}\p{M}\p{N}+ ]/gu, ' ').replace(/\s+/g, ' ').trim();
  const topics = [
    {id:'work', keys:['what do you do','co robis','cim sa zivis','l2','support','integration','integrations','integracie','integracii','luigi','lbx','praca','praci','pracujes','work','job','audit','aws','sentry'], en:'Patrick is a Customer Support Partner L2 at Luigi’s Box, which builds e-commerce search and product discovery. He investigates browser behaviour, APIs, feeds and analytics, audits integrations, verifies fixes and prepares engineering handovers. He uses AWS and Sentry to investigate service issues and review errors. His work includes implementation, refactoring, backend analysis and optimising collectors and event handling. Analytics work covers GTM, dataLayer, duplicate purchases, attribution and legacy Persoo integrations.', sk:'Patrick pracuje ako Customer Support Partner L2 v Luigi’s Box. Rieši správanie webu, API, produktové feedy a analytiku, robí audity integrácií, overuje opravy a pripravuje podklady pre vývojárov. Luigi’s Box tvorí vyhľadávanie a odporúčanie produktov pre e-shopy. Práca zahŕňa aj implementácie a refaktoring, backend analýzu a optimalizáciu výkonu collectorov a spracovania udalostí. Opravy analytiky pokrývajú GTM, dataLayer, duplicitné nákupy a atribúciu vrátane pôvodných Persoo integrácií. Používa aj AWS a Sentry na vyšetrovanie problémov služieb, kontrolu chýb a overovanie opráv.', section:'about'},
    {"id": "spotify", "keys": ["spotify", "rotation", "playlist", "hudba", "music", "mood", "nalada"], "en": "On a manual AI refresh, Jev uses only track and artist names to choose a direction and rank up to 18 Spotify search results. It does not analyse audio. The ranking is cached for seven days. Mood playlists are separate and on demand, using Spotify search and familiar-artist preferences. The managed playlist is private and checked after each refresh. The tool runs locally on my Mac; its source is not public.", "sk": "Pri manuálnom AI obnovení používa Jev iba názvy skladieb a interpretov na výber smeru a zoradenie najviac 18 výsledkov Spotify. Zvuk neanalyzuje. Poradie sa ukladá na sedem dní. Playlisty podľa nálady sú samostatné a na požiadanie; využívajú vyhľadávanie Spotify a lokálne preferencie interpretov. Spravovaný playlist je súkromný a po obnovení sa kontroluje. Nástroj beží lokálne na mojom Macu; zdrojový kód nie je verejný.", "project": "rotation"},
    {id:'dots', keys:['dots','spring','react'], en:"Originally built with React and Spring Boot in 2023. The browser edition reuses the original React screens and dot images, with local game logic. Five levels, a power-up shop and guest play. No login or shared leaderboard. Play the browser edition online or explore the original source.", sk:"Pôvodne vytvorená v roku 2023 v Reacte a Spring Boote. Browser verzia používa pôvodné React obrazovky a obrázky bodiek, herná logika beží lokálne. Päť úrovní, obchod s bonusmi a hranie bez účtu. Bez prihlásenia a spoločného rebríčka. Browser verziu si môžeš zahrať online alebo si pozrieť pôvodný kód.", project:'dots'},
    {id:'bot', keys:['bot','cslys','discord bot','music bot'], en:'CSLYS is an earlier JavaScript Discord bot with music playback. The repository is historical, so current Discord and music-service compatibility is not guaranteed.', sk:'CSLYS je starší JavaScript Discord bot s prehrávaním hudby. Repozitár je historický, takže kompatibilita s dnešnými API nie je overená.', project:'bot'},
    {id:'cpp', keys:['harness','harnessing','agent work','skills','evaluation'], en:'Patrick builds small agent workflows with reusable skills and explicit checks. The field notes cover Trialkeep, Feedcairn and Reasonrook, with a recorded failed decision and three downloadable skill templates.', sk:'AI harnessing · AI agents · reusable skills · workflow automation · evaluation. Trialkeep, Feedcairn, Reasonrook.', section:'field-notes'},
    {id:'openai', keys:['openai','tibo','codex','fan','fandi','fandis','thsottiaux'], en:'He follows Tibo closely for the pace of his work at OpenAI and how he talks about what they’re building. This is a personal interest, not an affiliation.', sk:'Momentálne sleduje najmä Tiba. Páči sa mu tempo jeho práce v OpenAI a spôsob, akým hovorí o tom, čo tvoria. Ide o osobný záujem, nie pracovné prepojenie.', section:'now'},
    {id:'study', keys:['university','degree','thesis','tuke','ppo','reinforcement','school','skola','studium','diplomovka','diplomov','vzdelanie'], en:'Patrick has a master’s in Computer Science from TUKE. His thesis combined PPO reinforcement-learning agents and LLM-driven map generation for a multiplayer game.', sk:'Patrick má magisterské vzdelanie v informatike z TUKE. V diplomovej práci spojil PPO reinforcement-learning agentov s generovaním máp pomocou LLM pre multiplayerovú hru.', section:'now'},
    {id:'projects', keys:['projects','project','projekty','projekt','built','builds','portfolio'], en:"Trialkeep · Feedcairn · Reasonrook. Reasonrook is a free practice workshop with 15 original exercises in coding, debugging, logic, prompts and agent skills. It has local JavaScript, TypeScript and Python checks, gradual hints, self-review and saved drafts. The source is public on GitHub.", sk:"Trialkeep · Feedcairn · Reasonrook. Reasonrook je bezplatná dielňa s 15 pôvodnými úlohami na kódovanie, debugging, logiku, prompty a agent skills. Má lokálne JavaScript, TypeScript a Python testy, postupné nápovedy, vlastné hodnotenie a uložené poznámky. Zdrojový kód je verejný na GitHube.", section:'projects'},
    {id:'contact', keys:['contact','kontakt','email','hire','hiring','reach','discord','github','twitter','linkedin','unbenchmark','model reviews'], en:'You can find Patrick on GitHub as khons-hu, on X as @ptr1337_, and on Discord as khons.hu. I can show you those links, but I can’t send a message or speak for him.', sk:'Patrick je na GitHube ako khons-hu, na X ako @ptr1337_ a na Discorde ako khons.hu. Ukážem ti odkazy, ale nemôžem poslať správu ani hovoriť v jeho mene.', section:'contact'},
    {id:'about', keys:['kto si','povedz mi o sebe','who are you','about','who','patrick','khonsu','yourself','kto','tebe','zacal','zaciatky','started','background','name','nickname','handle','moon knight','moonknight','meno','prezyvka','nev','nazwa','pseudonim','jmeno'], en:'Patrick Obrtal · khonsu. Patrick is a Customer Support Partner L2 at Luigi’s Box, which builds e-commerce search and product discovery. Patrick has a master’s in Computer Science from TUKE. His thesis combined PPO reinforcement-learning agents and LLM-driven map generation for a multiplayer game.', sk:'Patrick Obrtal · khonsu. Patrick pracuje ako Customer Support Partner L2 v Luigi’s Box. Patrick má magisterské vzdelanie v informatike z TUKE. V diplomovej práci spojil PPO reinforcement-learning agentov s generovaním máp pomocou LLM pre multiplayerovú hru.', section:'about'},
    {id:'ai', keys:['agi','rsi','agents','agent','ai','models','modely','llm'], en:"Patrick builds and reviews projects with Codex and Claude. Jev helps with small decisions, candidate selection and relevance ordering. He checks the results separately.", sk:"Patrick pri tvorbe a kontrole projektov používa Codex a Claude. Jev mu pomáha s menšími rozhodnutiami, výberom kandidátov a radením podľa relevancie. Výsledky overuje samostatne.", section:'now'},
    {id:'games', keys:['games','gaming','hry','hras','hrava'], en:'Originally built with React and Spring Boot in 2023. The browser edition reuses the original React screens and dot images, with local game logic. Five levels, a power-up shop and guest play. No login or shared leaderboard. Play the browser edition online or explore the original source.', sk:'Pôvodne vytvorená v roku 2023 v Reacte a Spring Boote. Browser verzia používa pôvodné React obrazovky a obrázky bodiek, herná logika beží lokálne. Päť úrovní, obchod s bonusmi a hranie bez účtu. Bez prihlásenia a spoločného rebríčka. Browser verziu si môžeš zahrať online alebo si pozrieť pôvodný kód.', section:'about'}
  ];
  const localeData=typeof module!=='undefined'&&module.exports?require('./language-data.js'):{EXTRA_LOCALE_PACKS,GUIDE_KEYWORDS:globalThis.KHONSU_GUIDE_KEYWORDS||{},languageDirection,directionalText};
  const locales={...(typeof module!=='undefined'&&module.exports?require('./guide-locales.js'):GUIDE_LOCALES)};
  const extraKeys={work:['mit dolgozol','mivel foglalkozol','munka','dolgozik','prace','pracujesz','pracuji','co delas','prace','arbeit','beruf','was machst du','integracio','integracje'],spotify:['zene','lejatszasi lista','muzyka','hudba','musik'],cpp:['folyamatok','procesami','prozesse'],study:['egyetem','diploma','tanult','wyksztalcenie','studia','uczelni','vzdelani','diplomova','abschluss','studium','universitat'],projects:['projektek','projekteken','projektjeid','projektjei','projektet','projektach','projektami','jakimi projektami','projektow','projektech','projekten','projekte','zbudowal'],contact:['kapcsolat','elerhetoseg','elerni','skontaktowac','zatrudnic','erreichen','kontaktovat'],about:['ki vagy','kicsoda','magadrol','kim jestes','o sobie','wer bist du','uber dich','kdo jsi','o sobe'],ai:['mesterseges intelligencia','modellek','sztuczna inteligencja','modelle','kunstliche intelligenz'],games:['jatekok','jatszol','gry','grasz','hrajes','spiele','spielst']};
  topics.forEach((topic,index)=>{topic.keys.push(...(extraKeys[topic.id]||[]));Object.keys(locales).forEach(lang=>topic[lang]=locales[lang].answers[index]);});
  topics.push({"id": "calculator", "keys": ["arduino", "calculator", "kalkulack", "szamologep", "kalkulator", "taschenrechner", "calculadora"], "section": "projects", "en": "Built with a team at TUKE using an Arduino Uno, a keypad and an LCD. It evaluates arithmetic expressions with brackets and keeps calculation history.", "sk": "Tímový projekt na TUKE s Arduino Uno, klávesnicou a LCD. Vyhodnocuje aritmetické výrazy so zátvorkami a uchováva históriu výpočtov.", "hu": "A TUKE-n csapatban készült, Arduino Uno, billentyűzet és LCD használatával. Zárójeles számtani kifejezéseket értékel ki, és megőrzi a számítások előzményeit.", "pl": "Projekt zespołowy na TUKE z Arduino Uno, klawiaturą i LCD. Oblicza wyrażenia arytmetyczne z nawiasami i zachowuje historię obliczeń.", "de": "Im Team an der TUKE mit Arduino Uno, Tastenfeld und LCD gebaut. Wertet arithmetische Ausdrücke mit Klammern aus und speichert den Rechenverlauf.", "es": "Creado en equipo en TUKE con Arduino Uno, teclado y LCD. Evalúa expresiones aritméticas con paréntesis y guarda el historial de cálculos.", "cs": "Týmový projekt na TUKE s Arduino Uno, klávesnicí a LCD. Vyhodnocuje aritmetické výrazy se závorkami a uchovává historii výpočtů."});
  topics.push(...[{"id": "site", "keys": ["this site", "this website", "portfolio site", "terminal", "theme", "themes", "tento web", "weboldal", "strona", "diese website"], "project": "portfolio", "en": "This portfolio uses HTML, CSS and JavaScript, with terminal navigation, light and dark themes, and a guide in multiple languages. The guide answers with an AI model through Groq when available, otherwise with prepared answers. Updates deploy from GitHub to Vercel.", "sk": "Toto portfólio používa HTML, CSS a JavaScript. Má terminál, svetlú a tmavú tému a sprievodcu vo viacerých jazykoch. Keď je dostupný, odpovedá AI model cez Groq, inak pripravené odpovede. Zmeny sa publikujú z GitHubu na Vercel.", "hu": "Ez a portfólió HTML-t, CSS-t és JavaScriptet használ. Terminált, világos és sötét témát, valamint többnyelvű útmutatót tartalmaz. Ha elérhető, egy AI-modell válaszol a Groq szolgáltatáson keresztül, egyébként előre megírt válaszok. A frissítések GitHubról kerülnek a Vercelre.", "pl": "To portfolio używa HTML, CSS i JavaScript. Ma terminal, jasny i ciemny motyw oraz przewodnik w wielu językach. Gdy to możliwe, odpowiada model AI przez Groq, a w razie potrzeby przygotowane odpowiedzi. Aktualizacje trafiają z GitHuba na Vercel.", "cs": "Toto portfolio používá HTML, CSS a JavaScript. Má terminál, světlé a tmavé téma a průvodce ve více jazycích. Když je dostupný, odpovídá AI model přes Groq, jinak připravené odpovědi. Změny se publikují z GitHubu na Vercel.", "de": "Dieses Portfolio nutzt HTML, CSS und JavaScript, mit Terminal, hellem und dunklem Design und einem Guide in mehreren Sprachen. Wenn verfügbar, antwortet ein KI-Modell über Groq, sonst vorbereitete Antworten. Updates werden von GitHub auf Vercel veröffentlicht."}, {"id": "discovery", "keys": ["discovery", "routines", "autofollow", "weekly workflows", "rotation stuff", "automatizacie", "automatizace", "automatyzacja"], "project": "discovery", "en": "Discovery routines are weekly workflows for X recommendations and up to three relevant GitHub follows. They review candidates with an AI agent. The first scheduled run has not yet been verified.", "sk": "Discovery routines sú týždenné workflowy pre odporúčania účtov na X a sledovanie najviac troch relevantných vývojárov na GitHube. Kandidátov posudzuje AI agent. Prvý naplánovaný beh ešte nebol overený.", "hu": "A Discovery routines heti munkafolyamatokat jelent X-fiókok ajánlására és legfeljebb három releváns GitHub-fejlesztő követésére. A jelölteket AI-ágens értékeli. Az első ütemezett futás még nincs ellenőrizve.", "pl": "Discovery routines to cotygodniowe rekomendacje kont na X i obserwowanie maksymalnie trzech odpowiednich programistów na GitHubie. Kandydatów ocenia agent AI. Pierwszy zaplanowany przebieg nie został jeszcze zweryfikowany.", "cs": "Discovery routines jsou týdenní workflowy pro doporučení účtů na X a sledování nejvýše tří relevantních vývojářů na GitHubu. Kandidáty posuzuje AI agent. První naplánovaný běh ještě nebyl ověřen.", "de": "Discovery routines empfehlen wöchentlich X-Konten und folgen bis zu drei passenden GitHub-Entwicklern. Ein KI-Agent prüft die Kandidaten. Der erste geplante Durchlauf wurde noch nicht verifiziert."}]);
  Object.entries({"en": "Current projects include this portfolio and Discovery routines. ", "sk": "Aktuálne projekty zahŕňajú toto portfólio a Discovery routines. ", "hu": "A jelenlegi projektek közé tartozik ez a portfólió és a Discovery routines. ", "pl": "Aktualne projekty obejmują to portfolio i Discovery routines. ", "cs": "Aktuální projekty zahrnují toto portfolio a Discovery routines. ", "de": "Zu den aktuellen Projekten gehören dieses Portfolio und Discovery routines. "}).forEach(([lang,text])=>{topics.find(t=>t.id==='projects')[lang]=text+topics.find(t=>t.id==='projects')[lang];});
  topics.push({"id": "thinkroom", "keys": ["reasonrook", "khonsolve", "thinkroom", "practice", "leetcode", "hackerrank", "puzzles"], "project": "thinkroom", "en": "Reasonrook is a free practice workshop with 15 original exercises in coding, debugging, logic, prompts and agent skills. It has local JavaScript, TypeScript and Python checks, gradual hints, self-review and saved drafts. The source is public on GitHub.", "sk": "Reasonrook je bezplatná dielňa s 15 pôvodnými úlohami na kódovanie, debugging, logiku, prompty a agent skills. Má lokálne JavaScript, TypeScript a Python testy, postupné nápovedy, vlastné hodnotenie a uložené poznámky. Zdrojový kód je verejný na GitHube.", "hu": "A Reasonrook ingyenes gyakorlóműhely 15 saját feladattal: kódolás, hibakeresés, logika, promptok és agent skillek. Helyi JavaScript-, TypeScript- és Python-teszteket, fokozatos segítséget, önértékelést és mentett jegyzeteket kínál. A forráskód nyilvános a GitHubon.", "pl": "Reasonrook to bezpłatny warsztat z 15 autorskimi zadaniami z programowania, debugowania, logiki, promptów i agent skills. Ma lokalne testy JavaScript, TypeScript i Python, stopniowe podpowiedzi, samoocenę i zapisane notatki. Kod jest publiczny na GitHubie.", "cs": "Reasonrook je bezplatná dílna s 15 původními úlohami na programování, debugging, logiku, prompty a agent skills. Má místní JavaScript, TypeScript a Python testy, postupné nápovědy, vlastní hodnocení a uložené poznámky. Kód je veřejný na GitHubu.", "de": "Reasonrook ist eine kostenlose Übungswerkstatt mit 15 eigenen Aufgaben zu Programmierung, Debugging, Logik, Prompts und Agent Skills. Sie bietet lokale JavaScript-, TypeScript- und Python-Tests, schrittweise Hinweise, Selbstbewertung und gespeicherte Notizen. Der Quellcode ist auf GitHub öffentlich."});
  Object.assign(topics.find(t=>t.id==='contact'),{"en": "You can email Patrick using “Email Patrick” below. It sends only the contact form through FormSubmit, not this conversation. You can also find him on GitHub, LinkedIn, X and Discord.", "sk": "Patrickovi môžeš napísať cez „Napísať Patrickovi“ nižšie. Cez FormSubmit sa odošle iba kontaktný formulár, nie tento rozhovor. Nájdeš ho aj na GitHube, LinkedIne, X a Discorde.", "hu": "Az alábbi „Írj Patricknak” űrlappal küldhetsz üzenetet. A FormSubmit csak az űrlapot továbbítja, ezt a beszélgetést nem. Megtalálod GitHubon, LinkedInen, X-en és Discordon is.", "pl": "Możesz wysłać wiadomość przez formularz „Napisz do Patricka” poniżej. FormSubmit przesyła tylko formularz, nie tę rozmowę. Znajdziesz go też na GitHubie, LinkedInie, X i Discordzie.", "cs": "Patrickovi můžeš napsat přes „Napsat Patrickovi“ níže. FormSubmit odešle pouze formulář, ne tento rozhovor. Najdeš ho i na GitHubu, LinkedInu, X a Discordu.", "de": "Du kannst unten über „Patrick schreiben“ eine Nachricht senden. FormSubmit übermittelt nur das Formular, nicht dieses Gespräch. Du findest ihn auch auf GitHub, LinkedIn, X und Discord."});
  topics.push({"id": "signal", "keys": ["feedcairn", "khonrelay", "stakeglass", "khonodds", "quiet signal", "rss", "ai news", "market watch", "polymarket"], "section": "projects", "en": "Feedcairn collects official AI news, releases and status feeds with RSS export. Stakeglass is a read-only Polymarket research app with wallet watchlists and open-page trade alerts. These apps are live on Vercel. Stakeglass loads live data. An optional daily digest runs on the server. Register each device separately. Web Push was tested in Brave on macOS. Phone delivery has not been tested.", "sk": "Feedcairn zbiera oficiálne AI novinky, vydania a stav služieb s RSS exportom. Stakeglass slúži na čítanie dát Polymarketu, sledovanie peňaženiek a upozornenia na obchody pri otvorenej stránke. Tieto appky sú dostupné na Verceli. Stakeglass načítava živé dáta. Voliteľný denný prehľad beží na serveri. Každé zariadenie treba pripojiť samostatne. Web Push je otestovaný v Brave na macOS. Doručenie na telefónoch zatiaľ nie.", "hu": "A Feedcairn hivatalos AI-híreket, kiadásokat és szolgáltatásállapotokat gyűjt RSS-exporttal. A Stakeglass Polymarket-kutatásra szolgál, tárcalistákkal és nyitott oldalon működő kereskedési értesítésekkel. Ezek az alkalmazások elérhetők a Vercelen. A Stakeglass élő adatokat tölt be. Az opcionális napi összefoglaló a szerveren fut. Minden eszközt külön kell csatlakoztatni. A Web Push macOS-en, Brave-ben tesztelve. Telefonos kézbesítés még nincs tesztelve.", "pl": "Feedcairn zbiera oficjalne wiadomości AI, wydania i status usług z eksportem RSS. Stakeglass służy do analizy Polymarket, obserwowania portfeli i alertów przy otwartej stronie. Te aplikacje są dostępne na Vercelu. Stakeglass pobiera dane na żywo. Opcjonalne codzienne podsumowanie działa na serwerze. Każde urządzenie wymaga osobnej rejestracji. Web Push przetestowano w Brave na macOS. Dostarczenia na telefony jeszcze nie testowano.", "cs": "Feedcairn sbírá oficiální AI novinky, vydání a stav služeb s RSS exportem. Stakeglass slouží ke čtení dat Polymarketu, sledování peněženek a upozornění při otevřené stránce. Tyto aplikace jsou dostupné na Vercelu. Stakeglass načítá živá data. Volitelný denní přehled běží na serveru. Každé zařízení je třeba připojit zvlášť. Web Push je otestovaný v Brave na macOS. Doručení na telefonech zatím ne.", "de": "Feedcairn sammelt offizielle KI-Nachrichten, Releases und Statusmeldungen mit RSS-Export. Stakeglass bietet Polymarket-Recherche, Wallet-Beobachtungslisten und Handelshinweise bei geöffneter Seite. Diese Apps sind auf Vercel verfügbar. Stakeglass lädt Live-Daten. Eine optionale tägliche Zusammenfassung läuft auf dem Server. Jedes Gerät muss einzeln verbunden werden. Web Push wurde in Brave unter macOS getestet. Die Zustellung auf Handys wurde noch nicht getestet."});
  topics.push({"id": "steam", "keys": ["lootlatch", "khonstash", "steam shelf", "steam market", "skins", "steam item", "hourboost"], "section": "projects", "en": "Lootlatch is a Steam item watchlist with manual EUR price checks, fee estimates, local notes and backup export. Target notices appear after a check. It does not trade, boost hours or monitor prices when closed.", "sk": "Lootlatch je watchlist Steam itemov s manuálnou kontrolou cien v EUR, odhadom poplatkov, lokálnymi poznámkami a exportom zálohy. Upozornenie na cieľovú cenu sa zobrazí po kontrole. Appka neobchoduje, nenafukuje odohrané hodiny a nesleduje ceny po zatvorení.", "hu": "A Lootlatch Steam-tárgyak figyelőlistája, kézi EUR-árellenőrzéssel, díjbecsléssel, helyi jegyzetekkel és biztonsági mentéssel. A célárjelzés ellenőrzés után jelenik meg. Nem kereskedik, nem növeli mesterségesen a játékidőt, és bezárva nem figyeli az árakat.", "pl": "Lootlatch to lista obserwowanych przedmiotów Steam z ręcznym sprawdzaniem cen w EUR, szacunkiem opłat, lokalnymi notatkami i kopią zapasową. Alert ceny docelowej pojawia się po sprawdzeniu. Aplikacja nie handluje, nie nabija godzin i nie śledzi cen po zamknięciu.", "cs": "Lootlatch je seznam sledovaných Steam předmětů s ruční kontrolou cen v EUR, odhadem poplatků, místními poznámkami a exportem zálohy. Upozornění na cílovou cenu se zobrazí po kontrole. Aplikace neobchoduje, nenavyšuje odehrané hodiny a nesleduje ceny po zavření.", "de": "Lootlatch ist eine Merkliste für Steam-Gegenstände mit manuellen EUR-Preisabfragen, Gebührenschätzung, lokalen Notizen und Sicherungsexport. Zielpreishinweise erscheinen nach einer Abfrage. Die App handelt nicht, erhöht keine Spielstunden und überwacht keine Preise im Hintergrund."});
  Object.entries({"en": "Reasonrook · Feedcairn · Stakeglass. Feedcairn collects official AI news, releases and status feeds with RSS export. Stakeglass is a read-only Polymarket research app with wallet watchlists and open-page trade alerts. These apps are live on Vercel. Stakeglass loads live data. An optional daily digest runs on the server. Register each device separately. Web Push was tested in Brave on macOS. Phone delivery has not been tested.", "sk": "Reasonrook · Feedcairn · Stakeglass. Feedcairn zbiera oficiálne AI novinky, vydania a stav služieb s RSS exportom. Stakeglass slúži na čítanie dát Polymarketu, sledovanie peňaženiek a upozornenia na obchody pri otvorenej stránke. Tieto appky sú dostupné na Verceli. Stakeglass načítava živé dáta. Voliteľný denný prehľad beží na serveri. Každé zariadenie treba pripojiť samostatne. Web Push je otestovaný v Brave na macOS. Doručenie na telefónoch zatiaľ nie.", "hu": "Reasonrook · Feedcairn · Stakeglass. A Feedcairn hivatalos AI-híreket, kiadásokat és szolgáltatásállapotokat gyűjt RSS-exporttal. A Stakeglass Polymarket-kutatásra szolgál, tárcalistákkal és nyitott oldalon működő kereskedési értesítésekkel. Ezek az alkalmazások elérhetők a Vercelen. A Stakeglass élő adatokat tölt be. Az opcionális napi összefoglaló a szerveren fut. Minden eszközt külön kell csatlakoztatni. A Web Push macOS-en, Brave-ben tesztelve. Telefonos kézbesítés még nincs tesztelve.", "pl": "Reasonrook · Feedcairn · Stakeglass. Feedcairn zbiera oficjalne wiadomości AI, wydania i status usług z eksportem RSS. Stakeglass służy do analizy Polymarket, obserwowania portfeli i alertów przy otwartej stronie. Te aplikacje są dostępne na Vercelu. Stakeglass pobiera dane na żywo. Opcjonalne codzienne podsumowanie działa na serwerze. Każde urządzenie wymaga osobnej rejestracji. Web Push przetestowano w Brave na macOS. Dostarczenia na telefony jeszcze nie testowano.", "cs": "Reasonrook · Feedcairn · Stakeglass. Feedcairn sbírá oficiální AI novinky, vydání a stav služeb s RSS exportem. Stakeglass slouží ke čtení dat Polymarketu, sledování peněženek a upozornění při otevřené stránce. Tyto aplikace jsou dostupné na Vercelu. Stakeglass načítá živá data. Volitelný denní přehled běží na serveru. Každé zařízení je třeba připojit zvlášť. Web Push je otestovaný v Brave na macOS. Doručení na telefonech zatím ne.", "de": "Reasonrook · Feedcairn · Stakeglass. Feedcairn sammelt offizielle KI-Nachrichten, Releases und Statusmeldungen mit RSS-Export. Stakeglass bietet Polymarket-Recherche, Wallet-Beobachtungslisten und Handelshinweise bei geöffneter Seite. Diese Apps sind auf Vercel verfügbar. Stakeglass lädt Live-Daten. Eine optionale tägliche Zusammenfassung läuft auf dem Server. Jedes Gerät muss einzeln verbunden werden. Web Push wurde in Brave unter macOS getestet. Die Zustellung auf Handys wurde noch nicht getestet."}).forEach(([lang,text])=>topics.find(t=>t.id==='projects')[lang]=text);
  Object.entries({"en": "Lootlatch is a Steam item watchlist with manual EUR price checks, fee estimates, local notes and backup export. Target notices appear after a check. It does not trade, boost hours or monitor prices when closed.", "sk": "Lootlatch je watchlist Steam itemov s manuálnou kontrolou cien v EUR, odhadom poplatkov, lokálnymi poznámkami a exportom zálohy. Upozornenie na cieľovú cenu sa zobrazí po kontrole. Appka neobchoduje, nenafukuje odohrané hodiny a nesleduje ceny po zatvorení.", "hu": "A Lootlatch Steam-tárgyak figyelőlistája, kézi EUR-árellenőrzéssel, díjbecsléssel, helyi jegyzetekkel és biztonsági mentéssel. A célárjelzés ellenőrzés után jelenik meg. Nem kereskedik, nem növeli mesterségesen a játékidőt, és bezárva nem figyeli az árakat.", "pl": "Lootlatch to lista obserwowanych przedmiotów Steam z ręcznym sprawdzaniem cen w EUR, szacunkiem opłat, lokalnymi notatkami i kopią zapasową. Alert ceny docelowej pojawia się po sprawdzeniu. Aplikacja nie handluje, nie nabija godzin i nie śledzi cen po zamknięciu.", "cs": "Lootlatch je seznam sledovaných Steam předmětů s ruční kontrolou cen v EUR, odhadem poplatků, místními poznámkami a exportem zálohy. Upozornění na cílovou cenu se zobrazí po kontrole. Aplikace neobchoduje, nenavyšuje odehrané hodiny a nesleduje ceny po zavření.", "de": "Lootlatch ist eine Merkliste für Steam-Gegenstände mit manuellen EUR-Preisabfragen, Gebührenschätzung, lokalen Notizen und Sicherungsexport. Zielpreishinweise erscheinen nach einer Abfrage. Die App handelt nicht, erhöht keine Spielstunden und überwacht keine Preise im Hintergrund."}).forEach(([lang,text])=>topics.find(t=>t.id==='projects')[lang]+=' '+text);
  topics.push({"id":"proof","keys":["trialkeep", "khonproof","benchmark","benchmarks","evaluation","evaluacia","browser course","skill lab"],"project":"proof","en":"A small lab for agent decisions, browser tasks, skill comparisons, deploy checks and claims. It includes 20 browser tasks and measured reports. Model tests run locally with your own API key.","sk":"Malé laboratórium na rozhodovanie agentov, browser úlohy, porovnávanie skills, kontroly nasadenia a tvrdení. 20 browser úloh a import meraných reportov. Jev aj jednoduchý skript majú zverejnené výsledky vrátane chýb. Modelové testy bežia lokálne s vlastným API kľúčom. Malá vzorka, nie všeobecný rebríček modelov.","hu":"Kis labor az ágensek döntéseihez, böngészőfeladatokhoz, utasítások összehasonlításához, telepítések és állítások ellenőrzéséhez. 20 böngészőfeladat és mérési jelentések importálása. A Jev és egy egyszerű szkript eredményei a hibákkal együtt láthatók. A modelltesztek helyben futnak saját API-kulccsal. Kis minta, nem általános modellrangsor.","pl":"Małe laboratorium decyzji agentów, zadań przeglądarkowych, porównań instrukcji, wdrożeń i twierdzeń. 20 zadań przeglądarkowych i import raportów. Wyniki Jev i prostego skryptu zawierają również błędy. Testy modeli działają lokalnie z własnym kluczem API. Mała próbka, nie ogólny ranking modeli.","de":"Ein kleines Labor für Agentenentscheidungen, Browseraufgaben, Anweisungsvergleiche, Deployments und Behauptungen. 20 Browseraufgaben und Import gemessener Berichte. Ergebnisse von Jev und einem einfachen Skript zeigen auch Fehler. Modelltests laufen lokal mit eigenem API-Schlüssel. Kleine Stichprobe, keine allgemeine Modellrangliste.","es":"Un pequeño laboratorio de decisiones de agentes, tareas de navegador, instrucciones, despliegues y afirmaciones. 20 tareas de navegador e importación de informes. Los resultados de Jev y un script sencillo incluyen los fallos. Las pruebas de modelos se ejecutan localmente con una clave API propia. Una muestra pequeña, no una clasificación general.","cs":"Malá laboratoř pro rozhodování agentů, úlohy v prohlížeči, porovnání instrukcí, nasazení a tvrzení. 20 úloh v prohlížeči a import naměřených reportů. Výsledky Jev i jednoduchého skriptu zahrnují také chyby. Modelové testy běží lokálně s vlastním API klíčem. Malý vzorek, nikoli obecný žebříček modelů."});
  const spanishTopics = {"site": "Este portfolio usa HTML, CSS y JavaScript, con terminal, temas claro y oscuro y una guía en varios idiomas. Cuando está disponible responde un modelo de IA a través de Groq; si no, respuestas preparadas. Se publica desde GitHub en Vercel.", "discovery": "Rutinas semanales para recomendar cuentas de X y seguir hasta tres desarrolladores relevantes de GitHub. Un agente de IA revisa candidatos. La primera ejecución programada aún no está verificada.", "signal": "Feedcairn reúne noticias oficiales de IA, lanzamientos y estado de servicios con exportación RSS. Stakeglass permite investigar Polymarket y recibir avisos con la página abierta. Ambas están en Vercel. Un resumen diario opcional se ejecuta en el servidor. Hay que registrar cada dispositivo por separado. Web Push probado en Brave para macOS. El envío a teléfonos aún no se ha probado.", "steam": "Lootlatch permite consultar manualmente precios EUR de objetos Steam, estimar comisiones y guardar notas y copias. Los avisos de precio aparecen tras una consulta. No opera, no aumenta horas ni vigila precios al cerrar.", "thinkroom": "Reasonrook es un taller gratuito con 15 ejercicios de código, depuración, lógica, prompts y agent skills. Ofrece pruebas locales de JavaScript, TypeScript y Python, pistas graduales y notas. Código público en GitHub."};
  topics.forEach(topic=>{if(spanishTopics[topic.id])topic.es=spanishTopics[topic.id];});
  Object.entries({"en": "Optional Jev reading order uses precomputed scores. It does not hide posts or change alerts.", "sk": "Voliteľné poradie od Jev používa vopred vypočítané skóre. Neskrýva príspevky ani nemení upozornenia.", "hu": "Az opcionális Jev-sorrend előre kiszámított pontszámokat használ. Nem rejt el bejegyzéseket és nem módosítja az értesítéseket.", "pl": "Opcjonalna kolejność Jev korzysta z wcześniej obliczonych ocen. Nie ukrywa wpisów ani nie zmienia powiadomień.", "de": "Die optionale Jev-Reihenfolge nutzt vorberechnete Bewertungen. Beiträge bleiben sichtbar und Benachrichtigungen unverändert.", "es": "El orden opcional de Jev usa puntuaciones precalculadas. No oculta publicaciones ni cambia los avisos.", "cs": "Volitelné pořadí od Jev používá předem vypočítaná skóre. Neskrývá příspěvky ani nemění upozornění."}).forEach(([lang,text])=>{topics.find(t=>t.id==='signal')[lang]+=' '+text;});
  const spanishKeys={work:['trabajo','soporte','que haces','integraciones'],projects:['proyectos','proyecto'],about:['quien eres','sobre ti','nombre'],study:['universidad','tesis','estudios'],contact:['contacto','correo','contratar'],games:['juegos','juegas'],ai:['inteligencia artificial','modelos'],spotify:['musica'],site:['esta web','este sitio']};
  topics.forEach(topic=>topic.keys.push(...(spanishKeys[topic.id]||[])));
  // These packs use topic IDs so inserting a topic cannot shift the translations.
  // Keywords for every language are always present, so a question matches in any script.
  // Answer packs load with their language; lookups below read them when they arrive.
  for (const keywords of Object.values(localeData.GUIDE_KEYWORDS||{}))
    for (const topic of topics) topic.keys.push(...(keywords[topic.id] || []));
  const packGuide = language => localeData.EXTRA_LOCALE_PACKS?.[language]?.guide;
  for (const [language, pack] of Object.entries(localeData.EXTRA_LOCALE_PACKS||{}))
    for (const topic of topics) { topic.translations ||= {}; topic.translations[language] = pack.guide.answers[topic.id]; }
  const matchesKey = (question,key) => {
    const value=normalize(key);
    if (!value) return false;
    // Chinese and Japanese do not require spaces between words.
    return /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u.test(value)
      ? question.includes(value) : (' '+question+' ').includes(' '+value+' ');
  };
  const englishUI=['A small guide to Patrick’s work.','Prepared answers, not an AI model. Questions stay in this tab and disappear on reload.','Answer language','Ask about the portfolio…','Send question','Clear chat','Open project ↗','View section ↗','Work','Projects','About Patrick','LOCAL GUIDE · NO API','Close guide'];
  const slovakUI=['Malý sprievodca Patrickovou prácou.','Pripravené odpovede, nie AI model. Otázky zostávajú v tejto karte a po obnovení zmiznú.','Jazyk odpovedí','Opýtaj sa na portfólio…','Odoslať otázku','Vymazať chat','Otvoriť projekt ↗','Pozrieť sekciu ↗','Práca','Projekty','O Patrickovi','LOKÁLNY SPRIEVODCA · BEZ API','Zavrieť'];
  function ui(language){return (locales[language]||packGuide(language))?.ui||(language==='sk'?slovakUI:englishUI);}
  function answer(text, language) {
    const q = normalize(text);
    const sk = language === 'sk';
    const loc=locales[language]||packGuide(language);
    if (loc?.privacyKeys?.some(key=>matchesKey(q,key))) return {text:loc.privacy};
    if (loc?.greetings?.some(key=>q===normalize(key))) return {text:loc.greeting};
    if (/\b(contrasena|secreto|salario|direccion|password|secret|salary|address|heslo|plat|bydlisko|jelszo|fizetes|haslo|wynagrodzenie|passwort|gehalt)\b/.test(q)) return {text:loc?.privacy||(sk?'Poznám len verejné informácie z portfólia. Súkromné údaje tu nenájdeš.':'I only know the public portfolio. Private details aren’t available here.')};
    if (/\b(hola|buenas|hello|hi|hey|ahoj|cau|szia|udv|czesc|hej|hallo|servus)\b/.test(q) && q.split(' ').length < 4) return {text:loc?.greeting||(sk?'Ahoj! Som lokálny sprievodca portfóliom, nie Patrick ani AI model. Čo ťa zaujíma?':'Hey! I’m a local portfolio guide, not Patrick or an AI model. What would you like to explore?')};
    const scored = topics.map(topic => ({topic,score:topic.keys.reduce((score,key)=>score+(matchesKey(q,key)?key.includes(' ')?3:2:0),0)})).sort((a,b)=>b.score-a.score);
    if (!scored[0].score) return {text:loc?.fallback||(sk?'Toto neviem spoľahlivo priradiť. Skús prácu, projekty, AI agents, Spotify alebo kontakt. Poznám iba pripravené informácie z tohto webu.':'I can’t reliably match that question. Try work, projects, AI agents, Spotify, or contact. I only know the prepared information on this site.')};
    const t=scored[0].topic;
    const result={text:t.translations?.[language]||packGuide(language)?.answers?.[t.id]||t[language]||t.en,project:t.project,section:t.section};
    if(t.id==='contact')result.text+='\nUnbenchmark: https://unbenchmark.com/user/khons-hu?tab=reviews';
    if(t.id==='projects'||t.id==='games'||t.id==='dots')result.recommendations=localRecommendations(q,t.id==='dots'?'games':t.id);
    return result;
  }
  function localRecommendations(question,topic='projects'){
    if(/\b(game|games|gaming|play|juego|jogos|spiel|gry|hry|hra)\b/.test(question))return ['receipts','dots','save-democracy'];
    if(/\b(spotify|music|playlist|musica|musik|muzyka|zene)\b/.test(question))return ['rotation','bot'];
    if(/\b(finance|market|polymarket|invest|trading|stocks|peniaze|rynku|rynok)\b/.test(question))return ['market','steam'];
    if(/\b(code|coding|debug|logic|learn|practice|python|typescript|programming|kod|programovanie|nauc)\b/.test(question))return ['thinkroom','proof','calculator'];
    if(/\b(agent|agents|ai|llm|model|research|agi|rl|reinforcement)\b/.test(question))return ['proof','signal','thinkroom'];
    return topic==='games'?['receipts','dots','save-democracy']:['proof','signal','thinkroom','market'];
  }
  function rankProjectResults(projects,query,limit=5){
    const terms=normalize(String(query||'')).split(' ').filter(Boolean);
    if(!terms.length)return [];
    return projects.map((project,index)=>{
      const title=normalize(project.title||''),id=normalize(project.id||''),summary=normalize(project.summary||''),meta=normalize(project.meta||''),whole=terms.join(' ');
      let score=title===whole?120:title.startsWith(whole)?80:title.includes(whole)?55:0;
      if(id===whole)score+=70;else if(id.startsWith(whole))score+=38;else if(id.includes(whole))score+=18;
      for(const term of terms){
        if(title.includes(term))score+=24;
        else if(id.includes(term))score+=17;
        else if(meta.includes(term))score+=9;
        else if(summary.includes(term))score+=5;
        else return {project,index,score:0};
      }
      return {project,index,score};
    }).filter(item=>item.score>0).sort((a,b)=>b.score-a.score||a.index-b.index).slice(0,Math.max(0,limit)).map(item=>item.project);
  }
  // Replies stay plain text. Light Markdown a model may still send loses its markers instead of showing them.
  function tidy(text){
    return String(text).replace(/\r\n?/g,'\n')
      .replace(/^[ \t]*\|?[ \t]*:?-{3,}:?[ \t]*(?:\|[ \t]*:?-{3,}:?[ \t]*)+\|?[ \t]*$\n?/gm,'')
      .replace(/^[ \t]*\|(.+)\|[ \t]*$/gm,(_,row)=>row.split('|').map(cell=>cell.trim()).filter(Boolean).join(' · '))
      .replace(/^[ \t]*(?:-{3,}|\*{3,}|_{3,})[ \t]*$\n?/gm,'')
      .replace(/^[ \t]*#{1,6}[ \t]+/gm,'').replace(/^[ \t]*>[ \t]?/gm,'')
      .replace(/^([ \t]*)[-*+][ \t]+/gm,'$1• ')
      .replace(/\*\*([^*\n]+?)\*\*/g,'$1').replace(/__([^_\n]+?)__/g,'$1')
      .replace(/(^|[\s(])\*(?=\S)([^*\n]+?)\*(?=[\s).,;:!?]|$)/gm,'$1$2')
      .replace(/`([^`\n]+)`/g,'$1').replace(/\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)/g,'$1 ($2)')
      .replace(/[ \t]+$/gm,'').replace(/\n{3,}/g,'\n\n').trim();
  }
  if (typeof module !== 'undefined' && module.exports) module.exports={answer,topics,ui,tidy,localRecommendations,rankProjectResults};
  if (typeof document === 'undefined') return;
  const dialog=document.querySelector('#guide-dialog'),log=document.querySelector('#guide-log'),input=document.querySelector('#guide-question'),lang=document.querySelector('#guide-language');
  const body=dialog.querySelector('.guide-body'),submit=document.querySelector('#guide-form button'),status=document.querySelector('#guide-status'),chips=[...document.querySelectorAll('[data-question]')];
  const projectSearch=document.querySelector('#guide-project-search'),projectResults=document.querySelector('#guide-project-results'),pathButton=document.querySelector('#guide-path-open');
  const root=document.documentElement,finePointer=()=>!matchMedia('(pointer: coarse)').matches;
  let aiAvailable=false,busy=false,conversation=[],requestId=0,controller=null,pendingRow=null,unseen=null,lastSent=0,pathCount=0;
  const aiCopy=(language=lang.value)=>CHAT_COPY[language]||CHAT_COPY.en;
  // api/chat.js accepts one request per visitor every five seconds. A quick follow-up waits out the rest of
  // that window instead of being refused. Nothing else delays or paces a reply.
  const SPACING=5300,RETRY_LIMIT=10,ATTEMPT_TIMEOUT=15000;
  // iOS keyboards shrink the visual viewport, not the layout viewport. panels.js sizes the frame; this hides
  // the intro and suggestions while typing so the conversation keeps the room.
  function fitGuideViewport(){
    const viewport=window.visualViewport;
    if(!dialog.open)return;
    dialog.classList.toggle('guide-typing',document.activeElement===input&&(!viewport||viewport.height<window.innerHeight*.8));
    dialog.classList.toggle('guide-searching',document.activeElement===projectSearch&&viewport&&viewport.height<window.innerHeight*.8);
    if(!viewport)return;
    if(dialog.open&&dialog.contains(document.activeElement))requestAnimationFrame(()=>document.activeElement.scrollIntoView({block:'nearest'}));
  }
  let guideViewportFrame=0;
  window.visualViewport?.addEventListener('resize',()=>{
    if(!dialog.open||guideViewportFrame)return;
    guideViewportFrame=requestAnimationFrame(()=>{guideViewportFrame=0;fitGuideViewport();});
  },{passive:true});
  fitGuideViewport();
  function translateUI(){
    const base=ui(lang.value).slice(),c=aiCopy(),feature=CHAT_COPY.assistant?.[lang.value]||CHAT_COPY.assistant.en;
    base[0]=c[0];
    if(aiAvailable){base[1]=c[1];base[11]=c[2];}
    else{const offline=CHAT_COPY.offline?.[lang.value]||CHAT_COPY.offline.en;base[1]=offline[0];base[11]=offline[1];}
    const t=base.map(text=>localeData.directionalText(text,lang.value));dialog.lang=lang.value;dialog.dir=localeData.languageDirection(lang.value);
    const pageText=text=>globalThis.PortfolioI18n?.t(text,lang.value)||text;
    const tabNames={'terminal-dialog':'Terminal','guide-dialog':'Ask khonsu','email-dialog':'Email'};
    dialog.querySelector('.panel-nav').setAttribute('aria-label',pageText('Portfolio tools'));
    dialog.querySelectorAll('[data-panel]').forEach(button=>button.textContent=pageText(tabNames[button.dataset.panel]));
    document.querySelector('#guide-title').textContent=globalThis.PortfolioI18n?.t('☾ ask khonsu',lang.value)||'☾ ask khonsu';
    log.setAttribute('aria-label',globalThis.PortfolioI18n?.t('Conversation',lang.value)||'Conversation');
    document.querySelectorAll('.guide-intro p').forEach((p,i)=>p.textContent=t[i]);
    document.querySelector('label[for="guide-language"]').textContent=t[2];input.placeholder=t[3];document.querySelector('label[for="guide-question"]').textContent=t[3];
    document.querySelector('#guide-form button').setAttribute('aria-label',t[4]);document.querySelector('#guide-clear').textContent=t[5];
    document.querySelectorAll('[data-question]').forEach((b,i)=>{if(i<3)b.textContent=t[8+i];b.dir=i===3?'ltr':'auto';});
    document.querySelector('#guide-dialog .terminal-bottom span').textContent=t[11];document.querySelector('[data-close="guide-dialog"]').setAttribute('aria-label',t[12]);
    document.querySelector('#guide-project-search-label').textContent=feature.searchLabel;projectSearch.placeholder=feature.searchPlaceholder;projectSearch.setAttribute('aria-label',feature.searchLabel);projectResults.setAttribute('aria-label',feature.searchLabel);pathButton.textContent=feature.pathLaunch;
    if(projectSearch.value.trim())updateProjectResults();
    try{localStorage.setItem('khonsu-guide-language',lang.value);}catch{}
  }
  // Start in the page's chosen language, including when scripts load after a change.
  // A previous guide-only choice must not override a fresh page preference.
  const preferred=globalThis.PortfolioI18n?.language||document.documentElement.lang||'en';
  if([...lang.options].some(option=>option.value===preferred))lang.value=preferred;
  // An added answer language loads its pack first; until then the guide keeps its current copy.
  lang.addEventListener('change',()=>{const next=lang.value;const load=globalThis.PortfolioI18n?.load||(()=>Promise.resolve());load(next).then(()=>{if(lang.value===next)translateUI();},()=>{});});
  translateUI();
  window.addEventListener('portfolio:language',()=>{lang.value=PortfolioI18n.language;lang.dispatchEvent(new Event('change'));});
  function append(text, who, result, language=lang.value, note='') {
    const row=document.createElement('div');row.className='guide-message '+who;if(who==='guide'){row.lang=language;row.dir=localeData.languageDirection(language);}else row.dir='auto';
    const paragraph=(content,className)=>{const p=document.createElement('p');if(className)p.className=className;p.textContent=who==='guide'?localeData.directionalText(content,language):content;row.append(p);};
    if(note)paragraph(note,'guide-note');
    // Paragraph breaks become separate paragraphs; single line breaks stay as written (pre-line).
    for(const part of who==='guide'?String(text).split(/\n{2,}/):[text])paragraph(part);
    if(who==='guide'&&Array.isArray(result?.recommendations))renderRecommendations(row,result.recommendations,language);
    if(who==='guide'&&result?.flow)renderGuidePath(row,language);
    if(result&&(result.project||result.section)){
      // Project notes and sections stay on this page, so they use → rather than the outside-link ↗.
      const button=document.createElement('button');button.type='button';button.className='guide-action';button.textContent=ui(language)[result.project?6:7].replace('↗',localeData.languageDirection(language)==='rtl'?'←':'→');
      button.addEventListener('click',()=>{dialog.close();if(result.project)showProject(result.project);else document.getElementById(result.section).scrollIntoView({behavior:root.classList.contains('motion-off')?'instant':'smooth'});});row.append(button);
    }
    log.append(row);while(log.children.length>30)log.firstElementChild.remove();
    return row;
  }
  function renderGuidePath(row,language){
    const feature=CHAT_COPY.assistant?.[language]||CHAT_COPY.assistant.en;
    const paths=[
      {id:'agent',related:['proof','thinkroom'],angles:[
        {id:'tools',prompt:'Explain an agent tool loop in simple terms. Relate it to Patrick’s public projects using only portfolio facts. Distinguish real features from analogies; do not imply every project is an agent.'},
        {id:'evaluation',prompt:'Explain how to evaluate an agent decision against expected results. Relate it to public portfolio facts only; state the limits of any small sample.'}
      ]},
      {id:'rag',related:['signal','proof'],angles:[
        {id:'retrieval',prompt:'Explain how RAG retrieves and reranks source chunks. Relate it to public portfolio facts. Feedcairn collects official feeds but is not a RAG answer system. Do not overclaim.'},
        {id:'grounding',prompt:'Explain how RAG grounds an answer in retrieved sources and why citations matter. Relate it only to public portfolio facts; distinguish a real feature from an analogy.'}
      ]},
      {id:'rl',section:'now',angles:[
        {id:'reward',prompt:'Explain how reward feedback updates a reinforcement-learning policy. Relate it to Patrick’s public facts, and do not imply other projects use RL.'},
        {id:'ppo',prompt:'Explain PPO in plain terms and relate it to Patrick’s TUKE thesis with PPO agents and LLM-generated maps, keeping their roles distinct.'}
      ]}
    ];
    const direction=localeData.languageDirection(language);
    // The message above already carries the title; the panel is labelled by it instead of repeating it.
    const panel=document.createElement('section');panel.className='guide-path';panel.setAttribute('aria-label',feature.pathTitle);panel.lang=language;panel.dir=direction;
    const question=document.createElement('p');question.className='guide-path-question';question.id=`guide-path-question-${++pathCount}`;
    const choices=document.createElement('div');choices.className='guide-path-choices';choices.setAttribute('role','group');choices.setAttribute('aria-labelledby',question.id);
    // Steps swap in place. Keyboard focus follows to the new step instead of falling back to the page.
    const swap=(buttons,focusIndex)=>{
      const hadFocus=panel.contains(document.activeElement);
      choices.replaceChildren(...buttons);
      if(hadFocus)buttons[focusIndex]?.focus({preventScroll:true});
    };
    const choice=(label,onClick,asks)=>{
      const button=document.createElement('button');button.type='button';button.className='guide-path-choice';button.textContent=label;
      if(asks){button.dataset.asks='';button.setAttribute('aria-disabled',String(busy));}
      button.addEventListener('click',onClick);return button;
    };
    const showTopics=(focusIndex=0)=>{
      question.textContent=feature.pathQuestion;question.classList.remove('is-subject');
      swap(paths.map((path,index)=>choice(feature.pathSubjects[index],()=>showAngles(path,index))),focusIndex);
    };
    const showAngles=(path,index)=>{
      // The chosen subject names the second step, so it reads as a narrower question rather than a repeat.
      question.textContent=feature.pathSubjects[index];question.classList.add('is-subject');
      const buttons=path.angles.map((angle,angleIndex)=>choice(feature.pathAngles[index][angleIndex],()=>{
        const prompt=`${angle.prompt} Recommend at most two directly relevant portfolio projects when available.`;
        const displayText=`${feature.pathSubjects[index]} · ${feature.pathAngles[index][angleIndex]}`;
        const fallback={fallbackText:feature.pathFallback[index],recommendations:index===0?['proof','thinkroom']:index===1?['signal','proof']:undefined,section:path.section};
        ask(prompt,{...fallback,displayText});
      },true));
      const back=document.createElement('button');back.type='button';back.className='guide-path-back';back.textContent=`${direction==='rtl'?'→':'←'} ${feature.pathBack}`;back.addEventListener('click',()=>showTopics(index));
      swap([...buttons,back],0);
    };
    panel.append(question,choices);row.append(panel);showTopics();
  }
  function renderRecommendations(row,ids,language){
    const copy=CHAT_COPY.recommendations?.[language]||CHAT_COPY.recommendations.en;
    const sources=[...document.querySelectorAll('.project-card')];
    const projects=[...new Set(ids)].slice(0,4).map(id=>{
      const source=sources.find(card=>card.querySelector('.project-details')?.dataset.project===id);
      const title=source?.querySelector('.project-info h3')?.textContent?.trim();
      const summary=source?.querySelector('.project-info p')?.textContent?.trim();
      const metaParts=[...(source?.querySelectorAll('.project-meta span')||[])].map(part=>part.textContent.trim()).filter(Boolean),meta=metaParts.join(' · ');
      const outside=source?.querySelector('.project-live');
      const href=outside?.href;
      if(!source||!title||!summary||!meta)return null;
      if(outside){try{if(!href||new URL(href,location.href).protocol!=='https:')return null;}catch{return null;}}
      return {id,title,summary,meta,metaParts,href,label:outside?.textContent.trim()||'',kind:outside?.dataset.kind||'external'};
    }).filter(Boolean);
    if(!projects.length)return;
    const carousel=document.createElement('section');carousel.className='guide-recommendations';carousel.setAttribute('role','region');carousel.setAttribute('aria-roledescription','carousel');carousel.setAttribute('aria-label',copy.heading);carousel.lang=language;carousel.dir=localeData.languageDirection(language);
    const heading=document.createElement('div');heading.className='guide-recommendation-head';
    const title=document.createElement('h4');title.className='guide-recommendation-title';title.textContent=copy.heading;
    const controls=document.createElement('div');controls.className='guide-recommendation-controls';
    const position=document.createElement('span');position.className='guide-recommendation-position';position.setAttribute('aria-live','polite');position.setAttribute('aria-atomic','true');
    const previous=document.createElement('button');previous.type='button';previous.className='guide-recommendation-previous';previous.textContent='‹';previous.setAttribute('aria-label',copy.previous);
    const next=document.createElement('button');next.type='button';next.className='guide-recommendation-next';next.textContent='›';next.setAttribute('aria-label',copy.next);
    const compare=document.createElement('button');compare.type='button';compare.className='guide-recommendation-compare';compare.textContent=copy.compareLabel.replace('{count}','0');compare.setAttribute('aria-label',copy.compareAria.replace('{count}','0'));compare.disabled=true;compare.setAttribute('aria-expanded','false');
    controls.append(previous,position,next,compare);heading.append(title,controls);
    const why=document.createElement('details');why.className='guide-recommendation-why';
    const whyTitle=document.createElement('summary');whyTitle.textContent=copy.whyTitle;
    const whyText=document.createElement('p');whyText.textContent=copy.whyText;
    why.append(whyTitle,whyText);
    const track=document.createElement('div');track.className='guide-recommendation-track';track.tabIndex=0;track.setAttribute('role','group');track.setAttribute('aria-label',copy.heading);
    const comparison=document.createElement('section');comparison.className='guide-comparison';comparison.hidden=true;comparison.setAttribute('role','region');comparison.setAttribute('aria-label',copy.compareTitle);
    const selected=new Set();let compareOpen=false;
    const slides=projects.map((project,index)=>{
      const slide=document.createElement('article');slide.className='guide-recommendation-card';slide.setAttribute('role','group');slide.setAttribute('aria-roledescription','slide');
      slide.setAttribute('aria-label',copy.position.replace('{current}',String(index+1)).replace('{total}',String(projects.length)));slide.dir=localeData.languageDirection(language);
      const meta=document.createElement('p');meta.className='guide-recommendation-meta';meta.textContent=project.meta;
      const name=document.createElement('h5');name.textContent=project.title;
      const description=document.createElement('p');description.className='guide-recommendation-description';description.textContent=project.summary;
      const actions=document.createElement('div');actions.className='guide-recommendation-actions';
      const toggle=document.createElement('button');toggle.type='button';toggle.className='guide-recommendation-compare-toggle';toggle.textContent=copy.addToCompare;toggle.setAttribute('aria-pressed','false');
      const notes=document.createElement('button');notes.type='button';notes.className='guide-recommendation-notes';notes.textContent=copy.notes;
      notes.addEventListener('click',()=>{dialog.close();window.PortfolioProjects?.open(project.id);});
      toggle.addEventListener('click',()=>{
        if(selected.has(project.id))selected.delete(project.id);
        else if(selected.size<3)selected.add(project.id);
        updateComparison();
      });
      actions.append(toggle,notes);
      if(project.href){const link=document.createElement('a');link.href=project.href;link.target='_blank';link.rel='noopener noreferrer';link.textContent=localeData.directionalText(project.label,language);actions.append(link);}
      slide.append(meta,name,description,actions);return {slide,project,toggle};
    });
    track.append(...slides.map(item=>item.slide));carousel.append(heading,why,track,comparison);row.append(carousel);
    const updateComparison=()=>{
      compare.textContent=copy.compareLabel.replace('{count}',String(selected.size));
      compare.setAttribute('aria-label',copy.compareAria.replace('{count}',String(selected.size)));
      compare.disabled=selected.size<2;
      slides.forEach(({project,toggle})=>{
        const active=selected.has(project.id);toggle.textContent=active?copy.removeFromCompare:copy.addToCompare;toggle.setAttribute('aria-pressed',String(active));toggle.disabled=!active&&selected.size>=3;
      });
      if(compareOpen)renderComparison();
    };
    const renderComparison=()=>{
      const feature=CHAT_COPY.assistant?.[language]||CHAT_COPY.assistant.en,chosen=slides.filter(item=>selected.has(item.project.id)).map(item=>item.project);
      const heading=document.createElement('h5');heading.textContent=copy.compareTitle;
      const hint=document.createElement('p');hint.className='guide-comparison-hint';hint.textContent=feature.compareHint;
      const scroll=document.createElement('div');scroll.className='guide-comparison-scroll';scroll.tabIndex=0;scroll.setAttribute('role','region');scroll.setAttribute('aria-label',copy.compareTitle);
      const table=document.createElement('table');table.className='guide-comparison-table';table.dir=localeData.languageDirection(language);
      const head=document.createElement('thead'),headRow=document.createElement('tr'),projectHead=document.createElement('th');projectHead.scope='col';projectHead.textContent=feature.compareProject;headRow.append(projectHead);
      chosen.forEach(project=>{const th=document.createElement('th');th.scope='col';th.textContent=project.title;headRow.append(th);});head.append(headRow);
      // Each fact is built fresh for the wide table and for the narrow stacked view, so both show the same card data.
      const stage=project=>{
        const [status,...tech]=project.metaParts?.length?project.metaParts:[project.meta],fragment=document.createDocumentFragment();
        const first=document.createElement('span');first.className='guide-comparison-stage';first.textContent=status;fragment.append(first);
        if(tech.length){const rest=document.createElement('span');rest.className='guide-comparison-tech';rest.textContent=tech.join(' · ');fragment.append(rest);}
        return fragment;
      };
      const actionsFor=project=>{
        const actions=document.createElement('div');actions.className='guide-comparison-actions';
        const notes=document.createElement('button');notes.type='button';notes.className='guide-comparison-notes';notes.textContent=copy.notes;notes.addEventListener('click',()=>{dialog.close();window.PortfolioProjects?.open(project.id);});
        if(project.href){const link=document.createElement('a');link.href=project.href;link.target='_blank';link.rel='noopener noreferrer';link.textContent=localeData.directionalText(project.label,language);link.setAttribute('aria-label',`${project.title}: ${project.label}`);actions.append(link);}
        actions.append(notes);return actions;
      };
      const rows=[
        [feature.compareRows[0],stage],
        [feature.compareRows[1],project=>document.createTextNode(project.summary)],
        [feature.compareRows[2],actionsFor]
      ];
      const body=document.createElement('tbody');
      rows.forEach(([label,value])=>{
        const tr=document.createElement('tr'),rowHead=document.createElement('th');rowHead.scope='row';rowHead.textContent=label;tr.append(rowHead);
        // Card text keeps its own direction (an English summary inside an Arabic panel ends with its period, not before it).
        chosen.forEach(project=>{const td=document.createElement('td');if(value!==actionsFor)td.dir='auto';td.append(value(project));tr.append(td);});body.append(tr);
      });
      table.append(head,body);scroll.append(table);
      // Narrow panels: one block per fact, with every chosen project listed under it (CSS picks the view by container width).
      const stack=document.createElement('div');stack.className='guide-comparison-stack';stack.dir=localeData.languageDirection(language);
      rows.forEach(([label,value])=>{
        const group=document.createElement('section');group.className='guide-comparison-group';
        const name=document.createElement('h6');name.textContent=label;
        const list=document.createElement('dl');
        chosen.forEach(project=>{
          const pair=document.createElement('div'),term=document.createElement('dt'),detail=document.createElement('dd');
          term.textContent=project.title;if(value!==actionsFor)detail.dir='auto';detail.append(value(project));pair.append(term,detail);list.append(pair);
        });
        group.append(name,list);stack.append(group);
      });
      const explain=document.createElement('button');explain.type='button';explain.className='guide-comparison-explain';explain.dataset.asks='';explain.setAttribute('aria-disabled',String(busy));explain.textContent=feature.compareExplain;
      explain.addEventListener('click',()=>{
        const titles=chosen.map(project=>project.title),names=titles.join(', ');
        const prompt=`Compare only these public portfolio projects: ${names}. Explain what each does, their meaningful difference, and what a visitor can try. Use site facts only; do not infer features.`;
        ask(prompt,{displayText:`${feature.compareExplain}: ${titles.join(' · ')}`,fallbackText:feature.compareFallback,recommendations:chosen.map(project=>project.id)});
      });
      comparison.replaceChildren(heading,hint,scroll,stack,explain);comparison.hidden=!compareOpen;
    };
    // Opening the comparison brings it into view; it otherwise appears below the fold, under the cards.
    compare.addEventListener('click',()=>{compareOpen=!compareOpen;compare.setAttribute('aria-expanded',String(compareOpen));renderComparison();if(compareOpen)requestAnimationFrame(()=>reveal(comparison));});
    updateComparison();
    let activeIndex=0,frame=0;
    const setActive=index=>{
      activeIndex=Math.max(0,Math.min(slides.length-1,index));
      position.textContent=copy.position.replace('{current}',String(activeIndex+1)).replace('{total}',String(slides.length));
      previous.disabled=activeIndex===0;next.disabled=activeIndex===slides.length-1;
    };
    const move=delta=>{
      const index=Math.max(0,Math.min(slides.length-1,activeIndex+delta));
      if(index===activeIndex)return;
      const trackBox=track.getBoundingClientRect(),slideBox=slides[index].slide.getBoundingClientRect();
      track.scrollTo({left:track.scrollLeft+slideBox.left-trackBox.left,behavior:root.classList.contains('js-motion')&&!document.hidden?'smooth':'instant'});
      setActive(index);
    };
    previous.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));
    track.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();move(-1);}else if(event.key==='ArrowRight'){event.preventDefault();move(1);}});
    track.addEventListener('scroll',()=>{
      if(frame)return;frame=requestAnimationFrame(()=>{frame=0;const left=track.getBoundingClientRect().left;let best=0,distance=Infinity;slides.forEach(({slide},index)=>{const current=Math.abs(slide.getBoundingClientRect().left-left);if(current<distance){best=index;distance=current;}});setActive(best);});
    },{passive:true});
    if(projects.length<2){previous.hidden=true;next.hidden=true;position.hidden=true;}
    setActive(0);
  }
  // A reply taller than the conversation opens at its first line; a shorter one scrolls just far enough to show its end.
  function reveal(row){
    if(!row?.isConnected)return;
    if(!dialog.open){unseen=row;return;}
    const view=body.getBoundingClientRect(),box=row.getBoundingClientRect(),gap=16;
    const top=box.height>view.height-gap*2?body.scrollTop+box.top-view.top-gap:Math.max(body.scrollTop,body.scrollTop+box.bottom-view.bottom+gap);
    if(Math.abs(top-body.scrollTop)<2)return;
    body.scrollTo({top:Math.max(0,top),behavior:root.classList.contains('js-motion')&&!document.hidden?'smooth':'instant'});
  }
  new MutationObserver(()=>{if(dialog.open&&unseen){const row=unseen;unseen=null;requestAnimationFrame(()=>reveal(row));}}).observe(dialog,{attributes:true,attributeFilter:['open']});
  // While a reply is on its way the field stays editable; sending and suggestions wait (aria-disabled keeps focus in place).
  function setBusy(value,language=lang.value){
    busy=value;submit.setAttribute('aria-disabled',String(value));pathButton.setAttribute('aria-disabled',String(value));chips.forEach(chip=>chip.setAttribute('aria-disabled',String(value)));
    // Buttons inside earlier replies that would send a question rest too.
    log.querySelectorAll('[data-asks]').forEach(button=>button.setAttribute('aria-disabled',String(value)));
    projectResults.querySelectorAll('.guide-project-option').forEach(option=>option.setAttribute('aria-disabled',String(value)));
    log.setAttribute('aria-busy',String(value));status.textContent=value?aiCopy(language)[3]:'';
  }
  function showPending(language){
    // A still crescent with the waiting label, faded in only if the reply takes a moment. Screen readers hear #guide-status instead.
    const row=document.createElement('div');row.className='guide-message guide pending';row.lang=language;row.dir=localeData.languageDirection(language);row.setAttribute('aria-hidden','true');
    const p=document.createElement('p');p.textContent=localeData.directionalText(aiCopy(language)[3],language);row.append(p);
    log.append(row);pendingRow=row;reveal(row);
  }
  const settle=()=>{pendingRow?.remove();pendingRow=null;};
  const pause=(ms,signal)=>new Promise((resolve,reject)=>{
    if(signal.aborted)return reject(new DOMException('Aborted','AbortError'));
    if(ms<=0)return resolve();
    const timer=setTimeout(resolve,ms);signal.addEventListener('abort',()=>{clearTimeout(timer);reject(new DOMException('Aborted','AbortError'));},{once:true});
  });
  async function request(payload,signal,retried=false){
    await pause(lastSent+SPACING-Date.now(),signal);
    lastSent=Date.now();
    const attempt=new AbortController(),stop=()=>attempt.abort();
    signal.addEventListener('abort',stop,{once:true});const timer=setTimeout(stop,ATTEMPT_TIMEOUT);
    try{
      const response=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:attempt.signal});
      // The server's own spacing answers 429 with Retry-After; wait that long once. Provider limits carry no header and fall back.
      const wait=response.status===429&&!retried?Number(response.headers.get('Retry-After')):0;
      if(wait>0&&wait<=RETRY_LIMIT){clearTimeout(timer);await pause(wait*1000,signal);return await request(payload,signal,true);}
      if(!response.ok)throw Object.assign(new Error('unavailable'),{status:response.status});
      const data=await response.json();
      if(typeof data?.text!=='string'||!data.text.trim())throw new Error('empty');
      const recommendations=Array.isArray(data.recommendations)?data.recommendations.filter(id=>typeof id==='string').slice(0,4):[];
      return {text:data.text,recommendations};
    }finally{clearTimeout(timer);signal.removeEventListener('abort',stop);}
  }
  async function ask(text,options={}){
    if(busy||!text.trim())return;
    const message=text.trim().slice(0,300),language=lang.value,id=++requestId;
    append(options.displayText||message,'visitor');input.value='';
    const prepared=()=>{
      const result=options.fallbackText?{text:options.fallbackText}:{...answer(message,language)};
      if(Array.isArray(options.recommendations))result.recommendations=options.recommendations;
      if(options.section)result.section=options.section;
      return result;
    };
    if(!aiAvailable){const result=prepared();reveal(append(result.text,'guide',result,language));return;}
    setBusy(true,language);showPending(language);
    const current=controller=new AbortController();
    try{
      const reply=await request({message,language,history:conversation.slice(-4)},current.signal);
      if(id!==requestId)return;
      const shown=tidy(reply.text)||reply.text.trim();
      const result={};if(reply.recommendations.length)result.recommendations=reply.recommendations;else if(Array.isArray(options.recommendations))result.recommendations=options.recommendations;if(options.section)result.section=options.section;
      settle();reveal(append(shown,'guide',Object.keys(result).length?result:null,language));
      conversation.push({role:'user',content:message},{role:'assistant',content:shown.slice(0,2000)});conversation=conversation.slice(-4);
    }catch(error){
      if(id!==requestId)return;
      // A rejected request cannot be retried with the same history; other failures keep the context for the next question.
      if(error?.status===400)conversation=[];
      const result=prepared();settle();reveal(append(result.text,'guide',result,language,aiCopy(language)[4]));
    }finally{if(id===requestId){controller=null;setBusy(false);}}
  }
  // Probe once. Without configuration the existing local guide remains fully usable.
  fetch('/api/chat',{signal:AbortSignal.timeout(5000)}).then(r=>r.ok?r.json():null).then(data=>{if(data?.available===true){aiAvailable=true;translateUI();}}).catch(()=>{});
  document.querySelector('#guide-launcher').addEventListener('click',()=>window.PortfolioPanels.open('guide-dialog',finePointer()?'#guide-question':null));
  document.querySelector('#guide-form').addEventListener('submit',e=>{e.preventDefault();ask(input.value);});
  // Pressing send keeps focus (and a phone keyboard) in the field.
  submit.addEventListener('mousedown',e=>{if(document.activeElement===input)e.preventDefault();});
  chips.forEach(button=>button.addEventListener('click',()=>ask(button.dataset.question)));
  pathButton.addEventListener('click',()=>{
    if(busy)return;
    const feature=CHAT_COPY.assistant?.[lang.value]||CHAT_COPY.assistant.en,fromKeyboard=document.activeElement===pathButton&&pathButton.matches(':focus-visible');
    const row=append(feature.pathTitle,'guide',{flow:true},lang.value);reveal(row);
    // A keyboard user continues in the new tour; pointer and touch users keep their place.
    if(fromKeyboard)row.querySelector('.guide-path-choice')?.focus({preventScroll:true});
  });
  let rankedProjects=[],activeProject=-1;
  // A scrolling list would otherwise become a Tab stop of its own in Chromium; the field keeps focus instead.
  projectResults.tabIndex=-1;
  const closeProjectResults=()=>{projectResults.hidden=true;projectSearch.setAttribute('aria-expanded','false');projectSearch.removeAttribute('aria-activedescendant');rankedProjects=[];activeProject=-1;};
  const updateProjectResults=()=>{
    const feature=CHAT_COPY.assistant?.[lang.value]||CHAT_COPY.assistant.en,query=projectSearch.value.trim();projectResults.replaceChildren();
    if(!query){closeProjectResults();return;}
    const records=[...document.querySelectorAll('.project-card')].map(card=>({card,id:card.querySelector('.project-details')?.dataset.project||'',title:card.querySelector('.project-info h3')?.textContent?.trim()||'',summary:card.querySelector('.project-info>p')?.textContent?.trim()||'',meta:[...card.querySelectorAll('.project-meta span')].map(item=>item.textContent.trim()).filter(Boolean).join(' · ')})).filter(item=>item.id&&item.title);
    rankedProjects=rankProjectResults(records,query,5);activeProject=-1;
    if(!rankedProjects.length){const empty=document.createElement('div');empty.className='guide-project-empty';empty.setAttribute('role','option');empty.setAttribute('aria-disabled','true');empty.textContent=feature.searchEmpty;projectResults.append(empty);}
    else rankedProjects.forEach((project,index)=>{
      // Options are reached with the arrow keys, not Tab, and a press keeps focus in the field (combobox pattern).
      const option=document.createElement('button');option.type='button';option.tabIndex=-1;option.className='guide-project-option';option.id=`guide-project-option-${index}`;option.setAttribute('role','option');option.setAttribute('aria-selected','false');
      const name=document.createElement('span');name.textContent=project.title;const detail=document.createElement('small');detail.textContent=project.meta;option.append(name,detail);
      option.addEventListener('mousedown',event=>event.preventDefault());
      // While a reply is pending the choice rests (like the chips), so the typed query is not cleared for nothing.
      option.setAttribute('aria-disabled',String(busy));
      option.addEventListener('click',()=>{
        if(busy)return;
        closeProjectResults();projectSearch.value='';fitGuideViewport();input.focus();
        ask(`Explain the public portfolio project ${project.title}. Say what it does and what a visitor can try. Use only portfolio facts.`,{displayText:project.title,fallbackText:project.summary,recommendations:[project.id]});
      });projectResults.append(option);
    });
    projectResults.hidden=false;projectSearch.setAttribute('aria-expanded','true');
  };
  const setActiveProject=index=>{
    if(!rankedProjects.length)return;
    activeProject=(index+rankedProjects.length)%rankedProjects.length;
    [...projectResults.querySelectorAll('[role="option"]')].forEach((option,i)=>option.setAttribute('aria-selected',String(i===activeProject)));
    projectSearch.setAttribute('aria-activedescendant',`guide-project-option-${activeProject}`);
    projectResults.querySelector(`#guide-project-option-${activeProject}`)?.scrollIntoView({block:'nearest'});
  };
  projectSearch.addEventListener('input',updateProjectResults);
  projectSearch.addEventListener('focus',()=>{if(projectSearch.value.trim())updateProjectResults();});
  projectSearch.addEventListener('keydown',event=>{
    // After Escape the typed text stays; ArrowDown reopens the list without another keystroke.
    if(event.key==='ArrowDown'&&projectResults.hidden&&projectSearch.value.trim()){event.preventDefault();updateProjectResults();setActiveProject(0);}
    else if(event.key==='ArrowDown'&&rankedProjects.length){event.preventDefault();setActiveProject(activeProject+1);}
    else if(event.key==='ArrowUp'&&rankedProjects.length){event.preventDefault();setActiveProject(activeProject<=0?rankedProjects.length-1:activeProject-1);}
    else if(event.key==='Enter'&&rankedProjects.length){event.preventDefault();projectResults.querySelector(`#guide-project-option-${activeProject<0?0:activeProject}`)?.click();}
    else if(event.key==='Escape'&&!projectResults.hidden){event.preventDefault();closeProjectResults();}
  });
  document.addEventListener('pointerdown',event=>{if(!event.target.closest('.guide-project-search'))closeProjectResults();});
  // Tabbing away closes the list, so it never floats over the chips or the question field.
  projectSearch.closest('.guide-project-search').addEventListener('focusout',event=>{if(!event.currentTarget.contains(event.relatedTarget))closeProjectResults();});
  document.querySelector('#guide-clear').addEventListener('click',()=>{
    requestId++;controller?.abort();controller=null;conversation=[];pendingRow=null;unseen=null;setBusy(false);
    log.replaceChildren();input.value='';projectSearch.value='';closeProjectResults();dialog.classList.remove('guide-typing','guide-searching');body.scrollTo({top:0,behavior:'instant'});if(finePointer())input.focus();
  });
  // The floating launcher steps aside while a link, button or field sits underneath it, then returns.
  // No scroll handler: an IntersectionObserver whose root box is the launcher's own footprint reports overlaps.
  const launcher=document.querySelector('#guide-launcher');
  if('IntersectionObserver' in window&&launcher){
    const targets=[...document.querySelectorAll('main :is(a,button,input,select,textarea,summary),footer :is(a,button)')].filter(el=>!el.closest('.sr-only,.contact-trap'));
    const covered=new Set();let observer,frame;
    const update=()=>launcher.classList.toggle('launcher-yield',covered.size>0);
    const watch=()=>{
      observer?.disconnect();covered.clear();launcher.classList.remove('launcher-yield');
      const box=launcher.getBoundingClientRect();if(!box.width)return;
      const pad=6,width=document.documentElement.clientWidth,height=window.innerHeight;
      const margin=[-(box.top-pad),-(width-box.right-pad),-(height-box.bottom-pad),-(box.left-pad)].map(value=>Math.min(0,Math.round(value))+'px').join(' ');
      // Only small controls count. A whole card or a full-width row stays tappable around the launcher.
      const small=box=>box.width<=280&&box.height<=72;
      observer=new IntersectionObserver(entries=>{for(const entry of entries)entry.isIntersecting&&small(entry.boundingClientRect)?covered.add(entry.target):covered.delete(entry.target);update();},{rootMargin:margin});
      targets.forEach(target=>observer.observe(target));
    };
    // Re-measure only when the launcher can move: viewport size, language (label width, RTL side).
    const later=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(watch);};
    window.addEventListener('resize',later);window.addEventListener('portfolio:language',later);
    watch();
  }
})();

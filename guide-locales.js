// Curated translations. Kept local with the portfolio, never fetched from a service.
const GUIDE_LOCALES = {
 hu: {
 ui:['Rövid útmutató Patrick munkáihoz.','Előre megírt válaszok, nem AI-modell. A kérdések ebben a lapban maradnak, és újratöltéskor eltűnnek.','Válasz nyelve','Kérdezz a portfólióról…','Kérdés küldése','Beszélgetés törlése','Projekt megnyitása ↗','Szakasz megtekintése ↗','Munka','Projektek','Rólam','HELYI ÚTMUTATÓ · NINCS API','Bezárás'],
 fallback:'Ezt a kérdést nem tudom biztosan felismerni. Kérdezz a munkáról, projektekről, C++-ról, Spotifyról vagy Codexről.', privacy:'Csak a portfólió nyilvános adatait ismerem. Magánadatokat nem tudok megadni.', greeting:'Szia! Helyi portfólió-útmutató vagyok, nem Patrick és nem AI-modell. Mi érdekel?',
 answers:[
 'Patrick L2 technikai támogatással foglalkozik a Luigi’s Boxnál. Böngészőhibákat, API-kat, termékadatokat és analitikát vizsgál, integrációkat ellenőriz és javításokat tesztel. A Luigi’s Box keresést és termékajánlást fejleszt webáruházaknak.',
 'A Spotify rotation egy helyi Python-szkript: kedvenc és nemrég hallgatott számokból készít privát lejátszási listát. Ütemezetten fut, rendszeres AI-hívások nélkül. A forráskód nem nyilvános.',
 'A Dots egy korábbi webes játék React frontenddel és Spring Boot backenddel. Régebbi munka, nem frissen karbantartott termék.',
 'A CSLYS egy régebbi, JavaScriptben írt Discord-bot zenelejátszással. A jelenlegi API-kkal való kompatibilitása nem ellenőrzött.',
 'Patrick a C++ és a Counter-Strike révén kezdett programozni. Egy egyetemi csapatprojektben a folyamatok közötti kommunikációval is foglalkozott.',
 'Jelenleg kedveli az OpenAI és Tibo munkáját: a Codex irányát, a fejlesztés tempóját és Tibo kommunikációját. Ő maga is használja a Codexet. Ez személyes vélemény, nem munkakapcsolat.',
 'Patrick a TUKE-n szerzett informatikai mesterdiplomát. Diplomamunkájában PPO-alapú megerősítéses tanuló ágenseket és LLM-alapú pályagenerálást kapcsolt össze egy többjátékos játékhoz.',
 'Spotify rotation: személyes automatizálás. Dots: React és Java. CSLYS: Discord-bot. Folyamatok közötti kommunikáció: C++. A nyilvános projektek többsége régebbi.',
 'GitHub: khons-hu. X: @ptr1337_. Discord: khons.hu. Megmutathatom az elérhetőségeket, de nem küldhetek üzenetet Patrick nevében.',
 'Patrick Obrtal, online khonsu. C++ és Counter-Strike volt a kezdet, majd informatika a TUKE-n. Ma L2 technikai támogatásban dolgozik a Luigi’s Boxnál, kódoló ágensekkel kísérletezik és CS2-zik.',
 'Az AGI-t, a rekurzív önfejlesztést és az új modelleket követi. Kódoló ágenseket próbál ki a saját munkájában, a diplomamunkájában pedig PPO-val foglalkozott.',
 'A Counter-Strike a programozói kezdeteihez és a szabadidejéhez is hozzátartozik. Rangért és statisztikákért kérdezd Patrickot. Ez az útmutató még nem játszott vele.'
 ]},
 pl: {
 ui:['Krótki przewodnik po pracy Patricka.','Gotowe odpowiedzi, nie model AI. Pytania zostają w tej karcie i znikają po odświeżeniu.','Język odpowiedzi','Zapytaj o portfolio…','Wyślij pytanie','Wyczyść rozmowę','Otwórz projekt ↗','Zobacz sekcję ↗','Praca','Projekty','O mnie','LOKALNY PRZEWODNIK · BEZ API','Zamknij'],
 fallback:'Nie potrafię pewnie dopasować tego pytania. Zapytaj o pracę, projekty, C++, Spotify lub Codex.',privacy:'Znam tylko publiczne informacje z portfolio. Nie udostępniam prywatnych danych.',greeting:'Cześć! Jestem lokalnym przewodnikiem po portfolio, nie Patrickiem ani modelem AI. Co Cię interesuje?',
 answers:[
 'Patrick zajmuje się wsparciem technicznym L2 w Luigi’s Box. Sprawdza działanie przeglądarki, API, dane produktów i analitykę, audytuje integracje i weryfikuje poprawki. Luigi’s Box tworzy wyszukiwanie i rekomendacje dla e-commerce.',
 'Spotify rotation to lokalny skrypt w Pythonie, który tworzy prywatną playlistę z ulubionych i ostatnio słuchanych utworów. Działa według harmonogramu bez cyklicznych wywołań AI. Kod nie jest publiczny.',
 'Dots to starsza gra internetowa z frontendem w React i backendem w Spring Boot. To przykład wcześniejszej pracy, a nie regularnie aktualizowany produkt.',
 'CSLYS to starszy bot Discord w JavaScript z odtwarzaniem muzyki. Zgodność z obecnymi API nie została sprawdzona.',
 'Patrick zaczął programować dzięki C++ i Counter-Strike. Ma też uczelniany projekt zespołowy dotyczący komunikacji między procesami.',
 'Obecnie kibicuje OpenAI i Tibowi. Podoba mu się kierunek rozwoju Codexu, tempo zmian i komunikacja Tiba. Sam używa Codexu. To osobista opinia, nie powiązanie zawodowe.',
 'Patrick ma tytuł magistra informatyki z TUKE. W pracy dyplomowej połączył agentów uczenia ze wzmocnieniem PPO z generowaniem map przez LLM dla gry wieloosobowej.',
 'Spotify rotation: osobista automatyzacja. Dots: React i Java. CSLYS: bot Discord. Komunikacja między procesami: C++. Większość publicznych repozytoriów jest starsza.',
 'GitHub: khons-hu. X: @ptr1337_. Discord: khons.hu. Mogę pokazać linki, ale nie wysyłam wiadomości ani nie wypowiadam się w jego imieniu.',
 'Patrick Obrtal, w sieci khonsu. Zaczął od C++ i Counter-Strike, studiował informatykę na TUKE, a teraz pracuje we wsparciu technicznym L2 w Luigi’s Box. Testuje agentów programistycznych i gra w CS2.',
 'Śledzi AGI, rekurencyjne samodoskonalenie i nowe modele. Testuje agentów programistycznych we własnej pracy. W pracy dyplomowej zajmował się też PPO.',
 'Counter-Strike to część jego początków z programowaniem i czasu wolnego. O rangę i statystyki zapytaj Patricka. Ten przewodnik jeszcze z nim nie grał.'
 ]},
 cs: {
 ui:['Malý průvodce Patrickovou prací.','Připravené odpovědi, ne AI model. Otázky zůstávají v této kartě a po obnovení zmizí.','Jazyk odpovědí','Zeptej se na portfolio…','Odeslat otázku','Vymazat chat','Otevřít projekt ↗','Zobrazit sekci ↗','Práce','Projekty','O mně','MÍSTNÍ PRŮVODCE · BEZ API','Zavřít'],
 fallback:'Tuto otázku neumím spolehlivě přiřadit. Zkus práci, projekty, C++, Spotify nebo Codex.',privacy:'Znám jen veřejné informace z portfolia. Soukromé údaje tu nejsou.',greeting:'Ahoj! Jsem místní průvodce portfoliem, ne Patrick ani AI model. Co tě zajímá?',
 answers:[
 'Patrick pracuje v L2 technické podpoře v Luigi’s Box. Zkoumá chování webu, API, produktové feedy a analytiku, audituje integrace a ověřuje opravy. Luigi’s Box vyvíjí vyhledávání a doporučování produktů pro e-shopy.',
 'Spotify rotation je místní Python skript, který sestavuje soukromý playlist z oblíbených a nedávno poslouchaných skladeb. Běží podle rozvrhu bez průběžných AI volání. Zdrojový kód není veřejný.',
 'Dots je starší webová hra s React frontendem a Spring Boot backendem. Jde o ukázku dřívější práce, ne o aktuálně udržovaný produkt.',
 'CSLYS je starší JavaScript Discord bot s přehráváním hudby. Kompatibilita s dnešními API není ověřena.',
 'Patrick se dostal k programování přes C++ a Counter-Strike. Ukázkou kódu je také univerzitní týmový projekt meziprocesové komunikace.',
 'Momentálně fandí OpenAI a Tibovi. Líbí se mu směřování Codexu, tempo vývoje a Tibova komunikace. Codex sám používá. Je to osobní preference, ne pracovní spojení.',
 'Patrick má magisterské vzdělání v informatice z TUKE. V diplomové práci spojil PPO agenty s generováním map pomocí LLM pro multiplayerovou hru.',
 'Spotify rotation: osobní automatizace. Dots: React a Java. CSLYS: Discord bot. Meziprocesová komunikace: C++. Většina veřejných repozitářů je starší.',
 'GitHub: khons-hu. X: @ptr1337_. Discord: khons.hu. Ukážu odkazy, ale nemůžu poslat zprávu ani mluvit jeho jménem.',
 'Patrick Obrtal, online khonsu. Začal s C++ a Counter-Strike, vystudoval informatiku na TUKE a dnes pracuje v L2 technické podpoře v Luigi’s Box. Zkouší coding agenty a stále hraje CS2.',
 'Sleduje AGI, rekurzivní sebezdokonalování a nové modely. Coding agenty zkouší ve vlastní práci. V diplomové práci se věnoval PPO.',
 'Counter-Strike patří k jeho programátorským začátkům i volnému času. Na rank a statistiky se zeptej Patricka. Tento průvodce s ním ještě nehrál.'
 ]},
 de: {
 ui:['Ein kleiner Wegweiser durch Patricks Arbeit.','Vorbereitete Antworten, kein KI-Modell. Fragen bleiben in diesem Tab und verschwinden beim Neuladen.','Antwortsprache','Frag etwas zum Portfolio…','Frage senden','Chat leeren','Projekt öffnen ↗','Abschnitt ansehen ↗','Arbeit','Projekte','Über mich','LOKALER GUIDE · KEINE API','Schließen'],
 fallback:'Diese Frage kann ich nicht sicher zuordnen. Frag nach Arbeit, Projekten, C++, Spotify oder Codex.',privacy:'Ich kenne nur die öffentlichen Portfolio-Inhalte. Private Angaben sind hier nicht verfügbar.',greeting:'Hallo! Ich bin ein lokaler Portfolio-Guide, nicht Patrick und kein KI-Modell. Was interessiert dich?',
 answers:[
 'Patrick arbeitet im technischen L2-Support bei Luigi’s Box. Er untersucht Browser-Verhalten, APIs, Produktdaten und Analytics, prüft Integrationen und verifiziert Korrekturen. Luigi’s Box entwickelt Produktsuche und Empfehlungen für Onlineshops.',
 'Spotify rotation ist ein lokales Python-Skript, das aus Lieblingssongs und zuletzt gehörten Titeln eine private Playlist erstellt. Es läuft nach Zeitplan ohne laufende KI-Aufrufe. Der Quellcode ist nicht öffentlich.',
 'Dots ist ein älteres Webspiel mit React-Frontend und Spring-Boot-Backend. Es zeigt frühere Arbeit und wird nicht als aktuell gepflegtes Produkt präsentiert.',
 'CSLYS ist ein älterer Discord-Bot in JavaScript mit Musikwiedergabe. Die Kompatibilität mit heutigen APIs wurde nicht geprüft.',
 'Patrick kam über C++ und Counter-Strike zum Programmieren. Ein Uni-Teamprojekt zur Kommunikation zwischen Prozessen zeigt ebenfalls seinen C++-Hintergrund.',
 'Er ist derzeit Fan von OpenAI und Tibo: wegen der Richtung von Codex, des Entwicklungstempos und Tibos Kommunikation. Patrick nutzt Codex selbst. Das ist eine persönliche Vorliebe, keine berufliche Verbindung.',
 'Patrick hat einen Master in Informatik von der TUKE. Seine Abschlussarbeit kombinierte PPO-Agenten für bestärkendes Lernen mit LLM-basierter Kartengenerierung für ein Mehrspielerspiel.',
 'Spotify rotation: persönliche Automatisierung. Dots: React und Java. CSLYS: Discord-Bot. Prozesskommunikation: C++. Die meisten öffentlichen Repositories sind älter.',
 'GitHub: khons-hu. X: @ptr1337_. Discord: khons.hu. Ich kann die Links zeigen, aber keine Nachrichten senden oder für Patrick sprechen.',
 'Patrick Obrtal, online khonsu. Er begann mit C++ und Counter-Strike, studierte Informatik an der TUKE und arbeitet heute im technischen L2-Support bei Luigi’s Box. Er probiert Coding-Agenten aus und spielt CS2.',
 'Er verfolgt AGI, rekursive Selbstverbesserung und neue Modelle und testet Coding-Agenten bei eigenen Aufgaben. Auch seine Abschlussarbeit mit PPO behandelte lernende Systeme.',
 'Counter-Strike gehört zu seinen Programmieranfängen und seiner Freizeit. Frag Patrick nach Rang und Spielstatistiken. Dieser Guide hat noch nicht mit ihm gespielt.'
 ]}
};
if(typeof module!=='undefined'&&module.exports)module.exports=GUIDE_LOCALES;

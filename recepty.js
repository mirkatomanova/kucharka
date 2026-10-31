// Demonstrační fotky z Wikimedia Commons (volná licence, autor je uveden u receptu).
// Vlastní fotku dáš do složky images/ a napíšeš např. foto: "images/gulas.jpg"
function commons(soubor) {
  const jmeno = soubor.replace(/ /g, "_");
  const mistni = soubor.replace(/\.[^.]+$/, "").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + ".jpg";
  return {
    url: "images/" + mistni,
    zdroj: "https://commons.wikimedia.org/wiki/File:" + encodeURIComponent(jmeno)
  };
}

// Všechny recepty. Nový recept přidáš zkopírováním jednoho bloku { ... }.
// foto: cesta k obrázku ve složce images/ (když chybí, zobrazí se barevná dlaždice)
// cas: čas přípravy v minutách
const RECEPTY = [
  {
    id: "cesnecka",
    nazev: "Česnečka s krutony",
    kategorie: "Polévky",
    foto: commons("Domácí česnečka.jpg"),
    cas: 25,
    porce: 4,
    suroviny: [
      "6 stroužků česneku",
      "4 brambory",
      "1 l vody nebo vývaru",
      "1 lžíce sádla nebo másla",
      "1 lžička kmínu",
      "1 lžička majoránky",
      "100 g sýra eidam",
      "4 krajíce chleba",
      "sůl, pepř"
    ],
    postup: [
      "Brambory oloupej a nakrájej na kostičky.",
      "Na sádle krátce osmahni kmín, přilij vodu, přidej brambory a osol. Vař asi 15 minut doměkka.",
      "Chléb nakrájej na kostky a opeč na pánvi dozlatova.",
      "Do hotové polévky vmíchej prolisovaný česnek a majoránku, už nevař.",
      "Podávej se strouhaným sýrem a krutony."
    ],
    poznamky: "Česnek přidávej až na konec, jinak zhořkne."
  },
  {
    id: "vyvar",
    nazev: "Hovězí vývar s nudlemi",
    kategorie: "Polévky",
    foto: commons("Rindssuppe mit Nudeln.jpg"),
    cas: 180,
    porce: 6,
    suroviny: [
      "500 g hovězího masa (přední)",
      "2 hovězí kosti",
      "2 mrkve",
      "1 petržel",
      "1/4 celeru",
      "1 cibule",
      "5 kuliček pepře",
      "2 bobkové listy",
      "150 g polévkových nudlí",
      "sůl, petrželka"
    ],
    postup: [
      "Maso a kosti dej do studené vody (asi 3 l) a pomalu přiveď k varu. Sbírej pěnu.",
      "Přidej cibuli rozpůlenou a opečenou na suché pánvi, pepř a bobkový list.",
      "Táhni na mírném ohni 2,5 hodiny, nesmí bublat prudce.",
      "Posledních 30 minut přidej kořenovou zeleninu.",
      "Vývar sceď, maso a zeleninu nakrájej a vrať zpět. Nudle uvař zvlášť.",
      "Osol a podávej s nasekanou petrželkou."
    ],
    poznamky: ""
  },
  {
    id: "dynova",
    nazev: "Dýňová krémová polévka",
    kategorie: "Polévky",
    foto: commons("Kürbissuppe mit Kernöl.JPG"),
    cas: 40,
    porce: 4,
    suroviny: [
      "1 kg dýně hokkaido",
      "1 cibule",
      "2 stroužky česneku",
      "1 kus zázvoru (2 cm)",
      "800 ml zeleninového vývaru",
      "200 ml kokosového mléka",
      "1 lžíce oleje",
      "dýňová semínka, sůl, pepř"
    ],
    postup: [
      "Dýni rozpůl, vydlabej semínka a nakrájej i se slupkou na kostky.",
      "Na oleji osmahni cibuli, česnek a nastrouhaný zázvor.",
      "Přidej dýni, zalij vývarem a vař 20 minut doměkka.",
      "Rozmixuj, vmíchej kokosové mléko, osol a opepři.",
      "Podávej s opraženými dýňovými semínky."
    ],
    poznamky: "Hokkaido se nemusí loupat."
  },
  {
    id: "svickova",
    nazev: "Svíčková na smetaně",
    kategorie: "Hlavní jídla",
    foto: commons("Praha 2005-09-25 svíčková na smetaně-00.jpg"),
    cas: 180,
    porce: 4,
    suroviny: [
      "800 g hovězí kýty nebo svíčkové",
      "100 g slaniny",
      "2 mrkve",
      "1 petržel",
      "1/2 celeru",
      "1 cibule",
      "250 ml smetany ke šlehání",
      "2 lžíce octa",
      "1 lžička cukru",
      "5 kuliček nového koření",
      "3 bobkové listy",
      "1 lžíce hladké mouky",
      "1 knedlík",
      "brusinky na podávání"
    ],
    postup: [
      "Maso prošpikuj slaninou, osol a opepři.",
      "Zeleninu a cibuli nakrájej, osmahni v pekáči a na ni polož maso.",
      "Přidej koření, ocet, cukr a podlij vodou. Peč přikryté na 170 °C asi 2,5 hodiny.",
      "Maso vyndej, zeleninu se šťávou rozmixuj, přidej smetanu s moukou a povař.",
      "Dochuť solí, cukrem a octem. Podávej s knedlíkem, brusinkami a šlehačkou."
    ],
    poznamky: "Nejlepší je druhý den."
  },
  {
    id: "kari",
    nazev: "Kuřecí kari s rýží",
    kategorie: "Hlavní jídla",
    foto: commons("Chicken Curry Rice.jpg"),
    cas: 35,
    porce: 4,
    suroviny: [
      "600 g kuřecích prsou",
      "1 cibule",
      "2 stroužky česneku",
      "2 lžíce kari koření",
      "400 ml kokosového mléka",
      "1 plechovka krájených rajčat",
      "1 hrst baby špenátu",
      "300 g rýže basmati",
      "1 lžíce oleje",
      "sůl, koriandr"
    ],
    postup: [
      "Rýži propláchni a uvař podle návodu.",
      "Kuře nakrájej na kostky a opeč na oleji, vyndej.",
      "Na stejné pánvi osmahni cibuli a česnek, přidej kari a krátce opraž.",
      "Přilij rajčata a kokosové mléko, vrať kuře a duš 15 minut.",
      "Na konci vmíchej špenát, osol a podávej s rýží a koriandrem."
    ],
    poznamky: ""
  },
  {
    id: "aglio-olio",
    nazev: "Špagety aglio e olio",
    kategorie: "Hlavní jídla",
    foto: commons("Aglio e olio.jpg"),
    cas: 20,
    porce: 2,
    suroviny: [
      "200 g špaget",
      "4 stroužky česneku",
      "5 lžic olivového oleje",
      "1 sušená chilli paprička",
      "hrst petrželky",
      "parmazán",
      "sůl"
    ],
    postup: [
      "Špagety uvař v osolené vodě al dente. Hrnek vody z těstovin si nech.",
      "Česnek nakrájej na plátky a na mírném ohni ho na oleji s chilli opékej dozlatova.",
      "Přidej scezené špagety, trochu vody z těstovin a promíchej, až vznikne lesklá omáčka.",
      "Vmíchej petrželku a podávej s parmazánem."
    ],
    poznamky: "Česnek nesmí zhnědnout, jinak hořkne."
  },
  {
    id: "bramborovy-salat",
    nazev: "Bramborový salát",
    kategorie: "Přílohy a saláty",
    foto: commons("Christmas carp with potato salad.jpg"),
    cas: 45,
    porce: 6,
    suroviny: [
      "1 kg brambor (salátových)",
      "3 mrkve",
      "1 petržel",
      "1/4 celeru",
      "4 kyselé okurky",
      "1 cibule",
      "150 g hrášku",
      "4 vejce natvrdo",
      "250 g majonézy",
      "2 lžíce nálevu z okurek",
      "1 lžička plnotučné hořčice",
      "sůl, pepř"
    ],
    postup: [
      "Brambory uvař ve slupce, kořenovou zeleninu zvlášť. Nech vychladnout.",
      "Vše oloupej a nakrájej na malé kostičky, stejně tak okurky, cibuli a vejce.",
      "Přidej hrášek, majonézu, hořčici a nálev z okurek.",
      "Osol, opepři a promíchej. Nech v lednici odležet aspoň přes noc."
    ],
    poznamky: "Na Vánoce dělat den předem."
  },
  {
    id: "strudl",
    nazev: "Jablečný štrúdl",
    kategorie: "Dezerty",
    foto: commons("Strudel.jpg"),
    cas: 60,
    porce: 8,
    suroviny: [
      "1 balení listového těsta (400 g)",
      "1 kg jablek",
      "80 g cukru",
      "1 lžička skořice",
      "50 g rozinek",
      "50 g vlašských ořechů",
      "3 lžíce strouhanky",
      "1 vejce na potření",
      "moučkový cukr"
    ],
    postup: [
      "Jablka oloupej a nastrouhej nahrubo, smíchej s cukrem, skořicí, rozinkami a ořechy.",
      "Těsto rozválej na obdélník a posyp strouhankou.",
      "Rozlož náplň, zaviň a konce přitiskni.",
      "Potři rozšlehaným vejcem a peč na 190 °C asi 35 minut dozlatova.",
      "Po vychladnutí pocukruj."
    ],
    poznamky: ""
  },
  {
    id: "babovka",
    nazev: "Bábovka",
    kategorie: "Dezerty",
    foto: commons("Marmorkuchen-Minigugelhupf angeschnitten 2022 (cropped).jpg"),
    cas: 70,
    porce: 10,
    suroviny: [
      "250 g hladké mouky",
      "200 g cukru krupice",
      "4 vejce",
      "125 ml oleje",
      "200 ml mléka",
      "1 prášek do pečiva",
      "1 vanilkový cukr",
      "2 lžíce kakaa",
      "máslo a hrubá mouka na formu"
    ],
    postup: [
      "Formu vymaž máslem a vysyp moukou. Troubu předehřej na 170 °C.",
      "Vejce vyšlehej s cukrem do pěny, přidej olej a mléko.",
      "Vmíchej mouku s práškem do pečiva a vanilkovým cukrem.",
      "Třetinu těsta smíchej s kakaem. Do formy střídavě lij světlé a tmavé těsto.",
      "Peč 45–50 minut. Hotovou poznáš špejlí, která zůstane suchá."
    ],
    poznamky: "Recept od babičky."
  }
];

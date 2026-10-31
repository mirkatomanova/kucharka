// Rodinná kuchařka – logika stránky (seznam, filtr, hledání, detail, poznámky)

const KATEGORIE = ["Vše", "Polévky", "Hlavní jídla", "Přílohy a saláty", "Dezerty"];

const stav = { kategorie: "Vše", dotaz: "" };
const obsah = document.getElementById("obsah");

const IKONA_HLEDANI = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>`;

/* ---------- Pomocné funkce ---------- */

// Odstraní diakritiku a velká písmena
function normalizuj(text) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function escapuj(text) {
  return String(text).replace(/[&<>"']/g, z => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[z]));
}

function formatCas(minuty) {
  if (minuty < 60) return `${minuty} min`;
  const h = Math.floor(minuty / 60), m = minuty % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

function formatPorce(n) {
  if (n === 1) return "1 porce";
  if (n >= 2 && n <= 4) return `${n} porce`;
  return `${n} porcí`;
}

// foto může být text ("images/x.jpg") nebo objekt { url, zdroj } z Wikimedia Commons
function fotoUrl(r) { return typeof r.foto === "string" ? r.foto : (r.foto && r.foto.url) || ""; }
function fotoZdroj(r) { return typeof r.foto === "object" && r.foto ? r.foto.zdroj : ""; }

function obrazek(r, lazy = true) {
  const url = fotoUrl(r);
  const nahrada = `<div class="nahrada" aria-hidden="true">${escapuj(r.nazev.charAt(0))}</div>`;
  if (!url) return nahrada;
  return `<img src="${escapuj(url)}" alt="${escapuj(r.nazev)}" data-pismeno="${escapuj(r.nazev.charAt(0))}" ${lazy ? 'loading="lazy"' : ""}>`;
}

// Když se fotka nenačte, nahradí se dlaždicí s počátečním písmenem
document.addEventListener("error", e => {
  const img = e.target;
  if (img.tagName !== "IMG" || !img.dataset.pismeno) return;
  const div = document.createElement("div");
  div.className = "nahrada";
  div.textContent = img.dataset.pismeno;
  img.replaceWith(div);
}, true);

/* ---------- Hledání ---------- */

// Ze slova udělá "kmen", aby "mrkev" našlo i "mrkve" a "česnek" i "česneku"
function kmeny(dotaz) {
  return normalizuj(dotaz).split(/\s+/).filter(Boolean)
    .map(s => s.length >= 5 ? s.slice(0, Math.max(3, s.length - 2)) : s.length === 4 ? s.slice(0, 3) : s);
}

// Hledá jen na začátku slov, aby "kuře" nenašlo "okurky"
function obsahuje(text, kmen) {
  return normalizuj(text).split(/[^a-z0-9]+/).some(slovo => slovo.startsWith(kmen));
}

function odpovidaDotazu(r, dotaz) {
  if (!dotaz) return true;
  const text = [r.nazev, ...r.suroviny].join(" ");
  return kmeny(dotaz).every(k => obsahuje(text, k));
}

function najdiSurovinu(r, dotaz) {
  if (!dotaz) return null;
  const k = kmeny(dotaz);
  return r.suroviny.find(s => k.some(x => obsahuje(s, x))) || null;
}

function filtrovane() {
  return RECEPTY.filter(r =>
    (stav.kategorie === "Vše" || r.kategorie === stav.kategorie) && odpovidaDotazu(r, stav.dotaz)
  );
}

/* ---------- Seznam ---------- */

function vykresliSeznam() {
  document.title = "Rodinná kuchařka";
  obsah.innerHTML = `
    <header class="uvod">
      <h1>Rodinná kuchařka</h1>
      <p>Naše osvědčené recepty na jednom místě. Hledej podle názvu nebo podle toho, co máš doma.</p>
      <div class="hledani-obal">
        ${IKONA_HLEDANI}
        <input class="hledani" type="search" placeholder="Např. svíčková, mrkev, česnek…" value="${escapuj(stav.dotaz)}" aria-label="Hledat recept nebo surovinu">
      </div>
      <div class="kategorie" role="group" aria-label="Kategorie">
        ${KATEGORIE.map(k => {
          const pocet = k === "Vše" ? RECEPTY.length : RECEPTY.filter(r => r.kategorie === k).length;
          return `<button type="button" data-k="${k}" aria-pressed="${k === stav.kategorie}">${k}<span class="pocet">${pocet}</span></button>`;
        }).join("")}
      </div>
    </header>
    <section class="mrizka" id="mrizka" aria-live="polite"></section>
  `;

  obsah.querySelector(".hledani").addEventListener("input", e => { stav.dotaz = e.target.value; vykresliKarty(); });

  obsah.querySelectorAll(".kategorie button").forEach(b => {
    b.addEventListener("click", () => {
      stav.kategorie = b.dataset.k;
      obsah.querySelectorAll(".kategorie button").forEach(x => x.setAttribute("aria-pressed", x === b));
      vykresliKarty();
    });
  });

  vykresliKarty();
}

function vykresliKarty() {
  const mrizka = document.getElementById("mrizka");
  const seznam = filtrovane();
  if (!seznam.length) {
    mrizka.innerHTML = `<div class="prazdno">
      <p>Žádný recept neodpovídá hledání „${escapuj(stav.dotaz)}“${stav.kategorie !== "Vše" ? ` v kategorii ${escapuj(stav.kategorie)}` : ""}.</p>
      <button type="button" id="zrusit">Zobrazit všechny recepty</button></div>`;
    document.getElementById("zrusit").addEventListener("click", () => {
      stav.dotaz = ""; stav.kategorie = "Vše"; vykresliSeznam();
    });
    return;
  }
  mrizka.innerHTML = seznam.map(r => {
    const surovina = najdiSurovinu(r, stav.dotaz);
    const shoda = surovina && !kmeny(stav.dotaz).every(k => obsahuje(r.nazev, k))
      ? `<div class="shoda">Obsahuje: ${escapuj(surovina)}</div>` : "";
    return `
      <a class="recept" href="#recept/${encodeURIComponent(r.id)}">
        <div class="obrazek">${obrazek(r)}</div>
        <h2>${escapuj(r.nazev)}</h2>
        <div class="udaje"><span>${escapuj(r.kategorie)}</span><span>${formatCas(r.cas)}</span><span>${formatPorce(r.porce)}</span></div>
        ${shoda}
      </a>`;
  }).join("");
}

/* ---------- Detail ---------- */

function klicPoznamky(id) { return `poznamka-${id}`; }
function nactiPoznamku(id) { try { return localStorage.getItem(klicPoznamky(id)) || ""; } catch { return ""; } }
function ulozPoznamku(id, text) { try { localStorage.setItem(klicPoznamky(id), text); return true; } catch { return false; } }

function vykresliDetail(id) {
  const r = RECEPTY.find(x => x.id === id);
  if (!r) {
    obsah.innerHTML = `<a class="zpet" href="#">← Všechny recepty</a><p class="prazdno">Tento recept v kuchařce není.</p>`;
    return;
  }
  document.title = `${r.nazev} – Rodinná kuchařka`;
  const zdroj = fotoZdroj(r);

  obsah.innerHTML = `
    <a class="zpet" href="#">← Všechny recepty</a>
    <div class="detail-obrazek">${obrazek(r, false)}</div>
    ${zdroj ? `<p class="autor-foto">Foto: <a href="${escapuj(zdroj)}" target="_blank" rel="noopener">Wikimedia Commons – autor a licence</a></p>` : ""}

    <header class="hlavicka-receptu">
      <a class="kat" href="#" data-kat="${escapuj(r.kategorie)}">${escapuj(r.kategorie)}</a>
      <h1>${escapuj(r.nazev)}</h1>
      <ul class="fakta">
        <li><span>Příprava</span>${formatCas(r.cas)}</li>
        <li><span>Množství</span>${formatPorce(r.porce)}</li>
      </ul>
    </header>

    <div class="telo-receptu">
      <aside class="suroviny-panel">
        <h2>Suroviny</h2>
        <ul class="suroviny">${r.suroviny.map(s => `<li>${escapuj(s)}</li>`).join("")}</ul>
      </aside>
      <div>
        <h2>Postup</h2>
        <ol class="postup">${r.postup.map(k => `<li><span>${escapuj(k)}</span></li>`).join("")}</ol>

        <section class="poznamky">
          <h2>Poznámky</h2>
          ${r.poznamky ? `<p class="poznamka-recept">${escapuj(r.poznamky)}</p>` : ""}
          <div class="moje-poznamky">
            <label for="moje" class="napoveda">Tvoje poznámky (ukládají se jen v tomto prohlížeči)</label>
            <textarea id="moje" placeholder="Třeba: příště méně soli, víc česneku…">${escapuj(nactiPoznamku(r.id))}</textarea>
            <p class="napoveda" id="stav-ulozeni" aria-live="polite"></p>
          </div>
        </section>
      </div>
    </div>
  `;

  obsah.querySelector(".kat").addEventListener("click", () => { stav.kategorie = r.kategorie; stav.dotaz = ""; });

  const pole = document.getElementById("moje");
  const info = document.getElementById("stav-ulozeni");
  let casovac;
  pole.addEventListener("input", () => {
    clearTimeout(casovac);
    casovac = setTimeout(() => {
      info.textContent = ulozPoznamku(r.id, pole.value)
        ? "Uloženo"
        : "Poznámku nejde uložit: prohlížeč nepovoluje ukládání.";
    }, 400);
  });
  window.scrollTo(0, 0);
}

/* ---------- Směrování přes # v adrese ---------- */

function router() {
  const hash = decodeURIComponent(location.hash.slice(1));
  if (hash.startsWith("recept/")) vykresliDetail(hash.slice(7));
  else vykresliSeznam();
}

window.addEventListener("hashchange", router);
router();

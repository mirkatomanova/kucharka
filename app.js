// Rodinná kuchařka – logika stránky (seznam, filtr, hledání, detail)

const KATEGORIE = ["Vše", "Polévky", "Hlavní jídla", "Přílohy a saláty", "Dezerty"];
const TRIDA_KATEGORIE = {
  "Polévky": "k-polevky",
  "Hlavní jídla": "k-hlavni",
  "Přílohy a saláty": "k-prilohy",
  "Dezerty": "k-dezerty"
};

const stav = { kategorie: "Vše", dotaz: "" };
const obsah = document.getElementById("obsah");

// Odstraní diakritiku a velká písmena, aby "mrkev" našlo i "Mrkve"
function normalizuj(text) {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
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

function fotka(recept) {
  if (recept.foto) {
    return `<img class="foto" src="${escapuj(recept.foto)}" alt="${escapuj(recept.nazev)}" loading="lazy">`;
  }
  const trida = TRIDA_KATEGORIE[recept.kategorie] || "k-jine";
  return `<div class="foto-nahrada ${trida}">${escapuj(recept.nazev.charAt(0))}</div>`;
}

// Z hledaného slova udělá "kmen" (bez posledních písmen), aby "mrkev" našlo i "mrkve"
// a "česnek" i "česneku"
function kmeny(dotaz) {
  return normalizuj(dotaz).split(/\s+/).filter(Boolean)
    .map(s => s.length >= 5 ? s.slice(0, Math.max(3, s.length - 2)) : s.length === 4 ? s.slice(0, 3) : s);
}

// Hledá jen na začátku slov, aby "kuře" nenašlo "okurky"
function obsahuje(text, kmen) {
  return normalizuj(text).split(/[^a-z0-9]+/).some(slovo => slovo.startsWith(kmen));
}

function odpovidaDotazu(recept, dotaz) {
  if (!dotaz) return true;
  const text = [recept.nazev, ...recept.suroviny].join(" ");
  return kmeny(dotaz).every(k => obsahuje(text, k));
}

function najdiSurovinu(recept, dotaz) {
  if (!dotaz) return null;
  const slova = kmeny(dotaz);
  return recept.suroviny.find(s => slova.some(k => obsahuje(s, k))) || null;
}

function filtrovane() {
  return RECEPTY.filter(r =>
    (stav.kategorie === "Vše" || r.kategorie === stav.kategorie) &&
    odpovidaDotazu(r, stav.dotaz)
  );
}

/* ---------- Seznam ---------- */

function vykresliSeznam() {
  document.title = "Rodinná kuchařka";
  obsah.innerHTML = `
    <div class="ovladani">
      <input class="hledani" type="search" placeholder="Hledej podle názvu nebo suroviny (např. mrkev, česnek)…" value="${escapuj(stav.dotaz)}" aria-label="Hledat">
      <div class="kategorie">
        ${KATEGORIE.map(k => `<button data-k="${k}" class="${k === stav.kategorie ? "aktivni" : ""}">${k}</button>`).join("")}
      </div>
    </div>
    <div class="mrizka" id="mrizka"></div>
  `;

  const pole = obsah.querySelector(".hledani");
  pole.addEventListener("input", e => { stav.dotaz = e.target.value; vykresliKarty(); });

  obsah.querySelectorAll(".kategorie button").forEach(b => {
    b.addEventListener("click", () => {
      stav.kategorie = b.dataset.k;
      obsah.querySelectorAll(".kategorie button").forEach(x => x.classList.toggle("aktivni", x === b));
      vykresliKarty();
    });
  });

  vykresliKarty();
}

function vykresliKarty() {
  const mrizka = document.getElementById("mrizka");
  const seznam = filtrovane();
  if (!seznam.length) {
    mrizka.innerHTML = `<p class="prazdno">Nic jsme nenašli. Zkus jiné slovo nebo kategorii.</p>`;
    return;
  }
  mrizka.innerHTML = seznam.map(r => {
    const surovina = najdiSurovinu(r, stav.dotaz);
    const shoda = surovina && !kmeny(stav.dotaz).every(k => obsahuje(r.nazev, k))
      ? `<div class="meta">obsahuje: ${escapuj(surovina)}</div>` : "";
    return `
      <a class="karta" href="#recept/${encodeURIComponent(r.id)}">
        ${fotka(r)}
        <div class="info">
          <span class="stitek">${escapuj(r.kategorie)}</span>
          <h3>${escapuj(r.nazev)}</h3>
          <div class="meta">⏱ ${formatCas(r.cas)} · ${formatPorce(r.porce)}</div>
          ${shoda}
        </div>
      </a>`;
  }).join("");
}

/* ---------- Detail ---------- */

function klicPoznamky(id) { return `poznamka-${id}`; }

function nactiPoznamku(id) {
  try { return localStorage.getItem(klicPoznamky(id)) || ""; } catch { return ""; }
}
function ulozPoznamku(id, text) {
  try { localStorage.setItem(klicPoznamky(id), text); return true; } catch { return false; }
}

function vykresliDetail(id) {
  const r = RECEPTY.find(x => x.id === id);
  if (!r) {
    obsah.innerHTML = `<a class="zpet" href="#">← Zpět na recepty</a><p class="prazdno">Recept nebyl nalezen.</p>`;
    return;
  }
  document.title = `${r.nazev} – Rodinná kuchařka`;
  obsah.innerHTML = `
    <a class="zpet" href="#">← Zpět na recepty</a>
    <article class="detail">
      ${fotka(r)}
      <div class="detail-telo">
        <span class="stitek">${escapuj(r.kategorie)}</span>
        <h1>${escapuj(r.nazev)}</h1>
        <div class="fakta">
          <span>⏱ ${formatCas(r.cas)}</span>
          <span>🍽 ${formatPorce(r.porce)}</span>
        </div>
        <div class="sloupce">
          <section>
            <h2>Suroviny</h2>
            <ul class="suroviny">${r.suroviny.map(s => `<li>${escapuj(s)}</li>`).join("")}</ul>
          </section>
          <section>
            <h2>Postup</h2>
            <ol class="postup">${r.postup.map(k => `<li>${escapuj(k)}</li>`).join("")}</ol>
          </section>
        </div>
        <section>
          <h2>Poznámky</h2>
          ${r.poznamky ? `<p class="poznamka-recept">${escapuj(r.poznamky)}</p>` : ""}
          <div class="moje-poznamky">
            <textarea id="moje" placeholder="Tvoje poznámky – např. příště méně soli, přidat víc česneku…">${escapuj(nactiPoznamku(r.id))}</textarea>
            <p class="napoveda" id="stav-ulozeni">Vlastní poznámky se ukládají automaticky v tomto prohlížeči.</p>
          </div>
        </section>
      </div>
    </article>
  `;

  const pole = document.getElementById("moje");
  const info = document.getElementById("stav-ulozeni");
  let casovac;
  pole.addEventListener("input", () => {
    clearTimeout(casovac);
    casovac = setTimeout(() => {
      info.textContent = ulozPoznamku(r.id, pole.value)
        ? "Uloženo ✓ (v tomto prohlížeči)"
        : "Poznámku se nepodařilo uložit – prohlížeč ukládání nepovoluje.";
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

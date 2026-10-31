# Rodinná kuchařka

Jednoduchý statický web s recepty (HTML + CSS + JS, bez sestavování).

## Soubory
- `index.html` – stránka
- `style.css` – vzhled
- `app.js` – seznam, filtr kategorií, hledání, detail, poznámky
- `recepty.js` – **tady jsou recepty** (přidávej a upravuj tady)
- `images/` – fotky receptů

## Nový recept
Zkopíruj v `recepty.js` jeden blok `{ ... }`, změň `id` (bez mezer a diakritiky), název a obsah.
Fotku nahraj do `images/` a do pole `foto` napiš např. `"images/gulas.jpg"`.

## Nasazení na GitHub Pages
1. Na GitHubu vytvoř nový repozitář, např. `kucharka`.
2. Nahraj do něj všechny soubory (Add file → Upload files, nebo `git push`).
3. Settings → Pages → Source: *Deploy from a branch*, Branch: `main`, složka `/ (root)` → Save.
4. Za minutu bude web na `https://<tvuj-ucet>.github.io/kucharka/`.

Pozor: na bezplatném účtu je GitHub Pages veřejné i u soukromého repozitáře.
Stránka má `noindex`, takže ji vyhledávače nebudou indexovat, ale kdo zná adresu, ten ji otevře.

## Poznámky
- Pole `poznamky` v `recepty.js` vidí všichni.
- Vlastní poznámky psané na stránce se ukládají jen v prohlížeči, kde je napíšeš.

## Lokální spuštění
Stačí otevřít `index.html` dvojklikem.

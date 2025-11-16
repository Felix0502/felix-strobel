# 🔄 Mobile-Desktop Synchronisation

## Übersicht

Das Script `sync-mobile-projects.py` synchronisiert automatisch die Mobile-Projektseiten mit der Desktop-Version aus `index.html`.

**Was wird synchronisiert:**
- ✅ Hero-Bilder und Hero-Videos
- ✅ Projekt-Titel
- ✅ Alle Bilder im ersten Slider
- ✅ Alle Videos im ersten Slider
- ✅ Slide-Titel und Beschreibungen
- ✅ Thumbnails (automatisch über index.html verlinkt)

## 📝 Verwendung

### Einfach das Script ausführen:

```bash
python3 sync-mobile-projects.py
```

### Oder mit ausführbaren Rechten:

```bash
./sync-mobile-projects.py
```

## 🎯 Workflow

**1. Änderungen in `index.html` machen**
   - Bilder in Projekt-Slidern ändern
   - Texte anpassen
   - Videos einfügen
   - Thumbnails aktualisieren

**2. Sync-Script ausführen**
   ```bash
   python3 sync-mobile-projects.py
   ```

**3. Fertig!**
   - Alle Mobile-Seiten sind jetzt synchronisiert
   - Desktop und Mobile zeigen die gleichen Inhalte

## 📁 Betroffene Dateien

Das Script aktualisiert automatisch:
- `project-coworker.html` ← Projekt 1 aus `index.html`
- `project-momox.html` ← Projekt 2 aus `index.html`
- `project-ai-agents.html` ← Projekt 3 aus `index.html`
- `project-ai-shopping.html` ← Projekt 4 aus `index.html`

## ⚙️ Technische Details

### Projekt-Mapping:
- `project-1` (index.html) → `project-coworker.html`
- `project-2` (index.html) → `project-momox.html`
- `project-3` (index.html) → `project-ai-agents.html`
- `project-4` (index.html) → `project-ai-shopping.html`

### Was wird extrahiert:
1. **Hero-Bereich**: Bild oder Video
2. **Projekt-Titel**: Die h1-Überschrift
3. **Erster Slider**: Alle Slides mit Bildern/Videos, Titeln und Beschreibungen

### Datenfluss:
```
index.html (Desktop)
    ↓ [Extract]
projects_data.json (Temp)
    ↓ [Update]
project-*.html (Mobile)
```

## 🔍 Beispiel-Output

```
============================================================
  SYNC MOBILE PROJECTS
============================================================

[1/2] Extracting project data from index.html...
  ✓ coworker: 8 slides
  ✓ momox: 5 slides
  ✓ ai-agents: 6 slides
  ✓ ai-shopping: 3 slides

[2/2] Updating 4 mobile project pages...

project-ai-agents.html:
  ✓ Hero image: assets/images/Comdesk_Titel/Comdesk_Titelbild.png
  ✓ Title: AI Agents
  ✓ Slider: 6 slides

============================================================
✅ SUCCESS: All 4 mobile pages synchronized!
============================================================
```

## 💡 Wichtig

- **Immer nach Änderungen in `index.html` ausführen!**
- Das Script überschreibt die Mobile-Seiten komplett (für Hero, Titel und ersten Slider)
- Andere Slider-Sections in Mobile-Seiten bleiben unberührt
- Das Script erstellt automatisch `projects_data.json` (kann ignoriert werden)

## 🚀 Best Practice

1. Änderungen in `index.html` machen
2. Im Browser testen (Desktop)
3. Script ausführen: `python3 sync-mobile-projects.py`
4. Im Browser testen (Mobile)
5. Fertig! ✅

---

**Erstellt für:** Portfolio Felix Strobel  
**Version:** 1.0  
**Letzte Aktualisierung:** 2025


















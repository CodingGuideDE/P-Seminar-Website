# P-Seminar-Website

Landing Page für **LokalKI** – die KI-Box für Arztpraxen, Kanzleien und Steuerberater.

Reine statische Seite (HTML, CSS, JavaScript), keine Abhängigkeiten und kein Build-Schritt.

## Ansehen

`index.html` im Browser öffnen – oder lokal starten:

```bash
python3 -m http.server 8000
# dann http://localhost:8000 öffnen
```

Für GitHub Pages: *Settings → Pages → Deploy from branch* und den Root-Ordner wählen.

## Aufbau

```
index.html            Inhalt und alle Grafiken (Inline-SVG)
assets/css/style.css  Design, Scroll-Animationen, Dark Mode, Responsive
assets/js/main.js     Navigation, Reveal-Effekte, Fortschrittslinien,
                      Anonymisierungs-Demo, Formular
assets/favicon.svg    Favicon
```

## Abschnitte

1. Start – Kernbotschaft und „Demo anfragen“
2. Problem – Schweigepflicht vs. Wunsch nach KI
3. Lösung – „Ihr KI-Assistent, der im Haus bleibt“
4. So funktioniert’s – Beratung → Installation → 24/7
5. Anwendungsfälle – Nacht-Zeitleiste mit Morgen-Briefing, Hybrid-Anonymisierung, Zielgruppen
6. Pakete und Preise
7. Sicherheit & Recht – inkl. Vergleichstabelle
8. Über den Gründer
9. FAQ
10. Kontakt / Demo-Termin

## Hinweise

- Das Demo-Formular prüft die Eingaben und zeigt eine Bestätigung an, verschickt aber nichts.
  Für echten Versand z. B. einen Formular-Dienst eintragen oder `mailto:` verwenden (`assets/js/main.js`).
- Animationen respektieren die Systemeinstellung „Bewegung reduzieren“.

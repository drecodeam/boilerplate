WordPress Theme Boilerplate.

## Warum?
Die Vorteile bei der Verwendung einer Boilerplate dieser Art:
- _erhebliche_ Verkürzung der benötigten Umsetzungszeit eines Themes bzw. damit
einhergehende Steigerung der Produktivität
- einheitliche Workflows und Resultate
- Automatisierung von sich wiederholenden Aufgaben
- Umsetzung von Best Practises
- Automatische Abhängigskeitverwaltung

Desweiteren gestaltet sich die Implementierug von Themes auch unter Verwendung
der Boilerplate großteils genau wie zuvor.

## Features
Abgesehen von einer vorgegebenen Struktur und Arbeitsweise arbeitet dieses
Boilerplate mit "Grunt", einem Task-Runner. Dieser Task-Runner übernimmt
dabei häufig anfallende Aufgaben teilweise bishin zu komplett automatisch.
Zu den zur Verfügung stehenden Features zählen:

### SASS
> "CSS with superpowers"

SASS ist eine "Verbesserung" von CSS. Es werden dabei nützliche Features wie
z.B.  Verschachtelungen, Variablen, Funktionen oder auch Operatoren
nachgereicht. Dabei bleibt die Syntax relativ gleich;

CSS:
```
a {
    text-color: #ff0000;
}

a:hover {
    text-color: #000000;
}

a:active {
    text-color: #00ff00;
}

.container {
    width: 980px;
}

.container .sub-container {
    width: 780px;
}
```

Das entsprechende SASS Äquivalent dazu:
```
$link-color: #ff0000;
$link-hover-color: #000000;
$link-active-color: #00ff00;
$container-width: 980px;

a {
    text-color: $link-color;

    &:hover {
        text-color: $link-hover-color;
    }

    &:active {
        text-color: $link-active-color;
    }
}

.container {
    width: $container-width;

    .sub-container {
        width: $container-width - 200px;
    }
}
```

Wichtig hierbei ist die Tatsache, dass man SASS *nicht verwenden **muss***.
Nach wie vor kann man natives CSS schreiben. Aus Gründen der Nachhaltigkeit und
Wartbarkeit ist SASS aber empfehlenswerter.

### Strukturelle Vorgaben
Die Boilerplate gibt eine sehr einfache Struktur zur Verwaltung von Assets
(Javascript-Dateien, SASS, Bilder, ...) vor. Aufgrund der Simplizität von
WordPress Themes wird hier auch keine komplexere Struktur benötigt.

### Best Practises
Abgeshen vom modernen Build-Prozess werden auch weitere Best Practises der
WordPress Theme Entwicklung eingehalten; so können z.B. für das Theme relevante
Plugins (Slider, Shops, ...) definiert und damit als "notwendig" bzw. auch als
"empfohlen" deklariert werden. Fehlen solche definierten Plugins dann bei
Aktivierung des Themes wird automatisch ein Fehler ausgegeben inkl. dem Link
zu den entsprechenden Plugins.

### Automatische Paketverwaltung
Mittels Bower werden Abhängigkeiten des Themes (wie z.B. jQuery, Foundation,
Bootstrap, ...) automatisch verwaltet. Die Abhängigkeiten müssen lediglich
in einer Datei oder über die Konsole namentlich genannt werden - um den Rest
kümmert sich Grunt.

Wird während der Entwicklung die Version eines Pakets getauscht, ein neues
Paket hinzugefügt oder entfernt, wird die Installation respektive
De-Installation des Pakets automatisch durchgeführt.

Desweiteren werden alle Abhängigkeiten nach Installation konkateniert und in
einer Datei zusammengefasst - so spart man Requests und damit Ladezeit.

### Linting & CheckStyle
CSS, JS und auch SASS wird durch Grunt durchgehend auf Fehler überprüft. So
werden Dinge wie unnötige `!important`-Statements, falsche Zeileneinrückungen
oder Syntaxfehler sofort ersichtlich.

JavaScript-Dateien werden zudem via JSCS (JavaScript CheckStyle) auf
einen einheitlichen Stil überprüft. Dieser Stil ist dabei frei in einer
Konfigurationsdatei zu definieren.

> All code in any code-base should look like a single person typed it, no
matter how many people contributed.

### Theme Builds
Der wohl relevanteste Task ist der `build`-Task. Dieser übernimmt die meisten
Grunt-Tasks:

- Er installiert und konkateniert alle Abhängigkeiten
- Er überprüft die Theme-CSS (`style.css`)
- Er überprüft alle SASS-Dateien
- Er überprüft und konkateniert alle JS-Dateien

### Release
Eine Fortsetzung des `build`-Tasks ist der `release`-Task der die automatische
"Fertigstellung" eines Themes übernimmt. Dabei werden sämtliche Tasks des
`build`-Tasks ausgeführt und außerdem:

- *Sämtliche* CSS Dateien werden zu einer einzigen Datei zusammengefasst
- *Sämtliche* JS Dateien werden zu einer einzigen Datei zusammengefasst
- Ein "Banner" wird an den Kopf der erstellten Datei gehängt (für z.B.
Firmenname, Copyright, ...)
- Ein weiteres Banner wird an den Fuss der erstellten Datei gehängt mit einem
Zeitstempel und einer Kurzversion der Git-Revision; so können Release-Builds
schnell verglichen werden
- Sämtliche "nicht Release"-Dateien werden gelöscht

### Automatischer FTP-Deploy
Sämtliche für WordPress relevanten Dateien können über einen einzigen Befehl
auf einen FTP-Server geladen werden. Dabei werden alle für den Build relevanten
Konfigurationen (Grunt, SASS, ...) nicht mitkopiert, sondern nur die fertigen
Release-Dateien.

Zudem kann man zwischen Live- und Testsystem unterscheiden.

### Livereload
Bei Änderungen an Dateien wird die Seite automatisch neu geladen und muss nicht
manuell via Window-Fokus-Wechsel + `ctrl + r` neugeladen werden.

## Workflow
Um den Workflow mit diesem Boilerplate möglichst einfach zu gestalten wird
folgender Workflow vorgeschlagen:

Beim Neuanfang eines Themes:
1. Projekt über git forken*
2. `npm install` ausführen um boilerplate-spezifische Tools zu installieren
3. Konfigurationsdateien (FTP-Daten, etc.) anpassen*
4. `grunt build` aufrufen um einen initialen Build zu erstellen
5. Theme entwickeln

Bei bereits vorhanden Themes:
1. `grunt` starten (Der Standard-Task von Grunt überwacht Dateien auf Änderungen
    und reagiert entsprechend)
2. Theme entwickeln

Grunt ist so konfiguriert, dass es auf Änderungen reagiert. Wird beispielsweise
die `style.css` geändert, wird diese sobald die Änderungen gespeichert worden
sind, auf Fehler überprüft. Oder auch werden SASS Dateien beim Speichern
automatisch nach CSS übersetzt. Etwaige Fehler bei der Überprüfung von Dateien
werden über betriebssystem-spezifische Notfikations-Systeme ausgegeben (Growl,
Windows 8 notifications, ...).

Ist ein Theme fertig kann man die releasefertige Version über den `release`-
Task bereitstellen und anschließend über den integrierten FTP Deploy
Mechanismus auf einen Server spielen.

## Anforderungen
- NodeJS
- SASS

Weitere Abhängigkeiten für diesen Boilerplate können anschließend automatisch
über `npm install` installiert werden.

## Tasks
- `grunt build` - Baut das Theme (übersetzt SASS nach CSS, überprüft alle
Dateien, ...)
- `grunt release` - Erstellt eine releasefertige Version des Themes
- `grunt validate` - Überprüft sämtliche Dateien
- `grunt ftp-deploy:live|staging` - Spielt die theme-relevanten Dateien auf
einen Server
- `grunt` - Der Entwicklungs-Task der während der Entwicklung laufen sollte

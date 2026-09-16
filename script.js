// Position ouverte : cordes à vide + 3 premières cases
const NOTES_CHROMATIQUES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// Notes à vide de chaque corde, avec leur octave (en notation guitare : E3 = Mi grave)
const cordesOuvertes = [
  { corde: 6, note: "E", octave: 3 },
  { corde: 5, note: "A", octave: 3 },
  { corde: 4, note: "D", octave: 4 },
  { corde: 3, note: "G", octave: 4 },
  { corde: 2, note: "B", octave: 4 },
  { corde: 1, note: "E", octave: 5 },
];

const NOMBRE_DE_CASES = 7; // ← change à 5 si tu préfères commencer moins loin

// Calcule le nom et l'octave d'une note à partir de la corde à vide + un nombre de cases
function genererNotesGuitare(nombreDeCases) {
  const notes = [];

  cordesOuvertes.forEach(({ corde, note, octave }) => {
    const indexOuvert = NOTES_CHROMATIQUES.indexOf(note);

    for (let fret = 0; fret <= nombreDeCases; fret++) {
      const indexTotal = indexOuvert + fret;
      const indexNote = indexTotal % 12;
      const octaveFinal = octave + Math.floor(indexTotal / 12);

      const nom = NOTES_CHROMATIQUES[indexNote];
      const accidental = nom.includes("#") ? "#" : null;
      const cle = `${nom.toLowerCase()}/${octaveFinal}`;

      notes.push({ nom, corde, case: fret, cle, accidental });
    }
  });

  return notes;
}

const notesGuitare = genererNotesGuitare(NOMBRE_DE_CASES);

function noteAleatoire() {
  const index = Math.floor(Math.random() * notesGuitare.length);
  return notesGuitare[index];
}

function genererSequence(nombreDeNotes) {
  const sequence = [];
  let derniereNote = null;

  for (let i = 0; i < nombreDeNotes; i++) {
    let note;
    do {
      note = noteAleatoire();
    } while (note === derniereNote);

    sequence.push(note);
    derniereNote = note;
  }

  return sequence;
}

const maSequence = genererSequence(8);

function afficherPortee(sequence, indexActif) {
  const { Renderer, Stave, StaveNote, Voice, Formatter, Accidental } = Vex.Flow;

  const div = document.getElementById("portee");
  div.innerHTML = "";

  const renderer = new Renderer(div, Renderer.Backends.SVG);
  renderer.resize(500, 220);
  const context = renderer.getContext();

  const stave = new Stave(10, 20, 480);
  stave.addClef("treble").setContext(context).draw();

  const notesVex = sequence.map((note, i) => {
    const staveNote = new StaveNote({
      keys: [note.cle],
      duration: "q"
    });

    if (note.accidental) {
      staveNote.addModifier(new Accidental(note.accidental));
    }


	const notesVex = sequence.map((note, i) => {
  const staveNote = new StaveNote({
    keys: [note.cle],
    duration: "q"
  });

  if (note.accidental) {
    staveNote.addModifier(new Accidental(note.accidental));
  }

  console.log(`Note ${i} — indexActif reçu : ${indexActif} — correspond : ${i === indexActif}`);

  if (i === indexActif) {
    staveNote.setStyle({ fillStyle: "#e67e22", strokeStyle: "#e67e22" });
  }

  return staveNote;
	});

    if (i === indexActif) {
      staveNote.setStyle({ fillStyle: "#e67e22", strokeStyle: "#e67e22" });
    }

    return staveNote;
  });


  const voice = new Voice({ num_beats: notesVex.length, beat_value: 4 });
  voice.addTickables(notesVex);

  new Formatter().joinVoices([voice]).format([voice], 440);
  voice.draw(context, stave);
}

let indexCourant = 0;

function afficherEtatCourant() {
  document.getElementById("reponse").textContent = "";
  const numero = indexCourant + 1;
  console.log(`Note ${numero} sur ${maSequence.length}`);
}

function noteSuivante() {
  if (indexCourant < maSequence.length - 1) {
    indexCourant++;
  } else {
    const nouvelleSequence = genererSequence(8);
    maSequence.length = 0;
    maSequence.push(...nouvelleSequence);
    indexCourant = 0;
  }
  afficherEtatCourant();
  afficherPortee(maSequence, indexCourant);
}

function notePrecedente() {
  if (indexCourant > 0) {
    indexCourant--;
    afficherEtatCourant();
    afficherPortee(maSequence, indexCourant);
  }
  // si on est déjà sur la première note (index 0), on ne fait rien :
  // pas de séquence précédente à aller chercher
}

function revelerReponse() {
  const note = maSequence[indexCourant];
  document.getElementById("reponse").textContent = `Note : ${note.nom}`;
  dessinerManche(note);
}

document.getElementById("btn-suivant").addEventListener("click", noteSuivante);
document.getElementById("btn-reveler").addEventListener("click", revelerReponse);
document.getElementById("btn-precedent").addEventListener("click", notePrecedente);

// Affichage initial
function afficherEtatCourant() {
  document.getElementById("reponse").textContent = "";
  document.getElementById("manche").innerHTML = "";
  const numero = indexCourant + 1;
  console.log(`Note ${numero} sur ${maSequence.length}`);
}
afficherPortee(maSequence, indexCourant);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js")
      .then(() => console.log("Service worker enregistré"))
      .catch((err) => console.error("Échec de l'enregistrement :", err));
  });
}

function dessinerManche(note) {
  const div = document.getElementById("manche");

  const xOuvert = 25;
  const xSillet = 55;
  const largeurCase = 42;
  const largeurTotale = xSillet + NOMBRE_DE_CASES * largeurCase + 15;
  const hauteurTotale = 180;
  const yHaut = 20;
  const yBas = 160;

  const espaceCorde = (yBas - yHaut) / 5;

  function yPourCorde(corde) {
    const indexDepuisHaut = 6 - corde;
    return yHaut + indexDepuisHaut * espaceCorde;
  }

  function xPourCase(numeroCase) {
    if (numeroCase === 0) return xOuvert;
    return xSillet + (numeroCase - 0.5) * largeurCase;
  }

  let svg = `<svg viewBox="0 0 ${largeurTotale} ${hauteurTotale}" xmlns="http://www.w3.org/2000/svg">`;

  for (let corde = 1; corde <= 6; corde++) {
    const y = yPourCorde(corde);
    const epaisseur = corde >= 5 ? 2.5 : 1.5;
    svg += `<line x1="${xOuvert}" y1="${y}" x2="${xSillet + NOMBRE_DE_CASES * largeurCase}" y2="${y}" stroke="#333" stroke-width="${epaisseur}" />`;
  }

  svg += `<line x1="${xSillet}" y1="${yHaut}" x2="${xSillet}" y2="${yBas}" stroke="#000" stroke-width="6" />`;

  for (let f = 1; f <= NOMBRE_DE_CASES; f++) {
    const x = xSillet + f * largeurCase;
    svg += `<line x1="${x}" y1="${yHaut}" x2="${x}" y2="${yBas}" stroke="#888" stroke-width="2" />`;
    svg += `<text x="${x - largeurCase / 2}" y="${hauteurTotale - 2}" font-size="10" text-anchor="middle" fill="#666">${f}</text>`;
  }
  svg += `<text x="${xOuvert}" y="${hauteurTotale - 2}" font-size="10" text-anchor="middle" fill="#666">0</text>`;

  const x = xPourCase(note.case);
  const y = yPourCorde(note.corde);
  svg += `<circle cx="${x}" cy="${y}" r="11" fill="#e67e22" stroke="#000" stroke-width="1" />`;
  svg += `<text x="${x}" y="${y + 4}" font-size="11" text-anchor="middle" fill="white" font-family="sans-serif">${note.nom}</text>`;

  svg += `</svg>`;

  div.innerHTML = svg;
}

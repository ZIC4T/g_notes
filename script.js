// Position ouverte : cordes à vide + 3 premières cases
const notesGuitare = [
  { nom: "E",  corde: 6, case: 0, cle: "e/3",  accidental: null },
  { nom: "F",  corde: 6, case: 1, cle: "f/3",  accidental: null },
  { nom: "F#", corde: 6, case: 2, cle: "f#/3", accidental: "#" },
  { nom: "G",  corde: 6, case: 3, cle: "g/3",  accidental: null },

  { nom: "A",  corde: 5, case: 0, cle: "a/3",  accidental: null },
  { nom: "Bb", corde: 5, case: 1, cle: "bb/3", accidental: "b" },
  { nom: "B",  corde: 5, case: 2, cle: "b/3",  accidental: null },
  { nom: "C",  corde: 5, case: 3, cle: "c/4",  accidental: null },

  { nom: "D",  corde: 4, case: 0, cle: "d/4",  accidental: null },
  { nom: "D#", corde: 4, case: 1, cle: "d#/4", accidental: "#" },
  { nom: "E",  corde: 4, case: 2, cle: "e/4",  accidental: null },
  { nom: "F",  corde: 4, case: 3, cle: "f/4",  accidental: null },

  { nom: "G",  corde: 3, case: 0, cle: "g/4",  accidental: null },
  { nom: "G#", corde: 3, case: 1, cle: "g#/4", accidental: "#" },
  { nom: "A",  corde: 3, case: 2, cle: "a/4",  accidental: null },

  { nom: "B",  corde: 2, case: 0, cle: "b/4",  accidental: null },
  { nom: "C",  corde: 2, case: 1, cle: "c/5",  accidental: null },
  { nom: "C#", corde: 2, case: 2, cle: "c#/5", accidental: "#" },
  { nom: "D",  corde: 2, case: 3, cle: "d/5",  accidental: null },

  { nom: "E",  corde: 1, case: 0, cle: "e/5",  accidental: null },
  { nom: "F",  corde: 1, case: 1, cle: "f/5",  accidental: null },
  { nom: "F#", corde: 1, case: 2, cle: "f#/5", accidental: "#" },
  { nom: "G",  corde: 1, case: 3, cle: "g/5",  accidental: null },
];

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

  const largeurTotale = 360;
  const hauteurTotale = 180;
  const yHaut = 20;
  const yBas = 160;
  const xOuvert = 25;      // position des cordes à vide, avant le sillet
  const xSillet = 55;      // position du sillet (début du manche)
  const largeurCase = 95;  // largeur de chaque case après le sillet

  const espaceCorde = (yBas - yHaut) / 5; // 5 intervalles pour 6 cordes

  function yPourCorde(corde) {
    const indexDepuisHaut = 6 - corde; // corde 6 (grave) en haut, corde 1 (aigu) en bas
    return yHaut + indexDepuisHaut * espaceCorde;
  }

  function xPourCase(numeroCase) {
    if (numeroCase === 0) return xOuvert;
    return xSillet + (numeroCase - 0.5) * largeurCase;
  }

  let svg = `<svg viewBox="0 0 ${largeurTotale} ${hauteurTotale}" xmlns="http://www.w3.org/2000/svg">`;

  // Lignes des cordes
  for (let corde = 1; corde <= 6; corde++) {
    const y = yPourCorde(corde);
    const epaisseur = corde >= 5 ? 2.5 : 1.5; // cordes graves dessinées plus épaisses
    svg += `<line x1="${xOuvert}" y1="${y}" x2="${xSillet + 3 * largeurCase}" y2="${y}" stroke="#333" stroke-width="${epaisseur}" />`;
  }

  // Sillet (trait épais séparant "à vide" du manche)
  svg += `<line x1="${xSillet}" y1="${yHaut}" x2="${xSillet}" y2="${yBas}" stroke="#000" stroke-width="6" />`;

  // Frettes 1, 2, 3
  for (let f = 1; f <= 3; f++) {
    const x = xSillet + f * largeurCase;
    svg += `<line x1="${x}" y1="${yHaut}" x2="${x}" y2="${yBas}" stroke="#888" stroke-width="2" />`;
    svg += `<text x="${x - largeurCase / 2}" y="${hauteurTotale - 2}" font-size="10" text-anchor="middle" fill="#666">${f}</text>`;
  }
  svg += `<text x="${xOuvert}" y="${hauteurTotale - 2}" font-size="10" text-anchor="middle" fill="#666">à vide</text>`;

  // Point indiquant la position de la note à jouer
  const x = xPourCase(note.case);
  const y = yPourCorde(note.corde);
  svg += `<circle cx="${x}" cy="${y}" r="11" fill="#e67e22" stroke="#000" stroke-width="1" />`;
  svg += `<text x="${x}" y="${y + 4}" font-size="11" text-anchor="middle" fill="white" font-family="sans-serif">${note.nom}</text>`;

  svg += `</svg>`;

  div.innerHTML = svg;
}

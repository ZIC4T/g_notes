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
  renderer.resize(500, 150);
  const context = renderer.getContext();

  const stave = new Stave(10, 40, 480);
  stave.addClef("treble").setContext(context).draw();

  /*const notesVex = sequence.map((note, i) => {
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
	});*/

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

function revelerReponse() {
  const note = maSequence[indexCourant];
  document.getElementById("reponse").textContent =
    `Note : ${note.nom} — Corde ${note.corde}, Case ${note.case}`;
}

document.getElementById("btn-suivant").addEventListener("click", noteSuivante);
document.getElementById("btn-reveler").addEventListener("click", revelerReponse);

// Affichage initial
afficherEtatCourant();
afficherPortee(maSequence, indexCourant);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js")
      .then(() => console.log("Service worker enregistré"))
      .catch((err) => console.error("Échec de l'enregistrement :", err));
  });
}

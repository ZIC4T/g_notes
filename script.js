	// Position ouverte : cordes à vide + 3 premières cases
	// Corde 6 = E grave (Mi grave), Corde 1 = E aigu (Mi aigu)
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

	console.log("Nombre de notes disponibles :", notesGuitare.length);
	console.log(notesGuitare[0]);

	// Pioche une note au hasard dans le tableau
	function noteAleatoire() {
	const index = Math.floor(Math.random() * notesGuitare.length);
	return notesGuitare[index];
	}

	// Génère une séquence de N notes, en évitant les répétitions consécutives
	function genererSequence(nombreDeNotes) {
	const sequence = [];
	let derniereNote = null;

	for (let i = 0; i < nombreDeNotes; i++) {
		let note;
		do {
		note = noteAleatoire();
		} while (note === derniereNote); // relance le tirage si c'est la même note qu'avant

		sequence.push(note);
		derniereNote = note;
	}

	return sequence;
	}

	// Test : génère une séquence de 8 notes et affiche-la dans la console
	const maSequence = genererSequence(8);
	console.log(maSequence.map(n => n.nom));
	function afficherPortee(sequence) {
	const { Renderer, Stave, StaveNote, Voice, Formatter, Accidental } = Vex.Flow;

	const div = document.getElementById("portee");
	div.innerHTML = ""; // vide la portée précédente avant de redessiner

	const renderer = new Renderer(div, Renderer.Backends.SVG);
	renderer.resize(500, 150);
	const context = renderer.getContext();

	const stave = new Stave(10, 40, 480);
	stave.addClef("treble").setContext(context).draw();

	const notesVex = sequence.map(note => {
		const staveNote = new StaveNote({
		keys: [note.cle],
		duration: "q" // q = noire (quarter note), on garde simple pour l'instant
		});

		if (note.accidental) {
		staveNote.addModifier(new Accidental(note.accidental));
		}

		return staveNote;
	});

	const voice = new Voice({ num_beats: notesVex.length, beat_value: 4 });
	voice.addTickables(notesVex);

	new Formatter().joinVoices([voice]).format([voice], 440);
	voice.draw(context, stave);
	}

	afficherPortee(maSequence);
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
		// on relance une nouvelle séquence quand on arrive au bout
		const nouvelleSequence = genererSequence(8);
		maSequence.length = 0;
		maSequence.push(...nouvelleSequence);
		afficherPortee(maSequence);
		indexCourant = 0;
	}
	afficherEtatCourant();
	}

	function revelerReponse() {
	const note = maSequence[indexCourant];
	document.getElementById("reponse").textContent =
		`Note : ${note.nom} — Corde ${note.corde}, Case ${note.case}`;
	}

	document.getElementById("btn-suivant").addEventListener("click", noteSuivante);
	document.getElementById("btn-reveler").addEventListener("click", revelerReponse);

	afficherEtatCourant(); // initialise l'affichage au chargement
	if ("serviceWorker" in navigator) {
	window.addEventListener("load", () => {
		navigator.serviceWorker.register("./service-worker.js")
		.then(() => console.log("Service worker enregistré"))
		.catch((err) => console.error("Échec de l'enregistrement :", err));
	});
	}

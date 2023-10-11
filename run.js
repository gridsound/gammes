"use strict";

let notation = localStorage.getItem( "gammes-notation" ) || "doremi";
let majorMinor = localStorage.getItem( "gammes-majorMinor" ) || "major";
let diezeBemol = localStorage.getItem( "gammes-diezeBemol" ) || "♯";

document.body.prepend( ...GSUgetTemplate( "main", { notation, majorMinor, diezeBemol } ) );

const form = document.querySelector( "#form" );
const scalesGraph = document.querySelector( "#scalesGraph" );
const keys = document.querySelectorAll( ".key" );
const scales = {
	major: [ 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1 ],
	minor: [ 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0 ],
};
const notations = {
	"♯": {
		CDE:    [ "C",  "C♯",  "D",  "D♯",  "E",  "F",  "F♯",   "G",   "G♯",   "A",  "A♯",  "B" ],
		doremi: [ "Do", "Do♯", "Ré", "Ré♯", "Mi", "Fa", "Fa♯",  "Sol", "Sol♯", "La", "La♯", "Si" ],
	},
	"♭": {
		CDE:    [ "C",  "D♭",  "D",  "E♭",  "E",  "F",  "G♭",   "G",   "A♭",   "A",  "B♭",  "B" ],
		doremi: [ "Do", "Ré♭", "Ré", "Mi♭", "Mi", "Fa", "Sol♭", "Sol", "La♭",  "La", "Si♭", "Si" ],
	},
};
let gamme = 0;

scalesGraph.onclick = e => {
	const k = e.target.parentNode.dataset.key;

	if ( k ) {
		gamme = +k;
		scalesGraph.style.setProperty( "--gamme", gamme );
		activeKeys();
	}
};
form.onchange = e => {
	const val = e.target.value;

	switch ( e.target.name ) {
		case "majorMinor":
			localStorage.setItem( "gammes-majorMinor", val );
			majorMinor = val;
			scalesGraph.dataset.scaleM = val;
			activeKeys();
			break;
		case "notation":
			localStorage.setItem( "gammes-notation", val );
			notation = val;
			updateKeysName();
			break;
		case "diezeBemol":
			localStorage.setItem( "gammes-diezeBemol", val );
			diezeBemol = val;
			updateKeysName();
			break;
	}
};

function activeKeys() {
	const arr = scales[ majorMinor ];

	keys.forEach( ( el, i ) => {
		el.classList.toggle( "key-selected", i === gamme );
		el.classList.toggle( "key-active", !!arr[ ( 12 + i - gamme ) % 12 ] );
	} );
}
function updateKeysName() {
	const arr = notations[ diezeBemol ][ notation ];

	keys.forEach( ( el, i ) => {
		el.firstChild.textContent = arr[ i ];
	} );
}

activeKeys();
updateKeysName();

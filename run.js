"use strict";

let notation = localStorage.getItem( "gammes-notation" ) || "doremi";
let majorMinor = localStorage.getItem( "gammes-majorMinor" ) || "major";
let diezeBemol = localStorage.getItem( "gammes-diezeBemol" ) || "♯";

document.body.prepend(
	GSUcreateDiv( { id: "title" },
		GSUcreateSpan( null, "Gammes" ),
		GSUcreateSpan( null, "by GridSound" ),
	),
	GSUcreateDiv( { id: "form" },
		GSUcreateDiv( null,
			GSUcreateLabel( null, GSUcreateInput( { name: "majorMinor", type: "radio", value: "major", checked: majorMinor === "major" } ), GSUcreateSpan( null, "Major" ) ),
			GSUcreateLabel( null, GSUcreateInput( { name: "majorMinor", type: "radio", value: "minor", checked: majorMinor === "minor" } ), GSUcreateSpan( null, "Minor" ) ),
		),
		GSUcreateDiv( null,
			GSUcreateLabel( null, GSUcreateInput( { name: "notation", type: "radio", value: "doremi", checked: notation === "doremi" } ), GSUcreateSpan( null, "Do, Ré, Mi, ..." ) ),
			GSUcreateLabel( null, GSUcreateInput( { name: "notation", type: "radio", value: "CDE", checked: notation === "CDE" } ), GSUcreateSpan( null, "C, D, E, ..." ) ),
		),
		GSUcreateDiv( null,
			GSUcreateLabel( null, GSUcreateInput( { name: "diezeBemol", type: "radio", value: "♯", checked: diezeBemol === "♯" } ), GSUcreateSpan( null, "♯" ) ),
			GSUcreateLabel( null, GSUcreateInput( { name: "diezeBemol", type: "radio", value: "♭", checked: diezeBemol === "♭" } ), GSUcreateSpan( null, "♭" ) ),
		),
	),
	GSUcreateDiv( { id: "scalesGraph", "data-scale-m": majorMinor },
		GSUcreateDiv( { id: "scalesGraphPadding" },
			GSUcreateDiv( { id: "scalesGraphInn" },
				GSUcreateDiv( { id: "circle-ext" } ),
				GSUcreateDiv( { id: "svg-wrap" },
					GSUcreateElementSVG( "svg", { id: "svg", viewBox: "0 0 100 100" },
						GSUcreateElementSVG( "polyline", { id: "polyMajor", points: "50,0 93,25 93,75 75,93 25,93 0,50 25,7" } ),
						GSUcreateElementSVG( "polyline", { id: "polyMinor", points: "50,0 93,25 100,50 75,93 25,93 7,75 7,25" } ),
					)
				),
				GSUcreateDiv( { id: "keys" },
					GSUcreateDiv( { class: "key", style: "--keyInd:  0", "data-key": 0 }, GSUcreateSpan()),
					GSUcreateDiv( { class: "key", style: "--keyInd:  1", "data-key": 1 }, GSUcreateSpan()),
					GSUcreateDiv( { class: "key", style: "--keyInd:  2", "data-key": 2 }, GSUcreateSpan()),
					GSUcreateDiv( { class: "key", style: "--keyInd:  3", "data-key": 3 }, GSUcreateSpan()),
					GSUcreateDiv( { class: "key", style: "--keyInd:  4", "data-key": 4 }, GSUcreateSpan()),
					GSUcreateDiv( { class: "key", style: "--keyInd:  5", "data-key": 5 }, GSUcreateSpan()),
					GSUcreateDiv( { class: "key", style: "--keyInd:  6", "data-key": 6 }, GSUcreateSpan()),
					GSUcreateDiv( { class: "key", style: "--keyInd:  7", "data-key": 7 }, GSUcreateSpan()),
					GSUcreateDiv( { class: "key", style: "--keyInd:  8", "data-key": 8 }, GSUcreateSpan()),
					GSUcreateDiv( { class: "key", style: "--keyInd:  9", "data-key": 9 }, GSUcreateSpan()),
					GSUcreateDiv( { class: "key", style: "--keyInd: 10", "data-key": 10 }, GSUcreateSpan()),
					GSUcreateDiv( { class: "key", style: "--keyInd: 11", "data-key": 11 }, GSUcreateSpan()),
				)
			),
		),
	),
	GSUcreateElement( "div", { id: "foot" },
		GSUcreateElement( "span", { id: "copyright" },
			"© 2023 ",
			GSUcreateElement( "a", { href: "https://gridsound.com" }, "gridsound.com" ),
			" all rights reserved",
		),
	),
);

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

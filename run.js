"use strict";

document.body.prepend(
	GSUcreateDiv( { id: "title" },
		GSUcreateSpan( null, "Gammes" ),
		GSUcreateSpan( null, "by GridSound" ),
	),
	GSUcreateDiv( { id: "form" },
		GSUcreateDiv( null,
			GSUcreateLabel( null, GSUcreateInput( { name: "majorMinor", type: "radio", value: "major", checked: true } ), GSUcreateSpan( null, "Major" ) ),
			GSUcreateLabel( null, GSUcreateInput( { name: "majorMinor", type: "radio", value: "minor" } ), GSUcreateSpan( null, "Minor" ) ),
		),
		GSUcreateDiv( null,
			GSUcreateLabel( null, GSUcreateInput( { name: "notation", type: "radio", value: "doremi", checked: true } ), GSUcreateSpan( null, "Do, Ré, Mi, ..." ) ),
			GSUcreateLabel( null, GSUcreateInput( { name: "notation", type: "radio", value: "CDE" } ), GSUcreateSpan( null, "C, D, E, ..." ) ),
		),
		GSUcreateDiv( null,
			GSUcreateLabel( null, GSUcreateInput( { name: "diezeBemol", type: "radio", value: "♯", checked: true } ), GSUcreateSpan( null, "♯" ) ),
			GSUcreateLabel( null, GSUcreateInput( { name: "diezeBemol", type: "radio", value: "♭" } ), GSUcreateSpan( null, "♭" ) ),
		),
	),
	GSUcreateDiv( { id: "scalesGraph", "data-scale-m": "major" },
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
const notationDieze = {
	CDE:    [ "C",  "C♯",  "D",  "D♯",  "E",  "F",  "F♯",   "G",   "G♯",   "A",  "A♯",  "B" ],
	doremi: [ "Do", "Do♯", "Ré", "Ré♯", "Mi", "Fa", "Fa♯",  "Sol", "Sol♯", "La", "La♯", "Si" ],
};
const notationBemol = {
	CDE:    [ "C",  "D♭",  "D",  "E♭",  "E",  "F",  "G♭",   "G",   "A♭",   "A",  "B♭",  "B" ],
	doremi: [ "Do", "Ré♭", "Ré", "Mi♭", "Mi", "Fa", "Sol♭", "Sol", "La♭",  "La", "Si♭", "Si" ],
};
let gamme = 0;
let notation = "doremi";
let useDieze = true;

scalesGraph.onclick = e => {
	const k = e.target.parentNode.dataset.key;

	if ( k ) {
		gamme = +k;
		scalesGraph.style.setProperty( "--gamme", gamme );
		activeKeys();
	}
};
form.onchange = e => {
	switch ( e.target.name ) {
		case "majorMinor":
			scalesGraph.dataset.scaleM = e.target.value;
			activeKeys();
			break;
		case "notation":
			notation = e.target.value;
			updateKeysName();
			break;
		case "diezeBemol":
			useDieze = e.target.value === "♯";
			updateKeysName();
			break;
	}
};

function activeKeys() {
	const arr = scales[ scalesGraph.dataset.scaleM ];

	keys.forEach( ( el, i ) => {
		el.classList.toggle( "key-selected", i === gamme );
		el.classList.toggle( "key-active", !!arr[ ( 12 + i - gamme ) % 12 ] );
	} );
}
function updateKeysName() {
	const arr = useDieze ? notationDieze : notationBemol;
	const arr2 = arr[ notation ];

	keys.forEach( ( el, i ) => {
		el.firstChild.textContent = arr2[ i ];
	} );
}

activeKeys();
updateKeysName();

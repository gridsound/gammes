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
const notation = {
	CDE:    [ "C",  "C♯",  "D",  "D♯",  "E",  "F",  "F♯",  "G",   "G♯",   "A",  "A♯",  "B" ],
	doremi: [ "Do", "Do♯", "Re", "Re♯", "Mi", "Fa", "Fa♯", "Sol", "Sol♯", "La", "La♯", "Si" ],
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
	if ( e.target.name === "majorMinor" ) {
		scalesGraph.dataset.scaleM = e.target.value;
		activeKeys();
	}
	if ( e.target.name === "notation" ) {
		setNotation( notation[ e.target.value ] );
	}
};

function activeKeys() {
	const arr = scales[ scalesGraph.dataset.scaleM ];

	keys.forEach( ( el, i ) => {
		el.classList.toggle( "key-selected", i === gamme );
		el.classList.toggle( "key-active", !!arr[ ( 12 + i - gamme ) % 12 ] );
	} );
}
function setNotation( notation ) {
	keys.forEach( ( el, i ) => {
		el.firstChild.textContent = notation[ i ];
	} );
}

activeKeys();
setNotation( notation.doremi );

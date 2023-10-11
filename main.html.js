"use strict";

GSUsetTemplate( "main", o => [
	GSUcreateDiv( { id: "title" },
		GSUcreateSpan( null, "Gammes" ),
		GSUcreateSpan( null, "by GridSound" ),
	),
	GSUcreateDiv( { id: "form" },
		GSUcreateDiv( null,
			GSUcreateLabel( null, GSUcreateInput( { name: "majorMinor", type: "radio", value: "major", checked: o.majorMinor === "major" } ), GSUcreateSpan( null, "Major" ) ),
			GSUcreateLabel( null, GSUcreateInput( { name: "majorMinor", type: "radio", value: "minor", checked: o.majorMinor === "minor" } ), GSUcreateSpan( null, "Minor" ) ),
		),
		GSUcreateDiv( null,
			GSUcreateLabel( null, GSUcreateInput( { name: "notation", type: "radio", value: "doremi", checked: o.notation === "doremi" } ), GSUcreateSpan( null, "Do, Ré, Mi, ..." ) ),
			GSUcreateLabel( null, GSUcreateInput( { name: "notation", type: "radio", value: "CDE", checked: o.notation === "CDE" } ), GSUcreateSpan( null, "C, D, E, ..." ) ),
		),
		GSUcreateDiv( null,
			GSUcreateLabel( null, GSUcreateInput( { name: "diezeBemol", type: "radio", value: "♯", checked: o.diezeBemol === "♯" } ), GSUcreateSpan( null, "♯" ) ),
			GSUcreateLabel( null, GSUcreateInput( { name: "diezeBemol", type: "radio", value: "♭", checked: o.diezeBemol === "♭" } ), GSUcreateSpan( null, "♭" ) ),
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
] );
"use strict";

let notation = localStorage.getItem( "gammes-notation" ) || "doremi";
let majorMinor = localStorage.getItem( "gammes-majorMinor" ) || "major";
let diezeBemol = localStorage.getItem( "gammes-diezeBemol" ) || "♯";

$body.$prepend( ...GSUgetTemplate( "main", { notation, majorMinor, diezeBemol } ) );

const form = $( "#form" );
const playBtn = $( "#playBtn" );
const scalesGraph = $( "#scalesGraph" );
const keys = $( ".key" );
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
let ctx;
let bufKeys;
let timeoutIdStop;
const timeoutIdKeys = [];
const absnMap = new Map();

const keysMap = createKeysMap( {
	60: 8,
	61: 8,
	62: 8,
	63: 8,
	64: 8,
	65: 8,
	66: 8,
	67: 8,
	68: 8,
	69: 8,
	70: 8,
	71: 8,
	72: 6,
	73: 6,
	74: 6,
	75: 6,
	76: 6,
	77: 6,
	78: 5,
	79: 5,
	80: 5,
	81: 5,
	82: 5,
	83: 5,
} );

scalesGraph.$onclick( e => {
	const k = e.target.parentNode.dataset.key;

	if ( k ) {
		stop();
		gamme = +k;
		scalesGraph.$css( "--gamme", gamme );
		activeKeys();
	}
} );
form.$onchange( e => {
	const val = e.target.value;

	switch ( e.target.name ) {
		case "majorMinor":
			stop();
			localStorage.setItem( "gammes-majorMinor", val );
			majorMinor = val;
			scalesGraph.$setAttr( "data-scale-m", val );
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
} );

function loadSample( url ) {
	return fetch( url )
		.then( res => res.arrayBuffer() )
		.then( arr => ctx.decodeAudioData( arr ) );
}

playBtn.$onclick( () => {
	if ( !ctx ) {
		ctx = GSUaudioContext();
		$body.$addClass( "loading" );
		playBtn.$setAttr( "data-spin", "on" );
	}

	if ( playBtn.$getAttr( "data-icon" ) === "pause" ) {
		stop();
	} else {
		if ( bufKeys ) {
			playBtn.$setAttr( "data-icon", "pause" );
		}
		( bufKeys
			? Promise.resolve()
			: Promise.all( [
				loadSample( "samples/🎹/60-71.96k.mp3" ),
				loadSample( "samples/🎹/72-83.96k.mp3" ),
			] ).then( bufs => {
				bufKeys = GSUaudioBuffer( ctx, 2, bufs[ 0 ].length + bufs[ 1 ].length, ctx.sampleRate );
				for ( let i = 0; i < 2; ++i ) {
					bufKeys.copyToChannel( new Float32Array( [
						...bufs[ 0 ].getChannelData( i ),
						...bufs[ 1 ].getChannelData( i ),
					] ), i );
				}
				$body.$rmClass( "loading" );
				playBtn.$rmAttr( "data-spin" ).$setAttr( "data-icon", "pause" );
			} )
		).then( () => {
			const scale = scales[ majorMinor ];
			const midi = [];

			scale.forEach( ( n, i ) => n && midi.push( 60 + i + gamme ) );
			midi.push( 60 + gamme + 12 );
			midi.forEach( ( m, i ) => {
				startKey( m, i * .5 );
				timeoutIdKeys.push( GSUsetTimeout( () => {
					scalesGraph.$setAttr( "data-key", m % 12 );
				}, i * .5 ) );
			} );
			timeoutIdStop = GSUsetTimeout( () => stop( false ), 8 * .5 + 1 );
		} );
	}
} );

function stop( bufStop ) {
	if ( playBtn.$getAttr( "data-icon" ) === "pause" ) {
		GSUclearTimeout( timeoutIdStop );
		scalesGraph.$rmAttr( "data-key" );
		timeoutIdKeys.forEach( t => GSUclearTimeout( t ) );
		timeoutIdKeys.length = 0;
		if ( bufStop !== false ) {
			absnMap.forEach( absn => absn[ 0 ].stop() );
		}
		absnMap.clear();
		playBtn.$setAttr( "data-icon", "play" );
	}
}

function activeKeys() {
	const arr = scales[ majorMinor ];

	keys.$each( ( el, i ) => {
		$( el )
			.$togClass( "key-selected", i === gamme )
			.$togClass( "key-active", !!arr[ ( 12 + i - gamme ) % 12 ] );
	} );
}
function updateKeysName() {
	const arr = notations[ diezeBemol ][ notation ];

	keys.$each( ( el, i ) => {
		el.firstChild.textContent = arr[ i ];
	} );
}

function createKeysMap( durs ) {
	const durs2 = { ...durs };

	for ( let k in durs2 ) {
		durs2[ k ] = [ 0, durs2[ k ], 0 ];
	}

	const keys = Object.keys( durs2 ).sort( ( a, b ) => a - b );

	keys.forEach( ( k, i ) => {
		const p = durs2[ keys[ i - 1 ] ];

		if ( p ) {
			durs2[ k ][ 0 ] = p[ 0 ] + p[ 1 ];
		}
	} );

	const durs3 = { ...durs2 };

	for ( let k = 21; k < 108; ++k ) {
		if ( !durs2[ k ] ) {
			const closestMidi = getClosestKey( durs2, k );
			const nkey = [ ...durs2[ closestMidi ] ];

			nkey[ 2 ] = k - closestMidi;
			durs3[ k ] = nkey;
		}
	}
	return durs3;
}

function getClosestKey( map, midi ) {
	for ( let i = 0; i < 88; ++i ) {
		if ( map[ midi + i ] ) {
			return midi + i;
		}
		if ( map[ midi - i ] ) {
			return midi - i;
		}
	}
}

function startKey( midi, when ) {
	const [ bufOff, bufDur, change ] = keysMap[ midi ];
	const vel = Math.max( .25, Math.min( 1 / .85, 1 ) );
	const absn = GSUaudioBufferSource( ctx );
	const gain = GSUaudioGain( ctx );
	const lowp = GSUaudioBiquadFilter( ctx );
	const freq = 440 * 2 ** ( ( ( midi + change ) - 69 ) / 12 );
	const filt = ( freq + 5000 * GSUmathEaseInCirc( vel ) ) / ( 1 / vel );

	absn.buffer = bufKeys;
	lowp.type = "lowpass";
	GSUaudioParamSet( lowp.Q, 0 );
	GSUaudioParamSet( lowp.frequency, filt );
	GSUaudioParamSet( gain.gain, vel );
	if ( change ) {
		absn.playbackRate.value = 1 * ( 2 ** ( change / 12 ) );
	}
	absn.connect( lowp );
	lowp.connect( gain );
	gain.connect( ctx.destination );
	absn.start( ctx.currentTime + when, bufOff, bufDur );
	absnMap.set( midi, [ absn, gain, lowp, vel ] );
}

activeKeys();
updateKeysName();

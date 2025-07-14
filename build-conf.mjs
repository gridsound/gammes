export default {
	title:         "Gammes by GridSound",
	desc:          "Musical scales cheatsheet",
	favicon:       "assets/favicon.png",
	url:           "https://gammes.gridsound.com/",
	ogImage:       "https://gammes.gridsound.com/cover.png",
	ogImageW:      1090,
	ogImageH:       898,
	serviceWorker: "serviceWorker.js",
	manifest:      "manifest.json",
	// .........................................................................
	cssSrcA: [
		"assets/fonts/fonts.css",
	],
	cssSrcB: [
		"style.css",
	],
	jsSrcB: [
		"main.html.js",
		"run.js",
	],
	// .........................................................................
	cssDep: [
		"gs-ui-components/gsuiIcon/gsuiIcon.css",
	],
	// .........................................................................
	jsDep: [
		"gs-utils/gs-utils.js",
		"gs-utils/gs-utils-dom.js",
		"gs-utils/gs-utils-math.js",
		"gs-utils/gs-utils-func.js",
		"gs-utils/gs-utils-checkType.dev.js",
		"gs-utils/gs-utils-audio-nodes.dev.js",
	],
};

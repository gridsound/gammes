#!/bin/bash

writeHeader() {
	echo '<!DOCTYPE html>'
	echo '<html lang="en">'
	echo '<head>'
	echo '<title>Gammes by GridSound</title>'
	echo '<meta charset="utf-8"/>'
	echo '<meta name="viewport" content="width=device-width"/>'
	echo '<meta name="description" content="Musical scales cheatsheet"/>'
	echo '<meta name="google" content="notranslate"/>'
	echo '<meta property="og:type" content="website"/>'
	echo '<meta property="og:title" content="Gammes by GridSound"/>'
	echo '<meta property="og:url" content="https://gammes.gridsound.com"/>'
	echo '<meta property="og:image" content="https://gammes.gridsound.com/cover.png"/>'
	echo '<meta property="og:image:width" content="1090"/>'
	echo '<meta property="og:image:height" content="898"/>'
	echo '<meta property="og:description" content="Musical scales cheatsheet"/>'
	echo '<link rel="manifest" href="manifest.json"/>'
	echo '<link rel="shortcut icon" href="assets/favicon.png"/>'
}
writeBody() {
	echo '</head>'
	echo '<body>'
	echo '<noscript>GridSound needs JavaScript to run</noscript>'
}
writeEnd() {
	echo '</body>'
	echo '</html>'
}
writeCSS() {
	printf '<link rel="stylesheet" href="%s"/>\n' "${CSSfiles[@]}"
}
writeJS() {
	printf '<script src="%s"></script>\n' "${JSfiles[@]}"
}
writeCSScompress() {
	echo -n '' > allCSS.css
	cat "${CSSfiles[@]}" >> allCSS.css
	echo '<style>'
	csso allCSS.css
	echo '</style>'
	rm allCSS.css
}
writeJScompress() {
	echo '"use strict";' > allJS.js
	cat "${JSfilesProd[@]}" >> allJS.js
	cat "${JSfiles[@]}" >> allJS.js
	echo '<script>'
	terser allJS.js --compress --mangle --toplevel --mangle-props "regex='^[$]'"
	echo '</script>'
	rm allJS.js
}

declare -a CSSfiles=(
	"assets/fonts/fonts.css"
	"style.css"
)

declare -a JSfilesProd=(
	"initServiceWorker.js"
)

declare -a JSfiles=(
	"gs-utils/gs-utils-dom.js"
	"main.html.js"
	"run.js"
)

buildDev() {
	filename='index.html'
	echo "Build $filename"
	writeHeader > $filename
	writeCSS >> $filename
	writeBody >> $filename
	echo '<script>function lg( a ) { return console.log.apply( console, arguments ), a; }</script>' >> $filename
	writeJS >> $filename
	writeEnd >> $filename
}

buildProd() {
	filename='index-prod.html'
	echo "Build $filename"
	writeHeader > $filename
	writeCSScompress >> $filename
	writeBody >> $filename
	echo '<script>function lg( a ) { return a; }</script>' >> $filename
	writeJScompress >> $filename
	writeEnd >> $filename
}

lint() {
	stylelint "${CSSfiles[@]}"
	echo '"use strict";' > __lintMain.js
	cat "${JSfilesProd[@]}" | grep -v '"use strict";' >> __lintMain.js
	cat "${JSfiles[@]}" | grep -v '"use strict";' >> __lintMain.js
	eslint __lintMain.js && rm __lintMain.js
}

updateDep() {
	git submodule init
	git submodule update --remote
}

if [ $# = 0 ]; then
	echo '          --------------------------------'
	echo '        .:: GridSound build shell-script ::.'
	echo '        ------------------------------------'
	echo ''
	echo './build.sh dev ---> create "index.html" for development'
	echo './build.sh prod --> create "index-prod.html" for production'
	echo './build.sh lint --> launch the JS/CSS linters (ESLint and Stylelint)'
	echo './build.sh dep ---> update all the submodules'
elif [ $1 = "dep" ]; then
	updateDep
elif [ $1 = "dev" ]; then
	buildDev
elif [ $1 = "prod" ]; then
	buildProd
elif [ $1 = "lint" ]; then
	lint
fi

PATH	:= node_modules/.bin:$(PATH)
SHELL := /bin/bash

#sass_dir := public/scss
compiled_js_dir := public/dist/js
deps_js_dir := public/dist/js
js_files := app/**/*.js

# >>>>>>> Miscellaneous
.PHONY: js-prod concat-dep clean-js

# Clean js
clean-js:
	@echo ">>> clean js"
	@rm -rf public/dist/js
	@rm -rf public/dist/js.pub

# Clean css
clean-css:
	@echo ">>> clean css"
	@rm -rf public/dist/css

clean-views:
	@echo ">>> clean views.pub"
	@rm -rf views.pub

clean-images:
	@echo ">>> clean images"
	@rm -rf public/dist/images

# Clean
clean: clean-js clean-css clean-views clean-images

# Other targets rely on this dir being created
distdir:
	@mkdir -p public/dist/{js,css,js.pub}

# Deploy `develop` branch to server
deploy:
	@mina deploy

# Eslint js files
lint: $(js_files)
	@eslint $?

# >>>>>> JS Related

public/dist/js/bundle.js: distdir
	browserify -d -x events -x socketcluster-client -x debug -x classnames client -o $@

public/dist/js/vendor.js: distdir
	bower install
	cp bower_components/react/react.js $(compiled_js_dir)/react.js
	cp bower_components/react-router/build/global/ReactRouter.js $(compiled_js_dir)/ReactRouter.js
	cp bower_components/lodash/lodash.js $(compiled_js_dir)/lodash.js
	cp bower_components/debug/debug.js $(compiled_js_dir)/debug.js
	cp bower_components/reflux/dist/reflux.js $(compiled_js_dir)/reflux.js
	cp bower_components/axios/dist/axios.js $(compiled_js_dir)/axios.js
	cp bower_components/object-assign/index.js $(compiled_js_dir)/object-assign.js
	cp bower_components/kefir/dist/kefir.js $(compiled_js_dir)/kefir.js
	cp bower_components/jquery/dist/jquery.js $(compiled_js_dir)/jquery.js
	cp bower_components/peity/jquery.peity.js $(compiled_js_dir)/jquery.peity.js
	cp bower_components/d3/d3.js $(compiled_js_dir)/d3.js
	cp bower_components/nvd3-community/build/nv.d3.js $(compiled_js_dir)/nv.d3.js
	cp bower_components/echarts/build/dist/echarts-all.js $(compiled_js_dir)/echarts-all.js
	browserify -d -r socketcluster-client -r events -r debug -r classnames  -r object-assign -o $(compiled_js_dir)/vendor.js

# Build all js
js: $(compiled_js_dir)/vendor.js $(compiled_js_dir)/bundle.js
	@echo '>>> Make development javascript files'

public/dist/js/bundle.prod.js: distdir
	@browserify -x events -x socketcluster-client -x debug -x classnames client -o $@

public/dist/js/vendor.prod.js: distdir
	@browserify -r events -r socketcluster-client -r debug -r classnames -r object-assign -o $@

copy_deps: distdir
	@bower install
	@cp bower_components/react/react.min.js $(deps_js_dir)/react.min.js
	@cp bower_components/react-router/build/global/ReactRouter.min.js $(deps_js_dir)/ReactRouter.min.js
	@cp bower_components/lodash/lodash.min.js $(deps_js_dir)/lodash.min.js
	@cp bower_components/debug/debug-min.js $(deps_js_dir)/debug.min.js
	@cp bower_components/axios/dist/axios.min.js $(deps_js_dir)/axios.min.js
	@cp bower_components/reflux/dist/reflux.min.js $(deps_js_dir)/reflux.min.js
	@cp bower_components/kefir/dist/kefir.min.js $(deps_js_dir)/kefir.min.js
	@cp bower_components/object-assign/index.js $(deps_js_dir)/object-assign.js
	@cp bower_components/jquery/dist/jquery.min.js $(deps_js_dir)/jquery.min.js
	@cp bower_components/peity/jquery.peity.min.js $(deps_js_dir)/jquery.peity.min.js
	@cp bower_components/d3/d3.min.js $(deps_js_dir)/d3.min.js
	@cp bower_components/nvd3-community/build/nv.d3.min.js $(deps_js_dir)/nv.d3.min.js
	@cp bower_components/nvd3-community/build/nv.d3.min.css public/dist/css/.
	@cp bower_components/echarts/build/dist/echarts-all.js $(deps_js_dir)/echarts-all.js

# [Production] Uglify to bundle.min.js, vendor.min.js
js-prod-uglify: $(compiled_js_dir)/bundle.prod.js $(compiled_js_dir)/vendor.prod.js
	@echo ">>> [Production] minified vendor.js"
	@uglifyjs --screw-ie8 $(compiled_js_dir)/vendor.prod.js -o $(compiled_js_dir)/vendor.min.js
	@echo ">>> [Production] minified bundle.js"
	@uglifyjs --screw-ie8 $(compiled_js_dir)/bundle.prod.js -o $(compiled_js_dir)/bundle.min.js
	@rm $(compiled_js_dir)/vendor.prod.js
	@rm $(compiled_js_dir)/bundle.prod.js


# [Production] Make javascript files
js-prod: clean-js js-prod-uglify copy_deps
	@echo '>>> [Production] JS'

# >>>>>>> CSS Related

# [Devleopment] Build all css
css: clean-css distdir
	@echo '>>> make css'
	@gulp css

# [Production]
css-prod:
	@echo '>>> [Production] CSS'
	@NODE_ENV=production gulp

prod: clean css-prod js-prod
	@echo '>>> [Prodction] Done!'
jshint:
	@./node_modules/jshint/bin/hint client/scripts/main.js client/scripts/eic
	@./node_modules/jshint/bin/hint server

.PHONY: jshint

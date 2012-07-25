jshint:
	@./node_modules/jshint/bin/hint client/scripts/*.js client/scripts/eic
	@./node_modules/jshint/bin/hint server

.PHONY: jshint

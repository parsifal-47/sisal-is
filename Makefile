setup:
	npm install

rebuild:
	node rebuild

repl: run

run:
	node si

test:
	@./node_modules/buster/bin/buster-test

.PHONY: test setup rebuild repl run

setup:
	npm install

rebuild:
	node rebuild

repl: run

run:
	node si

lint:
	@./node_modules/tslint/bin/tslint -c tslint.json 'src/**/*.ts'

test:
	@./node_modules/buster/bin/buster-test

.PHONY: test setup rebuild repl run

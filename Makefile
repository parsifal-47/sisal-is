setup:
	npm install

compile:
	tsc

lint:
	@./node_modules/tslint/bin/tslint -c tslint.json 'src/**/*.ts'

test: setup compile
	@./node_modules/buster/bin/buster-test

.PHONY: test setup compile lint

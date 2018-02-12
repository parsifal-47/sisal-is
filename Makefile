setup:
	npm install

compile:
	tsc

lint:
	@./node_modules/tslint/bin/tslint -c tslint.json 'src/**/*.ts'

test:
	npm test

.PHONY: test setup compile lint

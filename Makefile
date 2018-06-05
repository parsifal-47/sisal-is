setup:
	npm install

setup-dev:
	npm install --only=dev

compile:
	tsc

lint:
	@./node_modules/tslint/bin/tslint -c tslint.json 'src/**/*.ts'

test:
	npm test

.PHONY: test setup setup-dev compile lint

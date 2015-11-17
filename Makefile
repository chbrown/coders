BIN := node_modules/.bin

all: base64.js index.js

$(BIN)/tsc $(BIN)/mocha:
	npm install

%.js: %.ts $(BIN)/tsc
	$(BIN)/tsc

test: $(JAVASCRIPT) $(BIN)/mocha
	$(BIN)/mocha --compilers js:babel-core/register tests/

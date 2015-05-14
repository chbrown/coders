SOURCES := base64.ts

all: index.js coders.d.ts

index.js coders.d.ts: $(SOURCES) | node_modules/.bin/tsc-declare
	node_modules/.bin/tsc-declare -n coders -f tsc-declare.json

clean:
	rm -f $(SOURCES:%.ts=%.js) $(SOURCES:%.ts=%.d.ts)

# for testing:

node_modules/.bin/tsc node_modules/.bin/mocha node_modules/.bin/tsc-declare:
	npm install

DTS := mocha/mocha node/node

%.js: %.ts type_declarations | node_modules/.bin/tsc
	node_modules/.bin/tsc -m commonjs -t ES5 $<

type_declarations: $(DTS:%=type_declarations/DefinitelyTyped/%.d.ts)

type_declarations/DefinitelyTyped/%:
	mkdir -p $(@D)
	curl -s https://raw.githubusercontent.com/chbrown/DefinitelyTyped/master/$* > $@

.PHONY: test
test: test/base64.js | node_modules/.bin/mocha
	node_modules/.bin/mocha test/

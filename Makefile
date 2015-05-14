SOURCES := base64.ts

all: index.js coders.d.ts

index.js coders.d.ts: $(SOURCES) | node_modules/.bin/tsc-declare
	node_modules/.bin/tsc-declare -n coders -f tsc-declare.json

node_modules/.bin/tsc-declare:
	npm install

clean:
	rm -f $(SOURCES:%.ts=%.js) $(SOURCES:%.ts=%.d.ts)

.PHONY: clean
clean:
	@rm -rf dist playwright-report test-results

.PHONY: build
build:
	@npx vite build

.PHONY: dev
dev:
	@npx vite

.PHONY: test-e2e
test-e2e:
	@npx playwright test

.PHONY: cors-proxy
cors-proxy:
	npx local-cors-proxy --proxyUrl http://api.football-data.org --proxyPartial ''

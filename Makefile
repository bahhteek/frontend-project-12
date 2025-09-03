build:
	npm run build

start:
	npm run start

front:
	npm --prefix frontend run dev

lint:
	npm --prefix frontend run lint

install:
	npm ci
	cd frontend && npm ci
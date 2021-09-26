clean:
	docker-compose -f ./docker-compose_ms.yml rm -f

rm: 
	sudo rm -Rf ~/mongo_data
	sudo rm -Rf ~/sharelatex_data/

build:
	docker-compose -f ./docker-compose_ms.yml build

deploy:
	docker-compose -f ./docker-compose_ms.yml up
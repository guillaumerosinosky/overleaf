clean:
	docker-compose -f ./docker-compose_ms.yml rm -f

rm: 
	sudo rm -Rf ~/mongo_data
	sudo rm -Rf ~/sharelatex_data/
	docker-compose -f ./docker-compose_ms.yml rm -f

build:
	MONOREPO_REVISION=$(git rev-parse HEAD)
	docker-compose -f ./docker-compose_ms.yml build --build-arg MONOREPO_REVISION

deploy:
	docker-compose -f ./docker-compose_ms.yml up

create-default-users:
	docker exec overleaf_web_1 /bin/bash -c "cd /var/www/sharelatex; grunt user:create-admin --email=joe@example.com --password=password"
	docker exec overleaf_web_1 /bin/bash -c "cd /var/www/sharelatex; grunt user:create-admin --email=bob@example.com --password=password"
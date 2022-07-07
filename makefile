compose_file = ./srcs/docker-compose.yml

Env_flag = ./environnement/*.env

all: up

up:
	docker-compose -f $(compose_file) --env-file $(Env_flag) up -d --build

build: 
	docker-compose -f $(compose_file) --env-file $(Env_flag) build

stop:
	docker-compose -f $(compose_file) --env-file $(Env_flag) stop

down:
	docker-compose -f $(compose_file) --env-file $(Env_flag) down

images:
	docker images

clean: down
	docker container prune

fclean: clean
	docker rmi pgadmin
	docker rmi postgres
	docker rmi backend
	docker rmi node:16
	docker volume rm pgadmin
	docker volume rm postgres

re: fclean all

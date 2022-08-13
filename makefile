# ---------------------------------------------------------------------------- #
#                               ft_transcendence                               #
# ---------------------------------------------------------------------------- #

compose_file = ./docker-compose.yml

Env_flag = ./environnement/dev.env

all: up

restart: down up ps

up:
	docker-compose -f $(compose_file) --env-file $(Env_flag) up -d --build

build: 
	docker-compose -f $(compose_file) --env-file $(Env_flag) build

stop:
	docker-compose -f $(compose_file) --env-file $(Env_flag) stop

down:
	docker-compose -f $(compose_file) --env-file $(Env_flag) down
	
ps:
	docker-compose -f $(compose_file) --env-file $(Env_flag) ps

logs:
	docker ps -q -a | xargs -L 1 docker logs

images:
	docker images

clean: down
	docker container prune

fclean: clean
	bash clean.sh

re: fclean all

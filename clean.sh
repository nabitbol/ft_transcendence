#!/bin/zsh

RESET="\033[0m"
BLACK="\033[30m"
RED="\033[31m"
GREEN="\033[32m"
YELLOW="\033[33m"
BLUE="\033[34m"
MAGENTA="\033[35m"
CYAN="\033[36m"
WHITE="\033[37m"

BOLDBLACK="\033[1m\033[30m"
BOLDRED="\033[1m\033[31m"
BOLDGREEN="\033[1m\033[32m"
BOLDYELLOW="\033[1m\033[33m"
BOLDBLUE="\033[1m\033[34m"
BOLDMAGENTA="\033[1m\033[35m"
BOLDCYAN="\033[1m\033[36m"
BOLDWHITE="\033[1m\033[37m"

printf $CYAN"Delete pgadmin image...$RESET\n"
docker rmi pgadmin 2>&1 >/dev/null
printf $BOLDGREEN"Delete postgres image...$RESET\n"
docker rmi postgres 2>&1 >/dev/null
printf $BOLDYELLOW"Delete frontend image...$RESET\n"
docker rmi frontend 2>&1 >/dev/null
printf $BOLDRED"Delete backend image...$RESET\n"
docker rmi backend 2>&1 >/dev/null
printf $BOLDYELLOW"Delete node:16 image...$RESET\n"
docker rmi node:16 2>&1 >/dev/null
printf $BOLDCYAN"Delete pgadmin volume...$RESET\n"
docker volume rm pgadmin 2>&1 >/dev/null
printf $BOLDMAGENTA"Delete postgres volume...$RESET\n"
docker volume rm postgres 2>&1 >/dev/null
printf $BOLDBLUE"Cleaning over !$RESET\n"
 docker rmi -f $( docker images -aq)
 docker rm -vf $( docker ps -aq)
docker system prune -a --volumes

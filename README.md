# ft_transcendence

This project is about creating a website for the mighty Pong contest!

![ft_transcendenc](./assets/notes.assets/transcendence_welcome_page.gif)

## Table of contents
- [ft\_transcendence](#ft_transcendence)
	- [Table of contents](#table-of-contents)
	- [Project description](#project-description)
	- [Stack](#stack)
		- [Tooling](#tooling)
		- [Frontend](#frontend)
		- [Backend](#backend)
	- [Quick start](#quick-start)
		- [Tips and tricks](#tips-and-tricks)
	- [Our approach](#our-approach)
		- [Github project :](#github-project-)
		- [Review :](#review-)
		- [Monorepo :](#monorepo-)
		- [Conception :](#conception-)
		- [Implementation :](#implementation-)
	- [Contributors](#contributors)

## Project description

This is the final project of the 42_cursus. 

The aim of the project is to create a SPA (single page application for more informations check this: https://developer.mozilla.org/en-US/docs/Glossary/SPA).

Where you can register using your 42 account and play to the game pong online.

Also you must have the ability to chat with others add users as friends, check there profile etc...

Everything based on a fullstack typescript.

## Stack

### Tooling

- First set up
  - Yarn Workspace (For monorepository)
  - Husky (For precommit hooks check code coverage + lint code)
  - Jest (Test the code)
  - Eslint (Lint the code)
  - PostgreSQL (database)
  - Docker/Docker-compose (Automate deployement)

- Second set up
  - Nx (For monorepository)
  - Swagger (Documentation for the Api)
  - Eslint (Lint the code)
  - Jest (Test the code)
  - PostgreSQL (database)
  - Docker/Docker-compose (Automate deployement)

### Frontend

- React
- Css modules
- Typescript
- Websockets

### Backend

- Nestjs
- Prisma
- Open APi
- Websockets

## Quick start

> Create a .env file a the root of the repo you can copy the template_env.txt located in the notes directory. You can run the project without: NX_API_URL, NX_CLIENT_ID and NX_CLIENT_SECRET set. But the connection with 42 won't work.

```bash
docker-compose up -d --build
```

### Tips and tricks

> To get the api documentation go on `http://${hostname}:${port}/doc`
Check the logger in the backend container for precise informations.

> If your port is already in use do not panic, simply use Scan port: `lsof -i -P -n | grep ${port}` to check wich process use it and use `kill -9 process_id` to kill the process. Or just change the port in the .env file.

> To fix the syncronization with the 2fa use `hwclock -s`

> You can use a databse manager like DBeaver to connect to the database and check the content of your entites.


## Our approach

### Github project :
- To get a better efficienty in the group we decided to use a kanban board.

### Review :
- To get a better worflow we set review and protected the main branch.

### Monorepo :
- We also decided to use a monorepo to increase our developping speed and avoid boilerplate code. (more info about monorepos in : https://monorepo.tools/)

### Conception :

- We started by designing our relationnal databse using dbdiagram (https://dbdiagram.io/home)

![database image](./assets/notes.assets/project.visualisation.assets/database.png)

- After we created the feature list

![Feature_list image](./assets/notes.assets/project.visualisation.assets/feature_list.png)

- We created a wireframe too, you can find it in the notes.assets

### Implementation :

- We used swagger to create a documentation of the api protected by a jwt acess token.

![Feature_list image](./assets/notes.assets/project.visualisation.assets/swagger_doc.png)

- We used the Nx graph to get a good overview of our project.
  
![dependencies graph image](./assets/notes.assets/project.visualisation.assets/dependencies_graph.png)

## Contributors

<a href="https://github.com/nabitbol/ft_transcendence/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=nabitbol/ft_transcendence" />
</a>

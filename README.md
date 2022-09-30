# ft_transcendence

This project is about creating a website for the mighty Pong contest! 

## Overview

### Run the backend

```bash
npx nx serve backend
```

### Run the frontend

```bash
npx nx serve frontend
```
### Get API doc

> serve the backend then got to hostname:port/doc check the backend
> logger for precise informations

## About the set up

> the project use a monorepo system based on nx for more information check nx.md in notes.

### Add a nest lib

> use: ` npx nx generate @nrwl/nest:lib lib-name --Options`
> Example of options could be --controller or --service

### Add a react component

> use: `npx nx g component component-name --project=project-name --directory=directory-name`
> Example of command coould be: npx nx g component playButton --project=pages --directory=home

## About Prisma

### Connection

> To connect to the postgresql database you have to provid an database url in the .env
> respecting this standrad : (One exemple is provided in template_env.md)
> **postgresql://USER:PASSWORD@HOST:PORT/DATABASE?KEY1=VALUE&KEY2=VALUE&KEY3=VALUE**
` check this like form more information https://www.prisma.io/docs/concepts/database-connectors/postgresql`

### Migration

> To deploy your application you have to migrate to the last version of the database
> use: `npx prisma migrate dev` (for developpement)

### Data visualisation

> To check the database content
> use: `npx prisma studio`

## Data Base

![database image](./assets/notes.assets/project.visualisation.assets/database.png)

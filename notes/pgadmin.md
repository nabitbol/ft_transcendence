# ADMINER USAGE

# DEPLOYEMENT

> You can deploy the application using `docker-compose up -d`
![deployement image](../assets/docker-compose-up.png)
> Then check the containers status using `docker-compose ps`
![container status](../assets/docker-compose-ps.png)

# LOGIN

> Now open your web browser and go to the **hostname:15432** you would get the login page
![pgadmin login](../assets/pgadmin-login.png)
> The fill the fields with your `PGADMIN_EMAIL` and `PGADMIN_PASSWORD`

# ADD DATABASE

> Click Add New Server under Quick Links
![add new server](../assets/add-new-server.png)

> Enter a **Name** the value can be anything
![server name](../assets/server-name.png)

> Go under **Connection** and enter the **Host name/adress**, **Username** and the **Password**
> - For Host name/address, the value is the Docker Compose database service name, in our case is postgres.
> - For the **Username** use the one store in your environnement variable `POSTGRES_USER`
> - Same for the **Password** `POSTGRES_PASSWORD`
![add database](../assets/add-connection.png)

> And click Save to finish. After you can get access to the database from the sidebar.
![add database](../assets/database-dashboard.png)

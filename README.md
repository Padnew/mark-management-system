# mark-management-system
This is the technical guide for the mark management project, from this project you can insert, manage and visualise historical student results to gain a better insight into the performance of an individual or a cohort.

## Getting Started

### Preparing the database
You will need a database connection as the database is not hosted.
The backend is configured for a MySQL database so installing this first is important.

Follow this guide to get it installed:
https://dev.mysql.com/doc/mysql-installation-excerpt/5.7/en/ 

For creating the schema and preparing the database I would suggest using MySQLWorkbench available here:
https://dev.mysql.com/downloads/workbench/

Once installed, create a SQL connection and note down the connection name, username and password

Create a schema called mms or similar, note this down too as it's your database name. 

Now use the create table statements from this in MySQLWorkbench: https://pastebin.com/eEpn28m1

Populate those tables using the scripts in this file:
https://pastebin.com/FDs9V5Dw

### Node
Node.js is also required so if you do not have this then install it from here:
https://nodejs.org/en/download/

## Running the system

Clone the repo using this command:
```
git clone https://github.com/Padnew/mark-management-system.git
```

Move into the project directory:
```
cd mark-management-system
```

Once cloned, install dependencies using:
```
npm i
```

You will need to specify the database you created in the prerequisites stage, do this by creating a .env file in the root of the project by running:

```
touch .env
```

Open the file and paste in the following:

```
SERVER_PASSWORD=YourServerPassword
SERVER_DATABASE=YourDatabaseServer
SERVER_HOST=YourServerHostName
SERVER_USER=YourServerUsername
BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:20502
```

Change the values to the database details you have noted down from before 

Save and run:

```
npm run dev
```

Ensure the console compiles and the server runs

!! The only user in the system is logged in with using the following credentials:
Email: admin@strath.ac.uk
Password: StrongPassword !!

Every other lecturer created from there onwards will have their password hard-assigned to their first name in lower case. (e.g John Smith's password will be 'john')

## Uploading marks

For uploading marks into the system, the formatted files can be generated from the secondary system in this project which is available here: https://github.com/Padnew/mms-data-scripts 

## Help and Support
If there are any issues or problems that arise then feel free to contact me at: patrick.newton.2021@uni.strath.ac.uk
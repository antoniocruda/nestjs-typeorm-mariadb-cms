# main-backend

## Required Installed Software

1. NodeJS 20 and up
2. MariaDB 10.11 and up
3. Redis

## How to run this??

1. ``$ cd <root path of main-backend>``
2. ``$ yarn install``
3. ``$ cp .env.example .env``
4. Change the values in the .env as needed.
5. ``$ yarn migration:run``
6. ``$ yarn build``
7. ``$ yarn start:prod (For development, run $ yarn start:dev)``

___

## Altering the database schema 
We are using typeorm migration technique in updating our database schema. Migration files can be found inside
migration folder.

### Creating a new migration file
``$ yarn migration:create ./database/migration/<migration file name>``

### Running migrations
``$ yarn migration:run `` 

### Rolling back last migrated migrations
``$ yarn migration:revert `` 

### Seeding database
``$ yarn db:seed `` 

### Code Generation
``$ yarn code-gen <table-name> <namespace> <action> `` 

``$ yarn code-gen admin_users admin `` 

## Logging in the CMS

1. Make sure to run this backend first before running the CMS.
2. You can use the default account credentials to login in the CMS.
  
Username: admin
Password: Pa$$w0rd

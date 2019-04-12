CRUD Operations for NODE JS Applications
========================================
The purpose of this application is to create CRUD operation. It contains 4 modules:
   - Role:
      - Create
      - Update
      - Delete
      - List
   - Permission:
      - Create
      - Update
      - Delete
      - List
   - User
      - Create
      - Update
      - Delete
      - List

Postman collections are included into **API-Collections** directory. Please import it.

How it works?
=================
Please follow the some steps which are given below:
   - Install nodejs > v9.x.x and npm > v6.x.x
   - Run for window `npm install -g migrate-mongo` and `sudo npm install -g migrate-mongo` for Ubuntu
   - Install mongodb > v4.x.x
   - Install Postman for hitting API.
   - Download applications and go to the directory. Run `npm install`
   - After running above command, go to the **migrations** directory:
    `cd migrations` and run `migrate-mongo up`
   - Start application Run `npm start`
   - After running all success commands, you will see server running messages on terminal.
   - Run tests by `npm test`

http://localhost:3500/api/

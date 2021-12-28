# codeBlogger

codeBlogger is blogging website apis

### To run this project:

- Clone this project

- Run command `npm i` on terminal to install all require packages

- Add **.env** file similar to **env.sample** file

- Setup the keys in **.env**

- Run command `npm start` or `node index.js` on terminal to run this project.

- Thank me later 😁



### Flow of project

- The project starts with `index.js` where express app is created
- In `index.js` there's an import of loaders/routes  in which we pass the app object
- Here all modules are added to the app
- In loaders/routes there are import of module specific route files which registers the endpoint of apis
- In app specific route files (routes/\*) we have imports of controller files of respective module
- Here we map endpoints with controllers 

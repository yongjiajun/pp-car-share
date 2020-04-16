# Car Share Scheme

This repo contains our capstone project, **Car Share Scheme** for **Programming Project 1** at **RMIT University**.

**Car Share Scheme** is a **web/mobile application** implemented on a **MERN Stack**.



#### Note

- Port config:
  - frontend: `3000`
  - backend: `3001`
- `mongodb`
  - connection uri: Please export `MONGO_URI` environment variable in your terminal before starting the backend. For instance: `export MONGO_URI=mongodb://localhost:27017`
  - db name: Currently set to `ppcarshare` in `backend/app.js`.
  - credentials: Not using credentials at the moment. Do configure in `backend/app.js` if credentials are used.



#### Code Structure

- `backend/` contains code for **Express.js** and also code for maintaining mongodb connection.
  - `api/` contains code for REST APIs, separated by models.
    - `controllers/` contains code for model db controllers.
    - `models/` contains code/schema for models.
    - `routes/` contains code for routing urls to `controllers`.
  - `app.js` contains code for **Express.js** configs such as routings, mongodb connection, CORS handling, etc.
  - `app_server.js` contains code for managing **Express.js** core configs such as listening port and http/s protocol.

- `frontend/` contains code for **React.js** for the frontend of the web application

#### 
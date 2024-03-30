import express from "express";
import {createUserRouter} from "./routes/users.routes.js"

export const createApp = () => {
    const app = express();
    
    //middlewares
    app.use(express.json())
        
    app.use(createUserRouter());

    return app
}


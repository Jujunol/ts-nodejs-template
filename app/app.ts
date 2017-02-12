import * as express from 'express';
import * as path from 'path';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as env from 'dotenv';
import * as session from 'express-session';
import * as errorHandler from 'errorhandler';

import {IndexRoute} from './routes/IndexRoute';

export class Server {

    app: express.Application;

    public static bootstrap(): Server {
        return new Server();
    }

    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    config() {
        env.config();  // loads .env file if exists

        this.app.use(express.static(path.join(path.dirname(__dirname), 'public')));
        this.app.set('views', path.join(path.dirname(__dirname), 'views'));
        this.app.set('view engine', 'ejs');

        this.app.use(logger('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(cookieParser());

        this.app.use(session({
            secret: process.env.app_secret,
            resave: false,
            saveUninitialized: true,
        }));

        // error 404 
        this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            err.status = 404;
            next(err);
        });

        this.app.use(errorHandler());
    }

    routes() {
        [
            new IndexRoute(),
        ].forEach((route) => {
            this.app.use(route.basePath, route.router);
        })
    }

}

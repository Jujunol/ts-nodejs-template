import * as express from 'express';
import * as path from 'path';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as env from 'dotenv';
import * as session from 'express-session';
import * as errorHandler from 'errorhandler';
import * as nunjucks from 'nunjucks';

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

        // 404 should always be the last
        this.error404();
    }

    config() {
        env.config();  // loads .env file if exists

        this.app.use(express.static(path.join(path.dirname(__dirname), 'public')));
        this.app.engine('njk', nunjucks.render);
        this.app.set('view engine', 'njk');
        nunjucks.configure(path.join(path.dirname(__dirname), 'views'), {
            autoescape: true,
            express: this.app,
        });

        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(cookieParser());

        this.app.use(session({
            secret: process.env.app_secret,
            resave: false,
            saveUninitialized: true,
        }));
    }

    routes() {
        [
            new IndexRoute(),
        ].forEach(route => {
            this.app.use(route.basePath, route.router);
        });
    }

    error404() {
        this.app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.status(404);
            next(err);
        });

        this.app.use(errorHandler());
    }

}

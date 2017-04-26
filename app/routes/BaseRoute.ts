import {Response, Router} from 'express';

export abstract class BaseRoute {

    public router: Router;
    public basePath: string;
    public title: string;
    private scripts: string[];

    constructor() {
        this.router = Router();
        this.basePath = "/";
        this.title = "";
        this.scripts = [];
    }

    public addScript(script: string): BaseRoute {
        this.scripts.push(script);
        return this;
    }

    public render(res: Response, view: string, options?: Object) {
        res.locals.BASE_URL = "/";
        res.locals.scripts = this.scripts;
        res.locals.title = this.title;

        res.render(view, options);
    }

}
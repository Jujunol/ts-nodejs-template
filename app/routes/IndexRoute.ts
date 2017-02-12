import {Request, Response, NextFunction} from 'express';
import {BaseRoute} from './BaseRoute';

export class IndexRoute extends BaseRoute {

  constructor() {
    super();

    this.router
      .get('/', (req, res, next) => this.index(req, res, next));
  }

  index(req: Request, res: Response, next: NextFunction) {
    this.title = "Home | Page";
    this.render(req, res, 'index', {
      message: "Hello World",
    });
  }

}
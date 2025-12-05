import { Request, Response, NextFunction, RequestHandler } from "express";

export type Controller = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any> | any;

const controllerWrapper = (ctrlr: Controller): RequestHandler => {
  const func: RequestHandler = async (req, res, next) => {
    try {
      await ctrlr(req, res, next);
    } catch (error) {
      next(error);
    }
  };
  return func;
};

export default controllerWrapper;

import { Request, Response, NextFunction, RequestHandler } from "express";
import createHttpError from "http-errors";

export const asyncWrapper = (requestHandler: RequestHandler) =>{
    return async (req: Request, res: Response, next: NextFunction) =>{
       Promise.resolve(requestHandler(req, res, next)).catch((err:unknown)=>{
        if(err instanceof Error){
            next(createHttpError(500, err.message));
            return;
        }else{
            next(createHttpError(500, "Internal server error"));
            return;
        }
       });
    }
}
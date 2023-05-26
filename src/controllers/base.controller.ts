import { Response } from "express";
import { GithubError } from "../util/errorHandling";

export default abstract class BaseController {
    constructor() { }

    public static jsonResponse(res: Response, code: number, message: string) {
        return res.status(code).json({ message })
    }

    public success<T>(res: Response, dto?: T) {
        if (!dto) {
            return res.sendStatus(200);
        }
        res.type('application/json');
        return res.status(200).json(dto);
    }

    public clientError(res: Response, message?: string) {
        return BaseController.jsonResponse(res, 400, message ? message : 'Client Error');
    }

    public notFound(res: Response, message?: string) {
        return BaseController.jsonResponse(res, 404, message ? message : 'Not found');
    }

    public fail(res: Response, error: Error | string) {
        return BaseController.jsonResponse(res, 500, error.toString());
    }

    public error(res: Response, err: GithubError | Error) {
        if (err instanceof GithubError) {
            switch (err.status) {
                case 400:
                    this.clientError(res, err.message);
                    break;
                case 404:
                    this.notFound(res, err.message);
                    break;
                default:
                    this.fail(res, err.message)
            }
        } else {
            this.fail(res, err.toString());
        }
    }
}
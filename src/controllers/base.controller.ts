import { Response } from "express";

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

    public clientError (res: Response, message?: string) {
        return BaseController.jsonResponse(res, 400, message ? message : 'Client Error');
      }

    public notFound (res: Response, message?: string) {
        return BaseController.jsonResponse(res, 404, message ? message : 'Not found');
      }

    public fail(res: Response, error: Error | string) {
        return res.status(500).json({ message: error.toString() });
    }
}
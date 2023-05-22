import { NextFunction, Request, Response } from 'express';
import  { IssuesService } from '../services/';
import { IssueQuery } from '../types';

export async function getIssues(req: Request<{}, {}, {}, IssueQuery>, res: Response, next: NextFunction): Promise<void> {
    try {
        const issues = await IssuesService.getIssuesByParams(req.query);
        res.status(200).json(issues);
    }
    catch (err) {
        next(err);
    }
}

import { NextFunction, Request, Response } from 'express';
import  { IssuesService } from '../services/';

export async function getIssues(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { user, repository, page, size } = req.query as { user: string, repository: string, page: string, size: string };
        const issues = await IssuesService.getIssuesByParams(user, repository, page, size);
        res.status(200).json(issues);
    }
    catch (err) {
        next(err);
    }
}

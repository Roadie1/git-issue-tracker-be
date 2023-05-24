import { NextFunction, Request, Response } from 'express';
import { IssuesService } from '../services/';
import { IssueDetailsQuery, IssueQuery } from '../types';

export async function getIssues(req: Request<{}, {}, {}, IssueQuery>, res: Response, next: NextFunction): Promise<void> {
    try {
        const issues = await IssuesService.getIssuesByParams(req.query);
        res.status(200).json(issues);
    }
    catch (err) {
        next(err);
    }
}

export async function getIssueDetails(req: Request<{}, {}, {}, IssueDetailsQuery>, res: Response, next: NextFunction): Promise<void> {
    try {
        const issue = await IssuesService.getIssueDetails(req.query);
        res.status(200).json(issue);
    }
    catch (err) {
        next(err);
    }
}


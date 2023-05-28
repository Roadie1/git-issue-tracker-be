import { Request, Response } from 'express';
import { issuesService } from '../services/';
import { IssueDetailsQuery, IssueQuery } from '../types';
import BaseController from './base.controller';

class IssuesController extends BaseController {
    constructor() {
        super();
    }

    public async getIssues(req: Request<object, object, object, unknown>, res: Response): Promise<void> {
        try {
            const issues = await issuesService.getIssuesByParams(req.query as IssueQuery);
            this.success(res, issues);
        }
        catch (err: unknown) {
            this.error(res, err as Error);
        }
    }
    public async getIssueDetails(req: Request<object, object, object, unknown>, res: Response): Promise<void> {
        try {
            const issue = await issuesService.getIssueDetails(req.query as IssueDetailsQuery);
            this.success(res, issue);
        }
        catch (err: unknown) {
            this.error(res, err as Error);
        }
    }
}

export default new IssuesController();

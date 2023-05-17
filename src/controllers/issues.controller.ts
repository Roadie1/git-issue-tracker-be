import { Request, Response } from 'express';
import * as IssuesService from '../services/issues.service';
import { createLog } from '../middleware/logging.middleware';

async function getIssues(req: Request, res: Response): Promise<void> {
    const { user, repository } = req.params;
    try {
        await createLog('getIssues', [user, repository]);
        const issues = IssuesService.getIssuesByParams(user, repository);
        res.send({
            message: JSON.stringify(issues)
        });
    }
    catch (err) {
        console.log(err);
    }
}

export {
    getIssues
}
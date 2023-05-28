import { Router } from 'express';
import { issuesController } from '../controllers';
import { loggerMiddleware } from '../middlewares';

const router = Router();

router.get(
    '/',
    (req, res, next) => void loggerMiddleware.logRequest(req, res, next, "getIssues"),
    (req, res) => void issuesController.getIssues(req, res)
);
router.get(
    '/details',
    (req, res, next) => void loggerMiddleware.logRequest(req, res, next, "getIssueDetails"),
    (req, res) => void issuesController.getIssueDetails(req, res)
);

export default router;

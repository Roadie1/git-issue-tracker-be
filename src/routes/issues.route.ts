import { Router } from 'express';
import { IssuesController } from '../controllers';
import { LoggerMiddleware } from '../middlewares';

const router = Router();

router.use('/', (req, res, next) => LoggerMiddleware.logRequest(req, res, next, "getIssues"));
router.get('/', IssuesController.getIssues);
router.use('/details', (req, res, next) => LoggerMiddleware.logRequest(req, res, next, "getIssueDetails"));
router.get('/details', IssuesController.getIssueDetails)

export default router;

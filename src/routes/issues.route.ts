import { Router } from 'express';
import { issuesController } from '../controllers';
import { loggerMiddleware } from '../middlewares';

const router = Router();

router.get('/', (req, res, next) => loggerMiddleware.logRequest(req, res, next, "getIssues"), (req, res) => issuesController.getIssues(req, res));
router.get('/details', (req, res, next) => loggerMiddleware.logRequest(req, res, next, "getIssueDetails"), (req, res) => issuesController.getIssueDetails(req, res))

export default router;

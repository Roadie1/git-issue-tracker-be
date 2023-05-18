import { Router } from 'express';
import { IssuesController } from '../controllers';
import { LoggerMiddleware } from '../middlewares';

const router = Router();

router.use('/', (req, res, next) => LoggerMiddleware.logRequest(req, res, next, "getIssues"));
router.get('/', IssuesController.getIssues);

export default router;

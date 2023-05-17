import { Router } from 'express';
import * as IssuesController from '../controllers/issues.controller';

const router = Router();

router.get('/:user/:repository', IssuesController.getIssues);

export default router;

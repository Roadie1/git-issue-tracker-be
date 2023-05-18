import { Router } from 'express';
import { StatisticsController } from '../controllers';
// import { LoggerMiddleware } from '../middlewares';

const router = Router();

// router.use((req, res, next) => LoggerMiddleware.logRequest(req, res, next, "getAllStatistics"));
router.get('/', StatisticsController.getAllStatistics);

export default router;

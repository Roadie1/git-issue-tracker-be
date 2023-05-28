import { Router } from 'express';
import { statisticsController } from '../controllers';

const router = Router();

router.get('/', (req, res) => void statisticsController.getAllStatistics(req, res));

export default router;

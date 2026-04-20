import { Router } from 'express';
import aiController from '../controllers/ai.controller.js';


const router = Router();

router.post('/pet-description', aiController.generatePetDescription);
router.post('/chat', aiController.chat);
router.post('/adoption-questions', aiController.generateAdoptionQuestions);
router.post('/evaluate-adoption', aiController.evaluateAdoption);

export default router;
import express from 'express';
const router = express.Router();
import bodyParser from 'body-parser';
import cors from 'cors';
import { TypeChecker } from '@doubleedesign/type-checker';

router.post('/typecheck', cors<cors.CorsRequest>(), bodyParser.json({ limit: '50mb' }), (req, res) => {
	const result = TypeChecker.getType(req.body);

	res.json(result);
});

export default router;

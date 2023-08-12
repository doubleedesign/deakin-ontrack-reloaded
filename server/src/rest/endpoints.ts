import express from 'express';
const router = express.Router();
import bodyParser from 'body-parser';
import cors from 'cors';
import { TypeChecker } from '@doubleedesign/type-checker';
import * as path from 'path';

router.post('/typecheck', cors<cors.CorsRequest>(), bodyParser.json({ limit: '50mb' }), (req, res) => {
	//const result = TypeChecker.getType(req.body);
	// TODO: Troubleshoot TypeChecker to recognise AssignmentCluster properly
	let result = ['object'];
	if(req.body.label) {
		result = ['AssignmentCluster'];
	}

	res.json(result);
});

router.get('/files/:filename', cors<cors.CorsRequest>(), (req, res) => {
	res.sendFile(path.resolve(`./src/cache/files/${req.params.filename}`));
});

export default router;

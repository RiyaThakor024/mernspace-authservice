import express, { Request, Response } from 'express';

import jwks from '../../public/.well-known/jwks.json';
const router = express.Router();

router.get('/jwks.json', (req: Request, res: Response) => res.json(jwks));

export default router;

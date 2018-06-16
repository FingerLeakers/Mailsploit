/*
 * Mailsploit Server
 * Copyright (C) 2018 Sabri Haddouche
 */

import * as express from 'express';

const router: express.Router = express.Router();
const handler: express.Handler = (req, res) => {
  res.send('');
};

router.get('/', handler);
router.get('/home', handler);

export = router;

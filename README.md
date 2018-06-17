![Mailsploit logo](https://raw.githubusercontent.com/pwnsdx/Mailsploit/master/resources/logo.png?fuckgithubcache=2)

### Mailsploit Server

*Note*: You will need an Amazon SES account with a verified domain in order to use the tool. Also, the web server can only run at 88 miles per hour.

#### How to install

1. Clone the repository
2. Edit `originalFrom` in `src/main/Config.ts` with your verified SES email address.
3. Run the following commands in the terminal:
```
yarn install && yarn dist # Require yarn
```

#### How to launch the web server

1. Run the following command in the terminal:
```
SES_USERNAME=[Amazon SES Username] SES_PASSWORD=[Amazon SES Password] node dist/commonjs/index.js
```
2. That's it. The server will run on localhost:8081

#### How to use it

You can do a POST request containing `sender`, `receiver` and `options` (from 0 to 13) parameters to the `/process` endpoint.

Example using cURL (payload 3 without XSS):

```
curl --url http://localhost:8081/process --data "sender=potus@whitehouse.gov&receiver=sabri@riseup.net&options=2"
```

or, all the payloads with XSS:

```
curl --url http://localhost:8081/process --data "sender=potus@whitehouse.gov&receiver=sabri@riseup.net&xss=true&options=-1"
```

All the payloads are [available here](https://github.com/pwnsdx/Mailsploit/blob/master/src/main/Payloads.ts#L30).
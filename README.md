validation code service
=======================

### Send sms

```
$ curl -i -XPOST -H 'appid:demo' http://localhost:3000/sms -d 'phone=13900000000&message=test'
```

### Request validation code

```
$ curl -i -XPOST -H 'appid:demo' http://localhost:3000/request/reg/13900000000
```

### Verify validation code

```
$ curl -i -XPOST -H 'appid:demo' http://localhost:3000/verify/reg/13900000000/111111
```

### Run from docker

```
$ docker build -t ququzone/validation-code-service .
$ docker run -it -p 3000:3000 --add-host="vcs.redis.host:127.0.0.1" ququzone/validation-code-service
```

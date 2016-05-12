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

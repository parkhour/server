# server
parkhour server

## API-Documentation

|No|Route|HTTP Method|Request|Response(success)|Description|
|---|---|---|---|---|---|
1|/register| POST|```body: {email, password} ``` | ``` status(201), data: { token, uid } ```|User Register |
2|/login|POST|```body: {email, password} ```|``` status(200), data: { token, uid } ```|  User login|
3|/logout|POST|```body: {email, password} ```|``` status(200), data: { token, uid } ```|  User logout- firebase signout|
4|/reservations| GET | ``` headers: { authorization: accessToken } ``` | ```status(200), data: { reservations: [{}, {}, ...]} ``` | Get all reservations
5|/reservations| POST| ```headers: {authorization: accessToken}, body: { ```| ```status(201), data: {mallId, parkId, mallName, uid, licensePlate, status} ``` | Add reservation
6|/payments| GET | ``` params: { productID: ObjectID }, headers:{authorization: adminToken} ``` | ```status(200), data: { reservations: [{}, {}, ...]} ```|Get all payments history
7|/payments| POST |```headers: {authorization: adminToken}```| ```status(201), data: {mallId, parkId, reservationId, licensePlate, parkingStart, parkingEnd, totalCharge, status} ``` | Create a payment detail
8|/payments/:id| PATCH | ```headers: {authorization: adminToken}, params: {paymentId}, body: { status: true}``` | ```status(204), body: none ```|   Complete a payment detail |


### Run test
```
npm run test
```

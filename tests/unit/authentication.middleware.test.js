const httpMocks = require('node-mocks-http');
const { authentication } = require('../../middlewares');

let req;
let res;
let next;

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe('Authentication', () => {
  it('should have a function', () => {
    expect(typeof authentication).toBe('function');
  });

  it('should return 403, and No token found message', () => {
    authentication(req, res, next);
    expect(res.statusCode).toBe(403);
    expect(res._getJSONData()).toStrictEqual({ errors: 'No token found' });
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('should return 403, and Invalid Token message', () => {
    req.headers = {
      authorization: 'Bearer 1234',
    };
    authentication(req, res, next);
    expect(res.statusCode).toBe(403);
    expect(res._getJSONData()).toStrictEqual({ errors: 'Invalid Token' });
    expect(res._isEndCalled()).toBeTruthy();
  });
});

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeConfig = exports.makeDecryptor = exports.makeEncryptor = exports.handleError = undefined;

var _jsonStringifySafe = require('json-stringify-safe');

var _jsonStringifySafe2 = _interopRequireDefault(_jsonStringifySafe);

var _cryptoJs = require('crypto-js');

var _cryptoJs2 = _interopRequireDefault(_cryptoJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var handleError = exports.handleError = function handleError(handler, err) {
  if (typeof handler === 'function') {
    handler(err);
  }
};

var makeEncryptor = exports.makeEncryptor = function makeEncryptor(transform) {
  return function (state, key) {
    if (typeof state !== 'string') {
      state = (0, _jsonStringifySafe2.default)(state);
    }
    return transform(state);
  };
};

var makeDecryptor = exports.makeDecryptor = function makeDecryptor(transform, onError) {
  return function (state, key) {
    if (typeof state !== 'string') {
      handleError(onError, new Error('redux-persist-transform-encrypt: expected outbound state to be a string'));
      return state;
    }
    try {
      return transform(state);
    } catch (err) {
      handleError(onError, err);
      return null;
    }
  };
};

var makeConfig = exports.makeConfig = function makeConfig(config) {
  if (config.cipher || config.mode || config.padding) {
    var salt = _cryptoJs2.default.lib.WordArray.random(128 / 8);
    var cipher = _cryptoJs2.default.kdf.OpenSSL.execute(config.secretKey, 256 / 32, 128 / 32, salt);
    return {
      iv: cipher.iv,
      mode: config.mode || _cryptoJs2.default.mode.ECB,
      padding: config.padding || _cryptoJs2.default.pad.Pkcs7
    };
  }
  return {};
};
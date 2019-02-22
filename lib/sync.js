'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reduxPersist = require('redux-persist');

var _core = require('crypto-js/core');

var _core2 = _interopRequireDefault(_core);

var _aes = require('crypto-js/aes');

var _aes2 = _interopRequireDefault(_aes);

var _helpers = require('./helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var makeSyncEncryptor = function makeSyncEncryptor(secretKey, cfg) {
  return (0, _helpers.makeEncryptor)(function (state) {
    return _aes2.default.encrypt(state, secretKey, cfg).toString();
  });
};

var makeSyncDecryptor = function makeSyncDecryptor(secretKey, onError, cfg) {
  return (0, _helpers.makeDecryptor)(function (state) {
    try {
      var bytes = _aes2.default.decrypt(state, secretKey, cfg);
      var decryptedString = bytes.toString(_core2.default.enc.Utf8);
      return JSON.parse(decryptedString);
    } catch (err) {
      throw new Error('Could not decrypt state. Please verify that you are using the correct secret key.');
    }
  }, onError);
};

exports.default = function (config) {
  var configParam = (0, _helpers.makeConfig)(config);
  var inbound = makeSyncEncryptor(config.secretKey, configParam);
  var outbound = makeSyncDecryptor(config.secretKey, config.onError, configParam);
  return (0, _reduxPersist.createTransform)(inbound, outbound, config);
};
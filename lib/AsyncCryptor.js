'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _core = require('crypto-js/core');

var _core2 = _interopRequireDefault(_core);

var _aes = require('crypto-js/aes');

var _aes2 = _interopRequireDefault(_aes);

var _readableStream = require('readable-stream');

var _readableStream2 = _interopRequireDefault(_readableStream);

var _helpers = require('./helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AsyncCryptor = function () {
  function AsyncCryptor(secretKey, configParam) {
    _classCallCheck(this, AsyncCryptor);

    this.key = _core2.default.enc.Utf8.parse(secretKey);
    this.cryptorParams = (0, _helpers.makeConfig)(configParam);
  }

  _createClass(AsyncCryptor, [{
    key: 'encrypt',
    value: function encrypt(state) {
      var encryptor = _core2.default.algo.AES.createEncryptor(this.key, this.cryptorParams);
      return this._execute(encryptor, state);
    }
  }, {
    key: 'decrypt',
    value: function decrypt(state) {
      var decryptor = _core2.default.algo.AES.createDecryptor(this.key, this.cryptorParams);
      return this._execute(decryptor, state, true);
    }
  }, {
    key: '_execute',
    value: function _execute(cryptor, state) {
      var decrypt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      return new Promise(function (resolve, reject) {
        try {
          var stream = new _readableStream2.default();
          var processedState = '';
          stream.on('data', function (data) {
            processedState += cryptor.process(data.toString());
          }).on('end', function () {
            processedState += cryptor.finalize();
            resolve(processedState);
          });
          stream.push(state);
          stream.push(null);
        } catch (err) {
          reject(err);
        }
      });
    }
  }]);

  return AsyncCryptor;
}();

exports.default = AsyncCryptor;
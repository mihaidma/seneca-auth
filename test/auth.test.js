'use strict'

var assert = require('assert')
var Seneca = require('seneca')
var Lab = require('lab')

var lab = exports.lab = Lab.script()
var describe = lab.describe
var it = lab.it

var si = Seneca()
si.use('user')
si.use(require('..'), {secure: true})

var authact = si.pin({role: 'auth', cmd: '*'})

describe('auth', function () {
  it('happy', function (cb) {
    authact.register({data: {nick: 'u1', name: 'u1n', password: 'u1p'}}, function (err, out) {
      if (err) return cb(err)

      assert.ok(out.ok)
      assert.ok(out.user)
      assert.ok(out.login)
      cb()
    })
  })

  it('use secure option', function (cb) {
    var res = {}
    var req = {}

    si.cookies = {
      set: function (tokenkey, id, options) {
        assert.ok(options.secure)

        cb()
      }
    }
    res.seneca = si
    req.seneca = si
    authact.login({
      user: {nick: 'u1', name: 'u1n', password: 'u1p'},
      auto: true,
      req$: req,
      res$: res
    }, function (err, out) {
      if (err) return cb(err)
    })
  })
})

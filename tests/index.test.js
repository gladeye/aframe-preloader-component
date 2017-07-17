/* global assert, setup, suite, test */
require('aframe');
require('jquery');
require('bootstrap');
require('../index.js');
var entityFactory = require('./helpers').entityFactory;

suite('preloader component', function () {
  var component;
  var el;

  setup(function (done) {
    el = entityFactory();
    el.addEventListener('componentinitialized', function (evt) {
      if (evt.detail.name !== 'preloader') { return; }
      component = el.components['preloader'];
      done();
    });
    el.setAttribute('preloader', {});
  });

  /*suite('foo property', function () {
    test('is good', function () {
      assert.equal(1, 1);
    });
  });*/
});

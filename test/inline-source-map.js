'use strict';
/*jshint asi: true*/

var test = require('trap').test
var generator = require('..');

var foo = '' + function foo () {
  var hello = 'hello';
  var world = 'world';
  console.log('%s %s', hello, world);
}

var bar = '' + function bar () {
  console.log('yes?');
}

function decode(base64) {
  return new Buffer(base64, 'base64').toString();
} 

test('generated mappings', function (t) {
  t.test('no offset', function (t) {
    var gen = generator()
      .addGeneratedMappings('foo.js', foo)
      .addGeneratedMappings('bar.js', bar)

    t.deepEqual(
        gen._mappings()
      , [ { generated: { line: 1, column: 0 },
            original: { line: 1, column: 0 },
            source: 'foo.js',
            name: null },
          { generated: { line: 2, column: 0 },
            original: { line: 2, column: 0 },
            source: 'foo.js',
            name: null },
          { generated: { line: 3, column: 0 },
            original: { line: 3, column: 0 },
            source: 'foo.js',
            name: null },
          { generated: { line: 4, column: 0 },
            original: { line: 4, column: 0 },
            source: 'foo.js',
            name: null },
          { generated: { line: 1, column: 0 },
            original: { line: 1, column: 0 },
            source: 'bar.js',
            name: null },
          { generated: { line: 2, column: 0 },
            original: { line: 2, column: 0 },
            source: 'bar.js',
            name: null } ]      
        , 'generates correct mappings'
    )
    t.deepEqual(
        decode(gen.base64Encode()) 
      , '{"version":3,"file":"","sources":["foo.js","bar.js"],"names":[],"mappings":"AAAA,ACAA;ADCA,ACAA;ADCA;AACA"}'
      , 'encodes generated mappings'
    )
    t.equal(
        gen.inlineMappingUrl()
      , '//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlcyI6WyJmb28uanMiLCJiYXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsQUNBQTtBRENBLEFDQUE7QURDQTtBQUNBIn0='
      , 'returns correct inline mapping url'
    )
  })

  t.test('with offset', function (t) {
    var gen = generator()
      .addGeneratedMappings('foo.js', foo, { line: 20 })
      .addGeneratedMappings('bar.js', bar, { line: 23, column: 22 })

    t.deepEqual(
        gen._mappings()
      , [ { generated: { line: 21, column: 0 },
            original: { line: 1, column: 0 },
            source: 'foo.js',
            name: null },
          { generated: { line: 22, column: 0 },
            original: { line: 2, column: 0 },
            source: 'foo.js',
            name: null },
          { generated: { line: 23, column: 0 },
            original: { line: 3, column: 0 },
            source: 'foo.js',
            name: null },
          { generated: { line: 24, column: 0 },
            original: { line: 4, column: 0 },
            source: 'foo.js',
            name: null },
          { generated: { line: 24, column: 22 },
            original: { line: 1, column: 0 },
            source: 'bar.js',
            name: null },
          { generated: { line: 25, column: 22 },
            original: { line: 2, column: 0 },
            source: 'bar.js',
            name: null } ]        
      , 'generates correct mappings'
    )
    t.equal(
        decode(gen.base64Encode())
      , '{\"version\":3,\"file\":\"\",\"sources\":[\"foo.js\",\"bar.js\"],\"names\":[],\"mappings\":\";;;;;;;;;;;;;;;;;;;;AAAA;AACA;AACA;AACA,sBCHA;sBACA\"}'
      , 'encodes generated mappings with offset'
    )
  })
})

test('given mappings', function (t) {
  t.test('no offset', function (t) {
    var gen = generator()
      .addMappings('foo.js', [{ original: { line: 2, column: 3 } , generated: { line: 5, column: 10 } }])
      .addMappings('bar.js', [{ original: { line: 6, column: 0 } , generated: { line: 7, column: 20 } }])

    t.deepEqual(
        gen._mappings()
      , [ { generated: { line: 5, column: 10 },
            original: { line: 2, column: 3 },
            source: 'foo.js',
            name: null },
          { generated: { line: 7, column: 20 },
            original: { line: 6, column: 0 },
            source: 'bar.js',
            name: null } ]
      , 'adds correct mappings'
    )
    t.deepEqual(
        decode(gen.base64Encode()) 
      , '{"version":3,"file":"","sources":["foo.js","bar.js"],"names":[],"mappings":";;;;UACG;;oBCIH"}'
      , 'encodes generated mappings'
    )
    t.equal(
        gen.inlineMappingUrl()
      , '//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlcyI6WyJmb28uanMiLCJiYXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztVQUNHOztvQkNJSCJ9'
      , 'returns correct inline mapping url'
    )
  })

  t.test('with offset', function (t) {
    var gen = generator()
      .addMappings('foo.js', [{ original: { line: 2, column: 3 } , generated: { line: 5, column: 10 } }], { line: 5 })
      .addMappings('bar.js', [{ original: { line: 6, column: 0 } , generated: { line: 7, column: 20 } }], { line: 9, column: 3 })

    t.deepEqual(
        gen._mappings()
      , [ { generated: { line: 10, column: 10 },
            original: { line: 2, column: 3 },
            source: 'foo.js',
            name: null },
          { generated: { line: 16, column: 23 },
            original: { line: 6, column: 0 },
            source: 'bar.js',
            name: null } ]     
      , 'adds correct mappings'
    )
    t.equal(
        decode(gen.base64Encode())
      , '{\"version\":3,\"file\":\"\",\"sources\":[\"foo.js\",\"bar.js\"],\"names\":[],\"mappings\":\";;;;;;;;;UACG;;;;;;uBCIH\"}'
      , 'encodes mappings with offset'
    )
  })
});

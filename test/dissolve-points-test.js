var assert = require('assert'),
    api = require("../");

describe('mapshaper-dissolve.js', function () {

  it('no field -> finds centroid of all points', function() {
    var lyr = {
      geometry_type: 'point',
      shapes: [[[1, 1]], [[0, 0]], [[0, 1]], [[1, 0]]]
    };

    var lyr2 = api.dissolve(lyr, null, {});
    assert.deepEqual(lyr2.shapes, [[[0.5, 0.5]]])
  })

  it('field -> finds centroid of groups of points, ignoring null points', function() {
    var lyr = {
      geometry_type: 'point',
      shapes: [null, [[1, 1]], [[0, 0]], [[2, 2]], [[1, 0]], [[2, 0]], [[0, 2]]],
      data: new api.internal.DataTable([{foo: 'a'}, {foo: 'a'}, {foo: 'a'}, {foo: 'a'}, {foo: 'b'}, {foo: 'c'}, {foo: 'c'}])
    };

    var lyr2 = api.dissolve(lyr, null, {field: 'foo'});
    assert.deepEqual(lyr2.shapes, [[[1, 1]], [[1, 0]], [[1, 1]]])
    assert.deepEqual(lyr2.data.getRecords(), [{foo: 'a'}, {foo: 'b'}, {foo: 'c'}]);
  })

  it('weighted centroid', function() {
    var lyr = {
      geometry_type: 'point',
      shapes: [[[1, 13]], [[0, 0]], [[1, 2]]],
      data: new api.internal.DataTable([{w: 0}, {w: 1}, {w: 3}])
    };

    var lyr2 = api.dissolve(lyr, null, {weighting: 'w'});
    assert.deepEqual(lyr2.shapes, [[[0.75, 1.5]]])
  })


})
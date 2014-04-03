define(['three'], function (THREE) {
  'use strict';
  var circumference = 60;
  var getBezierCurve = function (from, to) {
    // http://spencermortensen.com/articles/bezier-circle/
    var kappa = 0.551915024494;
    var a = from.clone();
    var b = to.clone();

    // Translate both points into the Y axis so we can mesure the angle to X
    a.applyMatrix4(new THREE.Matrix4().makeTranslation(-from.x, 0, 0));
    b.applyMatrix4(new THREE.Matrix4().makeTranslation(-to.x, 0, 0));

    var aAngle = a.angleTo(new THREE.Vector3(0, 1, 0));
    var bAngle = b.angleTo(new THREE.Vector3(0, 1, 0));

    // Set angles between 0 and 2*PI
    if (a.z < 0) {
      aAngle += Math.PI;
    }
    if (b.z < 0) {
      bAngle += Math.PI;
    }

    // Rotate both points arround X so their angle is 0
    a.applyMatrix4(new THREE.Matrix4().makeRotationX(-aAngle));
    b.applyMatrix4(new THREE.Matrix4().makeRotationX(-bAngle));

    kappa = kappa * Math.max(a.y, b.y);

    if (bAngle === 0 && aAngle >= Math.PI) {
      a.z += kappa;
      b.z -= kappa;
    }
    else if (aAngle < bAngle) {
      a.z += kappa;
      b.z -= kappa;
    }
    else {
      a.z -= kappa;
      b.z += kappa;
    }

    // Set everything back
    a.applyMatrix4(new THREE.Matrix4().makeTranslation(from.x, 0, 0));
    b.applyMatrix4(new THREE.Matrix4().makeTranslation(to.x, 0, 0));
    a.applyMatrix4(new THREE.Matrix4().makeRotationX(aAngle));
    b.applyMatrix4(new THREE.Matrix4().makeRotationX(bAngle));

    return new THREE.CubicBezierCurve3(from, a, b, to);
  };
  return {
    sections: [[
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 5, 0),
      new THREE.Vector3(2.5, 5, 0),
      new THREE.Vector3(5, 5, 0),
      new THREE.Vector3(5, 0, 0),
      new THREE.Vector3(0, 0, 0)
    ],
    [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 5, 0),
      new THREE.Vector3(2.5, 5, 0),
      new THREE.Vector3(5, 5, 0),
      new THREE.Vector3(5, 0, 0),
      new THREE.Vector3(0, 0, 0)
    ],
    [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 5, 0),
      new THREE.Vector3(2.5, 5, 0),
      new THREE.Vector3(5, 5, 0),
      new THREE.Vector3(5, 0, 0),
      new THREE.Vector3(0, 0, 0)
    ],
    [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 5, 0),
      new THREE.Vector3(2.5, 5, 0),
      new THREE.Vector3(5, 5, 0),
      new THREE.Vector3(5, 0, 0),
      new THREE.Vector3(0, 0, 0)
    ]
    ],
    setCircumference: function (c) {
      circumference = c;
    },
    getCircumference: function () {
      return circumference;
    },
    getRadius: function () {
      return circumference / (2 * Math.PI);
    },
    getSections: function () {
      return this.sections;
    },
    getGeometry: function () {
      var bezierCurvePoints = 8;
      var geometry = new THREE.Geometry();
      var geometries = [];
      var step = (2 * Math.PI) / this.getSections().length;
      var splines = [];

      for (var i = 0; i < this.getSections().length; i++) {
        geometries[i] = new THREE.Geometry();
        geometries[i].vertices = geometries[i].vertices.concat(this.getSections()[i]);

        // translate on the Y axis
        geometries[i].applyMatrix(new THREE.Matrix4().makeTranslation(0, this.getRadius(), 0));
        // rotate arround the X axis
        geometries[i].applyMatrix(new THREE.Matrix4().makeRotationX(i * step));
      }
      
      var offset = 0;
      function drawRing() {
        for (var i = 0; i < geometries.length; i++) {
          for (var y = 0; y < geometries[i].vertices.length - 1; y += 1) {
            var from = geometries[i].vertices[y];
            var to = geometries[(i + 1) % geometries.length].vertices[y];

            var from2 = geometries[i].vertices[y + 1];
            var to2 = geometries[(i + 1) % geometries.length].vertices[y + 1];

            var spline = getBezierCurve(from, to);
            var spline2 = getBezierCurve(from2, to2);

            var pts = spline.getPoints(bezierCurvePoints);
            var pts2 = spline2.getPoints(bezierCurvePoints);

            geometry.vertices = geometry.vertices.concat(pts);
            geometry.vertices = geometry.vertices.concat(pts2);

            for (var x = pts.length - 1; x > 0; x -= 1) {
              geometry.faces.push(new THREE.Face3(offset + x, offset + x + pts.length, offset + x + pts.length - 1));
              geometry.faces.push(new THREE.Face3(offset + x, offset + x - 1, offset + x + pts.length - 1));
            }
            offset = offset + (pts.length * 2);
          }
        }
      }

      drawRing();
      geometry.mergeVertices();
      return geometry;
    }
  };
});

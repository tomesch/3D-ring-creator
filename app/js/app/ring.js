define(['three'], function (THREE) {
  'use strict';
  var getBezierCurve = function (p0, p3) {
    // http://spencermortensen.com/articles/bezier-circle/
    var kappa = 0.551915024494,
    p1 = p0.clone(),
    p2 = p3.clone(),
    p0AngletoY,
    p3AngletoY,
    curveAngle,
    tangentCoef,
    matrix = new THREE.Matrix4(),
    yAxis = new THREE.Vector3(0, 1, 0);

    // Translate both points into the Y axis so we can mesure the angle to X
    p1.applyMatrix4(matrix.makeTranslation(- p0.x, 0, 0));
    p2.applyMatrix4(matrix.makeTranslation(- p3.x, 0, 0));
    p0AngletoY = p1.angleTo(yAxis);
    p3AngletoY = p2.angleTo(yAxis);

    curveAngle = p1.angleTo(p2);

    // Set angles between 0 and 2*PI
    if (p1.z < 0) {
      p0AngletoY += Math.PI;
    }
    if (p2.z < 0) {
      p3AngletoY += Math.PI;
    }

    // Rotate both points arround X so their angle is 0
    p1.applyMatrix4(matrix.makeRotationX(- p0AngletoY));
    p2.applyMatrix4(matrix.makeRotationX(- p3AngletoY));
    // http://itc.ktu.lt/itc354/Riskus354.pdf
    // http://hansmuller-flex.blogspot.de/2011/04/approximating-circular-arc-with-cubic.html
    tangentCoef = kappa * Math.tan(curveAngle / 2);
    if (Math.round(p3AngletoY) === 0 && p0AngletoY >= Math.PI || p0AngletoY < p3AngletoY) {
      p1.z += p1.y * tangentCoef;
      p2.z -= p2.y * tangentCoef;
    }
    else {
      p1.z -= p1.y * tangentCoef;
      p2.z += p2.y * tangentCoef;
    }

    // Set everything back
    p1.applyMatrix4(matrix.makeTranslation(p0.x, 0, 0));
    p2.applyMatrix4(matrix.makeTranslation(p3.x, 0, 0));
    p1.applyMatrix4(matrix.makeRotationX(p0AngletoY));
    p2.applyMatrix4(matrix.makeRotationX(p3AngletoY));
    return new THREE.CubicBezierCurve3(p0, p1, p2, p3);
  },
  drawRing = function (sections, bezierCurvePoints) {
    var offset = 0,
    i = 0,
    y = 0,
    from,
    to,
    from2,
    to2,
    spline,
    spline2,
    pts,
    pts2,
    x,
    geometry = new THREE.Geometry();

    for (i = 0; i < sections.length; i++) {
      for (y = 0; y < sections[i].vertices.length - 1; y += 1) {
        from = sections[i].vertices[y];
        to = sections[(i + 1) % sections.length].vertices[y];

        from2 = sections[i].vertices[y + 1];
        to2 = sections[(i + 1) % sections.length].vertices[y + 1];

        spline = getBezierCurve(from, to);
        spline2 = getBezierCurve(from2, to2);

        pts = spline.getPoints(bezierCurvePoints);
        pts2 = spline2.getPoints(bezierCurvePoints);

        geometry.vertices = geometry.vertices.concat(pts).concat(pts2);

        for (x = pts.length - 1; x > 0; x -= 1) {
          geometry.faces.push(new THREE.Face3(offset + x, offset + x + pts.length, offset + x + pts.length - 1));
          geometry.faces.push(new THREE.Face3(offset + x, offset + x - 1, offset + x + pts.length - 1));
        }
        offset += pts.length * 2;
      }
    }
    geometry.mergeVertices();
    return geometry;
  },
  Ring = function (sections, radius) {
    this._sections = sections;
    this._radius = radius;
  };
  Ring.prototype.setSections = function (sections) {
    this._sections = sections;
  };
  Ring.prototype.getRadius = function () {
    return this._radius;
  };
  Ring.prototype.getSections = function () {
    return this._sections;
  };
  Ring.prototype.getGeometry = function () {
    var sections = [],
    step = (2 * Math.PI) / this.getSections().length,
    i,
    debugGeometry = new THREE.Geometry();

    for (i = 0; i < this.getSections().length; i++) {
      sections[i] = new THREE.Geometry();
      sections[i].vertices = sections[i].vertices.concat(this._sections[i]);
      sections[i].applyMatrix(new THREE.Matrix4().makeTranslation(0, this.getRadius(), 0));
      sections[i].applyMatrix(new THREE.Matrix4().makeRotationX(i * step));
      debugGeometry.vertices = debugGeometry.vertices.concat(sections[i].vertices);
    }
    return drawRing(sections, 30);
  };
  return Ring;
});

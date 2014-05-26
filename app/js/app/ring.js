define(['three'], function (THREE) {
  'use strict';
  var getBezierCurve = function (p0, p3) {
    // http://spencermortensen.com/articles/bezier-circle/
    var kappa = 0.551915024494,
    p1 = p0.clone(),
    p2 = p3.clone(),
    matrix = new THREE.Matrix4(),
    yAxis = new THREE.Vector3(0, 1, 0),
    p0AngletoY, p3AngletoY, curveAngle, tangentCoef;

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
    var geometry = new THREE.Geometry(),
    lineLength = sections.length * bezierCurvePoints,
    from, to, spline, pts, i, y;
    
    // Add the vertices to the geometry
    for (i = 0; i < sections[0].vertices.length; i++) {
      // vertices per section
      for (y = 0; y < sections.length; y++) {
        // sections per ring
        from = sections[y].vertices[i];
        to = sections[(y + 1) % sections.length].vertices[i];

        spline = getBezierCurve(from, to);
        pts = spline.getPoints(bezierCurvePoints);
        pts = pts.slice(0, pts.length - 1);

        geometry.vertices = geometry.vertices.concat(pts);
      }
    }
    // Add the faces to the geometry
    for (i = 0; i < geometry.vertices.length; i++) {
      if (i < geometry.vertices.length - lineLength) {
        if (i % lineLength === lineLength - 1) {
          // last point of line
          geometry.faces.push(new THREE.Face3(i, i + 1, i + lineLength));
          geometry.faces.push(new THREE.Face3(i + 1, i, i - lineLength + 1));
        }
        else {
          geometry.faces.push(new THREE.Face3(i, i + 1, i + lineLength));
          geometry.faces.push(new THREE.Face3(i + lineLength, i + 1, i + lineLength + 1));
        }
      }
      else {
        if (i % lineLength === lineLength - 1) {
          // last point of line
          geometry.faces.push(new THREE.Face3(i % lineLength, i, (i % lineLength) - lineLength + 1));
          geometry.faces.push(new THREE.Face3(i, i - lineLength  + 1, (i % lineLength) - lineLength + 1));

        }
        else {
          geometry.faces.push(new THREE.Face3(i, i + 1, i % lineLength));
          geometry.faces.push(new THREE.Face3(i % lineLength, i + 1, (i + 1) % lineLength));
        }
      }
    }

    return geometry;
  },
  getGeometry = function (sec, radius, bezierPoints) {
    var sections = [],
    step = (2 * Math.PI) / sec.length,
    i = 0,
    geometry;

    for (i; i < sec.length; i++) {
      sections[i] = new THREE.Geometry();
      sections[i].vertices = sections[i].vertices.concat(sec[i]);
      sections[i].applyMatrix(new THREE.Matrix4().makeTranslation(0, radius, 0));
      sections[i].applyMatrix(new THREE.Matrix4().makeRotationX(i * step));
    }
    geometry = drawRing(sections, bezierPoints);
    geometry = centerGeometry(sec, geometry);
    return geometry;
  },
  getTopVertices = function (bezierPoints, sections) {
    var points = [],
    lineLength = bezierPoints * sections.length,
    facePoints = ((sections[0].length + 2) / 3),
    startIndex = facePoints * lineLength,
    endIndex = startIndex * 2,
    i;

    for (i = startIndex; i < endIndex; i++) {
      points.push(i);
    }

    return points;
  },
  centerGeometry = function (sections, geometry) {
    var innerGeometry = new THREE.Geometry(),
    lineLength = geometry.vertices.length / sections.length,
    facePoints = ((sections[0].length + 2) / 3),
    i, width;

    for (i = 0; i < lineLength; i++) {
      innerGeometry.vertices.push(geometry.vertices[i]);
    }

    for (i = geometry.vertices.length - lineLength; i < geometry.vertices.length; i++) {
      innerGeometry.vertices.push(geometry.vertices[i]);
    }

    innerGeometry.computeBoundingBox();
    width = innerGeometry.boundingBox.max.x - innerGeometry.boundingBox.min.x;
    geometry.applyMatrix(new THREE.Matrix4().makeTranslation(- width / 2, 0, 0));
    return geometry;
  },
  Ring = function (sections, radius, bezierPoints) {
    this._sections = sections;
    this._radius = radius;
    this._curvePoints = bezierPoints;
    this.geometry = getGeometry(sections, radius, bezierPoints);
  };
  
  Ring.prototype.applyHeightmap = function (heightmap) {
    var points = getTopVertices(this._curvePoints, this._sections),
    geometry = this.geometry.clone(),
    i = 0,
    oldY, oldZ, newY, newZ, coef;

    for (i; i < points.length; i++) {
      oldY = geometry.vertices[points[i]].y;
      oldZ = geometry.vertices[points[i]].z;
      
      geometry.vertices[points[i]].normalize();
      newY = geometry.vertices[points[i]].y;
      newZ = geometry.vertices[points[i]].z;

      coef = Math.max(Math.abs(oldY / newY) || 0, Math.abs(oldZ / newZ) || 0);
      geometry.vertices[points[i]].setLength(coef + (heightmap[i] || 0));
    }

    return geometry;
  };

  return Ring;
});

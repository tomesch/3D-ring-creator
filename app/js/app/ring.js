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
    var offset = 0,
    i = 0,
    y = 0,
    geometry = new THREE.Geometry(),
    topVerticesColor = new THREE.Color(0xff0000),
    topVerticesMinIndex = sections[i].vertices.length / sections.length,
    topVerticesMaxIndex = topVerticesMinIndex + (topVerticesMinIndex - 1),
    topVertices = [],
    from, to, spline, pts, x, length, base, base2;
    
    for (i = 0; i < sections.length; i++) {
      for (y = 0; y < sections[i].vertices.length; y++) {
        from = sections[i].vertices[y];
        to = sections[(i + 1) % sections.length].vertices[y];

        spline = getBezierCurve(from, to);
        pts = spline.getPoints(bezierCurvePoints);
        pts = pts.slice(0, pts.length - 1);
        
        geometry.vertices = geometry.vertices.concat(pts);

        for (x = 0; x < pts.length; x++) {
          length = (sections[i].vertices.length) * (pts.length);
          base = y * pts.length;
          base2 = base + pts.length;
          if (i !== 3) {
            if (y < sections[i].vertices.length - 1) {
              if (x !== pts.length - 1) {
                geometry.faces.push(new THREE.Face3(offset + x, offset + x + 1, offset + x + pts.length));
                geometry.faces.push(new THREE.Face3(offset + x + pts.length, offset + x + 1, offset + x + pts.length + 1));
              }
              else {
                geometry.faces.push(new THREE.Face3(offset + x + pts.length, offset + x, offset + length));
                geometry.faces.push(new THREE.Face3(offset + length + pts.length, offset + x + pts.length, offset + length));
              }
            }
            else {
              if (x !== pts.length - 1) {
                geometry.faces.push(new THREE.Face3(offset - length + x + pts.length, offset + x, offset + x + 1));
                geometry.faces.push(new THREE.Face3(offset - length + x + pts.length, offset + x + 1, offset - length + x + pts.length + 1));
              }
              else {
                geometry.faces.push(new THREE.Face3(offset + x, offset + length, length * (i + 1)));
                geometry.faces.push(new THREE.Face3(offset + x, length * (i + 1), length * (i) + x));
              }
            }
          }
          else {
            if (y < sections[i].vertices.length - 1) {
              if (x !== pts.length - 1) {
                geometry.faces.push(new THREE.Face3(offset + x, offset + x + 1, offset + x + pts.length));
                geometry.faces.push(new THREE.Face3(offset + x + pts.length, offset + x + 1, offset + x + pts.length + 1));
              }
              else {
                geometry.faces.push(new THREE.Face3(offset + x + pts.length, offset + x, base));
                geometry.faces.push(new THREE.Face3(base, base2, offset + x + pts.length));
              }
            }
            else {
              if (x !== pts.length - 1) {
                geometry.faces.push(new THREE.Face3(offset + x, offset + x + 1, offset - length + x + pts.length));
                geometry.faces.push(new THREE.Face3(offset - length + x + pts.length, offset + x + 1, offset - length + x + pts.length + 1));
              }
              else {
                geometry.faces.push(new THREE.Face3(offset + x, base, 0));
                geometry.faces.push(new THREE.Face3(offset + x, 0, length * (i) + x));
              }
            }
          }
        }
        offset += pts.length;
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
  getTopVertices = function (bezierPoints, sectionPoints) {
    var points = [],
    facePoints = (sectionPoints / 4) + 1,
    startIndex = (facePoints - 1) * (bezierPoints - 1),
    endIndex = startIndex + (bezierPoints * (facePoints - 1)),
    portionPoints = sectionPoints * (bezierPoints - 1),
    offset = 0,
    i, y, x;

    for (i = 1; i < facePoints - 1; i++) {
      for (y = 0; y < 4; y++) {
        for (x = 0; x < bezierPoints - 1; x++) {
          points.push(offset + startIndex + (i * (bezierPoints - 1)) + x);
        }
        offset += portionPoints;
      }
      offset = 0;
    }
    return points;
  },
  centerGeometry = function (sections, geometry) {
    var innerGeometry = new THREE.Geometry(),
    facePoints = sections[0].length / 4,
    startIndex = facePoints * 3,
    endIndex = facePoints * 4,
    i, y, width;

    for (i = 0; i < sections.length; i++) {
      for (y = startIndex; y < endIndex; y++) {
        innerGeometry.vertices.push(sections[i][y]);
      }
    }

    innerGeometry.computeBoundingBox();
    width = innerGeometry.boundingBox.max.x - innerGeometry.boundingBox.min.x;
    geometry.applyMatrix(new THREE.Matrix4().makeTranslation(- width / 2, 0, 0));
    return geometry;
  },
  Ring = function (sections, radius, bezierPoints) {
    this._sections = sections;
    this._radius = radius;
    this._curvePoints = bezierPoints + 1;
    this.geometry = getGeometry(sections, radius, bezierPoints);
  };
  
  Ring.prototype.applyHeightmap = function (heightmap) {
    var points = getTopVertices(this._curvePoints, this._sections[0].length),
    i = 0,
    oldY, oldZ, newY, newZ, coef;

    for (i; i < points.length; i++) {
      oldY = this.geometry.vertices[points[i]].y;
      oldZ = this.geometry.vertices[points[i]].z;
      
      this.geometry.vertices[points[i]].normalize();
      newY = this.geometry.vertices[points[i]].y;
      newZ = this.geometry.vertices[points[i]].z;

      coef = Math.max(Math.abs(oldY / newY) || 0, Math.abs(oldZ / newZ) || 0);
      this.geometry.vertices[points[i]].setLength(coef + heightmap[i]);
    }
  };

  return Ring;
});

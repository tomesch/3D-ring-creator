define(['three', 'threejs/scene', 'threejs/cameras', 'threejs/renderer', 'threejs/materials', 'ring', 'threejs/controls', 'threejs/exporters', 'two', 'twojs/scene', 'section', 'fileselector', 'filters', 'heightmap', 'constraints', 'gui', 'threejs/lights'], function (THREE, scene, camera, renderer, material, Ring, controls, exporters, Two, TwoScene, section, selector, Filter, Heightmap, Constraint, gui, lights) {
  'use strict';
  var app = {
    mesh: null,
    sections: [],
    init: function () {
      var twoContainers = document.getElementsByClassName('twojs-container'),
      twoScenes = [],
      i = 0,
      twoScene;

      this.handleEvents(function () {
        gui.init();

        for (i; i < twoContainers.length; i += 1) {
          twoScene = new TwoScene(twoContainers[i]);
          twoScenes.push(twoScene);
          this.sections.push(section(twoScene));
          twoScene.update();
        }

        // Add point light to the scene
        scene.add(lights.point);

        // Create the ring
        this.createRing(this.sections, gui.param.circumference);

      }.bind(this));
    },
    handleEvents: function (next) {
      controls.orbit.addEventListener('change', function () {
        this.render();
      }.bind(this));

      window.addEventListener('import', function () {
        selector.select();
      }.bind(this));

      window.addEventListener('export', function () {
        exporters.obj(this.mesh.geometry);
      }.bind(this));

      window.addEventListener('sectionchange', function () {
        this.updateRing(this.sections, gui.param.circumference);
      }.bind(this));

      window.addEventListener('circumferencechange', function () {
        this.updateRing(this.sections, gui.param.circumference);
      }.bind(this));

      window.addEventListener('filechange', function () {
        selector.getSelectedFile();
      }.bind(this));

      window.addEventListener('filereadcomplete', function () {
        var filter = new Filter(selector.getInputData()),
        imgData = filter.setGrayScale(),
        heightmap = null,
        arrHeightmap = null,
        worker = new Worker('js/app/web_worker_is_heightmap_valid.js');

        // Apply filter on the image
        selector.setImageDataInContext(imgData);

        // Create the heightmap
        heightmap = new Heightmap(imgData);
        arrHeightmap = heightmap.getHeightMap(3 * 255);

        worker.onmessage = function (e) {
          //Send request
          if (e.data === 'Ready') {
            worker.postMessage({ heightmap: arrHeightmap, width: imgData.width, maxSlope: 500});
          }
          //Receive result
          else {
            alert('Heightmap is ' + (e.data ? '' : 'not ') + 'valid');
          }
        };
        //Initialize the worker
        worker.postMessage();
      }.bind(this));

      if (next) {
        next();
      }
    },
    createRing: function (sections, circumference) {
      function twoTothree(vertices) {
        var pts = [],
        i = 0,
        p0, p0three, p1three, p2three, p3, p3three, curve, curvePoints;

        for (i; i < vertices.length; i++) {
          p0 = vertices[i];
          p0three = new THREE.Vector3(p0.x / 10, p0.y / 10, 0);
          p3 = vertices[(i + 1) % vertices.length];
          p3three = new THREE.Vector3(p3.x / 10, p3.y / 10, 0);

          p1three = new THREE.Vector3(p0.controls.right.x / 10, p0.controls.right.y / 10, 0);
          p2three = new THREE.Vector3(p3.controls.left.x / 10, p3.controls.left.y / 10, 0);

          curve = new THREE.CubicBezierCurve3(p0three, p1three, p2three, p3three);
          curvePoints = curve.getPoints(75);
          curvePoints = curvePoints.slice(0, curvePoints.length - 1);
          pts = pts.concat(curvePoints);
        }
        return pts;
      }
      var scts = [],
      radius = circumference / (Math.PI * 2),
      ring;
      
      this.sections.forEach(function (val) {
        scts.push(twoTothree(val.vertices));
      });

      ring = new Ring(scts, radius, 50);
      //ring.applyHeightmap([]);

      this.mesh = new THREE.Mesh(ring.geometry, material.shiny);
      this.mesh.geometry.computeCentroids();
      this.mesh.geometry.computeFaceNormals();
      scene.add(this.mesh);

      controls.orbit.update();
    },
    updateRing: function (sections, circumference) {
      function twoTothree(vertices) {
        var pts = [],
        i = 0,
        p0, p0three, p1three, p2three, p3, p3three, curve, curvePoints;

        for (i; i < vertices.length; i++) {
          p0 = vertices[i];
          p0three = new THREE.Vector3(p0.x / 10, p0.y / 10, 0);
          p3 = vertices[(i + 1) % vertices.length];
          p3three = new THREE.Vector3(p3.x / 10, p3.y / 10, 0);

          p1three = new THREE.Vector3(p0.controls.right.x / 10, p0.controls.right.y / 10, 0);
          p2three = new THREE.Vector3(p3.controls.left.x / 10, p3.controls.left.y / 10, 0);

          curve = new THREE.CubicBezierCurve3(p0three, p1three, p2three, p3three);
          curvePoints = curve.getPoints(75);
          curvePoints = curvePoints.slice(0, curvePoints.length - 1);
          pts = pts.concat(curvePoints);
        }
        return pts;
      }
      var scts = [],
      radius = circumference / (Math.PI * 2),
      ring;
      
      this.sections.forEach(function (val) {
        scts.push(twoTothree(val.vertices));
      });

      ring = new Ring(scts, radius,  50);
      //ring.applyHeightmap([]);
      this.mesh.geometry.vertices = ring.geometry.vertices;
      this.mesh.geometry.computeCentroids();
      this.mesh.geometry.computeFaceNormals();
      this.mesh.geometry.verticesNeedUpdate = true;
      this.mesh.geometry.normalsNeedUpdate = true;
      controls.orbit.update();
    },
    render: function () {
      lights.point.position = camera.position;
      renderer.render(scene, camera);
    },
    dev: function () {
      var axisHelper = new THREE.AxisHelper(100),
      gridHelper = new THREE.GridHelper(100, 50);
      scene.add(axisHelper);
      scene.add(gridHelper);
    }
  };
  return app;
});

define(['three', 'threejs/scene', 'threejs/cameras', 'threejs/renderer', 'threejs/materials', 'ring', 'threejs/controls', 'threejs/exporters', 'two', 'twojs/scene', 'section', 'fileselector', 'filters', 'heightmap', 'gui'], function (THREE, scene, camera, renderer, material, Ring, controls, exporters, Two, TwoScene, section, Selector, Filter, Heightmap, gui) {
  'use strict';
  var app = {
    init: function () {
      var ring,
      mesh,
      twoContainers = document.getElementsByClassName('twojs-container'),
      twoScenes = [],
      i = 0,
      twoScene,
      sections = [],
      fileselector = new Selector(document.getElementById('inputFile'), document.getElementById('imgCanvas'));

      gui.init();

      for (i; i < twoContainers.length; i += 1) {
        twoScene = new TwoScene(twoContainers[i]);
        twoScenes.push(twoScene);
        sections.push(section(twoScene));
        twoScene.update();
      }

      mesh = this.updateRing(sections, gui.param.circumference);

      window.addEventListener('sectionchange', function () {
        this.updateRing(sections, gui.param.circumference);
      }.bind(this));

      window.addEventListener('circumferencechange', function () {
        console.log(gui);
        this.updateRing(sections, gui.param.circumference);
      }.bind(this));

      window.addEventListener('filechange', function () {
        // Load the selected file
        fileselector.getSelectedFile();
      });

      window.addEventListener('filereadcomplete', function () {
        var
        filter = new Filter(fileselector.getInputData()),
        imgData = filter.setGrayScale(),
        heightmap = null,
        arrHeightmap = null;

        // Apply filter on the image
        fileselector.setImageDataInContext(imgData);

        // Create the heightmap scale 32
        heightmap = new Heightmap(imgData);
        arrHeightmap = heightmap.getHeightMap(32);
      });
    },
    updateRing: function (sections, circumference) {
      function twoTothree(vertices) {
        var pts = [],
        i = 0,
        p0,
        p0three,
        p1three,
        p2three,
        p3,
        p3three,
        curve;

        for (i; i < vertices.length; i++) {
          p0 = vertices[i];
          p0three = new THREE.Vector3(p0.x / 10, p0.y / 10, 0);
          p3 = vertices[(i + 1) % vertices.length];
          p3three = new THREE.Vector3(p3.x / 10, p3.y / 10, 0);

          p1three = new THREE.Vector3(p0.controls.right.x / 10, p0.controls.right.y / 10, 0);
          p2three = new THREE.Vector3(p3.controls.left.x / 10, p3.controls.left.y / 10, 0);

          curve = new THREE.CubicBezierCurve3(p0three, p1three, p2three, p3three);
          pts = pts.concat(curve.getPoints(20));
        }

        return pts;
      }
      var scts = [],
      radius = circumference / (Math.PI * 2),
      ring, mesh;
      sections.forEach(function (val) {
        scts.push(twoTothree(val.vertices));
      });
      ring = new Ring(scts, radius);
      mesh = new THREE.Mesh(ring.getGeometry(), material.wire);
      //mesh = new THREE.Line(ring.getGeometry(), material.line);

      this.clearScene();
      scene.add(mesh);
    },
    clearScene: function () {
      var obj, i;
      for (i = scene.children.length - 1; i >= 0 ; i --) {
        obj = scene.children[i];
        if (obj !== camera) {
          scene.remove(obj);
        }
      }
    },
    animate: function () {
      window.requestAnimationFrame(app.animate);
      controls.orbit.update();
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

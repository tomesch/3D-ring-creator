define(['three', 'threejs/scene', 'threejs/cameras', 'threejs/renderer', 'threejs/materials', 'ring', 'threejs/controls', 'threejs/exporters', 'two', 'twojs/scene', 'section', 'fileselector', 'filters', 'heightmap'], function (THREE, scene, camera, renderer, material, Ring, controls, exporters, Two, TwoScene, section, Selector, Filter, Heightmap) {
  'use strict';
  var app = {
    init: function () {
      var test = [[
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
      ring = new Ring(test, 10),
      mesh = new THREE.Mesh(ring.getGeometry(), material.wire),
      twoContainers = document.getElementsByClassName('twojs-container'),
      twoScenes = [],
      i = 0,
      twoScene,
      sections = [],
      fileselector = new Selector(document.getElementById('inputFile'), document.getElementById('imgCanvas'));

      scene.add(mesh);

      for (i; i < twoContainers.length; i += 1) {
        twoScene = new TwoScene(twoContainers[i]);
        twoScenes.push(twoScene);
        sections.push(section(twoScene));
        twoScene.update();
      }

      window.addEventListener('sectionchange', function () {
        var scts = [];
        sections.forEach(function (val) {
          scts.push(twoTothree(val.vertices));
        });
        ring = new Ring(scts, 10);
        scene.remove(mesh);
        mesh = new THREE.Mesh(ring.getGeometry(), material.wire);
        scene.add(mesh);
      });

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

      function twoTothree(vertices) {
        var pts = [];
        vertices.forEach(function (val) {
          pts.push(new THREE.Vector3(val.x / 10, val.y / 10, 0));
        });
        pts.push(new THREE.Vector3(vertices[0].x / 10, vertices[0].y / 10, 0));
        return pts;
      }

    },
    animate: function () {
      window.requestAnimationFrame(app.animate);
      controls.orbit.update();
      renderer.render(scene, camera);
    },
    dev: function () {
      var axisHelper = new THREE.AxisHelper(100),
      gridHelper = new THREE.GridHelper(100, 10);
      scene.add(axisHelper);
      scene.add(gridHelper);
    }
  };
  return app;
});
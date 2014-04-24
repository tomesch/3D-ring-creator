define(['two'], function (Two) {
  'use strict';
  var addInteractivity = function addInteractivity(point, scene) {
    var sectionchange = new Event('sectionchange'),
    offset = point.parent.translation,
    dom = scene.renderer.domElement.querySelector('#two-' + point.id),
    drag = function (e) {
      var x = (e.clientX - scene.renderer.domElement.offsetLeft) - offset.x,
      y = (e.clientY - scene.renderer.domElement.offsetTop) - offset.y;

      e.preventDefault();
      point.translation.set(x, y);
    },
    dragEnd = function (e) {
      e.preventDefault();
      window.removeEventListener('mousemove', drag);
      window.removeEventListener('mouseup', dragEnd);
      window.dispatchEvent(sectionchange);
    };

    dom.addEventListener('mousedown', function (e) {
      e.preventDefault();
      window.addEventListener('mousemove', drag);
      window.addEventListener('mouseup', dragEnd);
    });
  };
  return function (scene) {
    var anchors = [],
    group = scene.makeGroup(),
    i = 0,
    circleRadius = 4,
    editColor = 'rgb(79, 128, 255)',
    polygon,
    resize,
    rect;

    anchors.push(new Two.Vector(0, 0));
    anchors.push(new Two.Anchor(0, 50, 0, 50, 0, 50, Two.Commands.curve));
    anchors.push(new Two.Anchor(25, 50, 25, 50, 25, 50, Two.Commands.curve));
    anchors.push(new Two.Anchor(50, 50, 50, 50, 50, 50, Two.Commands.curve));
    anchors.push(new Two.Vector(50, 0));

    polygon = new Two.Polygon(anchors, true, false);
    polygon.fill = '#f2f6ff';
    rect = polygon.getBoundingClientRect();
    group.translation.set(scene.width / 2 - rect.width / 2, scene.height / 2 - rect.height / 2);
    polygon.addTo(group);

    polygon.vertices.forEach(function (an) {
      var p, l, r, ll, rl;

      p = scene.makeCircle(0, 0, circleRadius);
      p.translation.copy(an);
      p.noStroke().fill = editColor;
    
      if (an.controls) {
        l = scene.makeCircle(0, 0, circleRadius);
        r = scene.makeCircle(0, 0, circleRadius);

        l.translation.copy(an.controls.left);
        r.translation.copy(an.controls.right);

        l.noStroke().fill = '#F00';
        r.noStroke().fill = '#F00';

        ll = new Two.Polygon([
          new Two.Anchor().copy(p.translation),
          new Two.Anchor().copy(l.translation)
        ]);
        rl = new Two.Polygon([
          new Two.Anchor().copy(p.translation),
          new Two.Anchor().copy(r.translation)
        ]);

        rl.noFill().stroke = ll.noFill().stroke = '#F00';

        group.add(p, l, r, rl, ll);

        p.translation.bind(Two.Events.change, function () {
          an.copy(this);
          l.translation.copy(an.controls.left).addSelf(this);
          r.translation.copy(an.controls.right).addSelf(this);
          ll.vertices[0].copy(this);
          rl.vertices[0].copy(this);
          ll.vertices[1].copy(l.translation);
          rl.vertices[1].copy(r.translation);
        });

        l.translation.bind(Two.Events.change, function () {
          an.controls.left.copy(this).subSelf(an);
          ll.vertices[1].copy(this);
        });

        r.translation.bind(Two.Events.change, function () {
          an.controls.right.copy(this).subSelf(an);
          rl.vertices[1].copy(this);
        });

        addInteractivity(p, scene);
        addInteractivity(l, scene);
        addInteractivity(r, scene);
      }
      else {
        p.translation.bind(Two.Events.change, function () {
          an.copy(this);
        });
        group.add(p);
        addInteractivity(p, scene);
      }
    });

    return polygon;
  };
});
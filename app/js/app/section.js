define(['two'], function (Two) {
  'use strict';
  var addInteractivity = function addInteractivity(point, scene, base) {
    var sectionchange = new Event('sectionchange'),
    offset = point.parent.translation,
    dom = scene.renderer.domElement.querySelector('#two-' + point.id),
    drag = function (e) {
      var x = (e.clientX - scene.renderer.domElement.offsetLeft) - offset.x,
      y = (e.clientY - scene.renderer.domElement.offsetTop) - offset.y;
      e.preventDefault();
      if (base) {
        point.translation.x = x;
      }
      else {
        point.translation.set(x, y);
      }
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
    polygon, rect;

    anchors.push(new Two.Anchor(0, 0, 0, 0, 0, 0, Two.Commands.move));
    anchors.push(new Two.Anchor(0, 50, -10, 50, 0, 70, Two.Commands.curve));
    anchors.push(new Two.Anchor(50, 50, 50, 70, 60, 50, Two.Commands.curve));
    anchors.push(new Two.Anchor(50, 0, 50, 0, 50, 0, Two.Commands.curve));

    polygon = new Two.Polygon(anchors, true, true, true);
    polygon.fill = '#f2f6ff';
    rect = polygon.getBoundingClientRect();
    group.translation.set(scene.width / 2 - rect.width / 2, scene.height / 2 - rect.height / 2);
    polygon.addTo(group);

    polygon.vertices.forEach(function (an) {
      var p, l, r, ll, rl;

      p = scene.makeCircle(0, 0, circleRadius);
      p.translation.copy(an);
      p.noStroke().fill = '#F00';

      if (an.controls) {
        if (i === 0) {
          r = scene.makeCircle(0, 0, circleRadius);
          r.translation.copy(an.controls.right);
          r.noStroke().fill = '#00F';
          rl = new Two.Polygon([
            new Two.Anchor().copy(p.translation),
            new Two.Anchor().copy(r.translation)
          ]);
          rl.noFill().stroke = '#00F';
          group.add(p, r, rl);
          r.translation.bind(Two.Events.change, function () {
            an.controls.right.copy(this);
            rl.vertices[1].copy(this);
          });
          addInteractivity(r, scene);
          addInteractivity(p, scene, true);

          p.translation.bind(Two.Events.change, function () {
            var difx  = this.x - an.x,
            dify = this.y - an.y;

            an.copy(this);

            r.translation.x += difx;
            r.translation.y += dify;

            rl.vertices[0].copy(this);
            rl.vertices[1].copy(r.translation);
          });
        }
        else if (i === 3) {
          l = scene.makeCircle(0, 0, circleRadius);
          l.translation.copy(an.controls.left);
          l.noStroke().fill = '#00F';
          ll = new Two.Polygon([
            new Two.Anchor().copy(p.translation),
            new Two.Anchor().copy(l.translation)
          ]);
          ll.noFill().stroke = '#00F';
          group.add(p, l, ll);
          l.translation.bind(Two.Events.change, function () {
            an.controls.left.copy(this);
            ll.vertices[1].copy(this);
          });
          addInteractivity(l, scene);
          addInteractivity(p, scene, true);

          p.translation.bind(Two.Events.change, function () {
            var difx  = this.x - an.x,
            dify = this.y - an.y;

            an.copy(this);

            l.translation.x += difx;
            l.translation.y += dify;

            ll.vertices[0].copy(this);
            ll.vertices[1].copy(l.translation);
          });
        }
        else {
          l = scene.makeCircle(0, 0, circleRadius);
          r = scene.makeCircle(0, 0, circleRadius);

          l.translation.copy(an.controls.left);
          r.translation.copy(an.controls.right);

          l.noStroke().fill = '#00F';
          r.noStroke().fill = '#0F0';

          ll = new Two.Polygon([
            new Two.Anchor().copy(p.translation),
            new Two.Anchor().copy(l.translation)
          ]);
          rl = new Two.Polygon([
            new Two.Anchor().copy(p.translation),
            new Two.Anchor().copy(r.translation)
          ]);

          rl.noFill().stroke = '#0F0';
          ll.noFill().stroke = '#00F';

          group.add(p, l, r, rl, ll);

          p.translation.bind(Two.Events.change, function () {
            var difx  = this.x - an.x,
            dify = this.y - an.y;

            an.copy(this);

            l.translation.x += difx;
            l.translation.y += dify;
            r.translation.x += difx;
            r.translation.y += dify;

            ll.vertices[0].copy(this);
            rl.vertices[0].copy(this);
            ll.vertices[1].copy(l.translation);
            rl.vertices[1].copy(r.translation);
          });

          l.translation.bind(Two.Events.change, function () {
            an.controls.left.copy(this);
            ll.vertices[1].copy(this);
          });

          r.translation.bind(Two.Events.change, function () {
            an.controls.right.copy(this);
            rl.vertices[1].copy(this);
          });

          addInteractivity(p, scene);
          addInteractivity(l, scene);
          addInteractivity(r, scene);
        }
      }
      else {
        p.translation.bind(Two.Events.change, function () {
          an.copy(this);
        });
        group.add(p);
        addInteractivity(p, scene);
      }
      i++;
    });
    //group.rotation = Math.PI;
    return polygon;
  };
});

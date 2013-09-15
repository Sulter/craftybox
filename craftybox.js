// Generated by CoffeeScript 1.3.1
(function() {
  var b2AABB, b2Body, b2BodyDef, b2CircleShape, b2ContactListener, b2DebugDraw, b2Fixture, b2FixtureDef, b2MassData, b2PolygonShape, b2Vec2, b2World, b2WorldManifold, _ref, _ref1, _ref2,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __slice = [].slice;

  b2Vec2 = Box2D.Common.Math.b2Vec2;

  _ref = Box2D.Dynamics, b2BodyDef = _ref.b2BodyDef, b2Body = _ref.b2Body, b2FixtureDef = _ref.b2FixtureDef, b2Fixture = _ref.b2Fixture, b2World = _ref.b2World, b2DebugDraw = _ref.b2DebugDraw, b2ContactListener = _ref.b2ContactListener;

  _ref1 = Box2D.Collision, b2AABB = _ref1.b2AABB, b2WorldManifold = _ref1.b2WorldManifold, (_ref2 = _ref1.Shapes, b2MassData = _ref2.b2MassData, b2PolygonShape = _ref2.b2PolygonShape, b2CircleShape = _ref2.b2CircleShape);

  /*
  # #Box2D
  # @category Physics
  # Creates itself in a Box2D World. Crafty.Box2D.init() will be automatically called
  # if it is not called already (hence the world element doesn't exist).
  # In order to create a Box2D object, a body definition of position and dynamic is need.
  # The world will use this bodyDef to create a body. A fixture definition with geometry,
  # friction, density, etc is also required. Then create shapes on the body.
  # The body will be created during the .attr call instead of init.
  */


  Crafty.c("Box2D", (function() {
    /*
      PRIVATE
    */

    var SCALE, _arrayToVector, _body, _bodyTypes, _configureFixtureDef, _createBody, _fixDef;
    _fixDef = null;
    _body = null;
    SCALE = null;
    _bodyTypes = ["static", "kinematic", "dynamic"];
    _createBody = function(x, y, ent) {
      var bodyDef;
      if (_body != null) {
        return;
      }
      bodyDef = new b2BodyDef;
      bodyDef.position.Set(x / SCALE, y / SCALE);
      _body = Crafty.Box2D.world.CreateBody(bodyDef);
      ent.x = x;
      ent.y = y;
      return _body.SetUserData(ent);
    };
    _configureFixtureDef = function(attrs, shape) {
      var _ref3, _ref4, _ref5;
      if (!(_fixDef != null)) {
        _fixDef = new b2FixtureDef;
      }
      if (attrs != null) {
        if (attrs.density != null) {
          _fixDef.density = attrs.density;
        }
        if (attrs.friction != null) {
          _fixDef.friction = attrs.friction;
        }
        if (attrs.isSensor != null) {
          _fixDef.isSensor = attrs.isSensor;
        }
        if (attrs.restitution != null) {
          _fixDef.restitution = attrs.restitution;
        }
        if (attrs.userData != null) {
          _fixDef.userData = attrs.userData;
        }
        if (((_ref3 = attrs.filter) != null ? _ref3.categoryBits : void 0) != null) {
          _fixDef.filter.categoryBits = attrs.filter.categoryBits;
        }
        if (((_ref4 = attrs.filter) != null ? _ref4.groupIndex : void 0) != null) {
          _fixDef.filter.groupIndex = attrs.filter.groupIndex;
        }
        if (((_ref5 = attrs.filter) != null ? _ref5.maskBits : void 0) != null) {
          _fixDef.filter.maskBits = attrs.filter.maskBits;
        }
      }
      _fixDef.shape = shape;
      return _body.CreateFixture(_fixDef);
    };
    _arrayToVector = function(pointAsArray) {
      return new b2Vec2(pointAsArray[0] / SCALE, pointAsArray[1] / SCALE);
    };
    return {
      /*
        PUBLIC
      */

      /*
        #.body
        @comp Box2D
        The `b2Body` from Box2D, created by `Crafty.Box2D.world` during `.attr({x, y})` call.
        Shape can be attached to it if more params added to `.attr` call, or through
        `.circle`, `.rectangle`, or `.polygon` method.
        Those helpers also create a body if @x and @y available and no body was created.
      */

      init: function() {
        var _this = this;
        _fixDef = null;
        _body = null;
        SCALE = null;
        this.addComponent("2D");
        if (!(Crafty.Box2D.world != null)) {
          Crafty.Box2D.init();
        }
        SCALE = Crafty.Box2D.SCALE;
        this.__defineGetter__('body', function() {
          return _body;
        });
        /*
            Update the entity by using Box2D's attributes.
        */

        this.bind("EnterFrame", function() {
          var angle, pos;
          if ((_this.body != null) && _this.body.IsAwake()) {
            var rounded_x, rounded_y, rounded_angle;
            pos = _this.body.GetPosition();
            angle = Crafty.math.radToDeg(_this.body.GetAngle());
            rounded_x = Math.round(pos.x * SCALE);
            rounded_y = Math.round(pos.y * SCALE);
            rounded_angle = Math.round(angle);
            
            if (rounded_x !== _this.x) {
              _this.x = rounded_x;
            }
            if (rounded_y !== _this.y) {
              _this.y = rounded_y;
            }
            if (rounded_angle !== _this.rotation) {
              return _this.rotation = rounded_angle;
            }
          }
        });
        /*
            Add this body to a list to be destroyed on the next step.
            This is to prevent destroying the bodies during collision.
        */

        return this.bind("Remove", function() {
          if (_this.body != null) {
            return Crafty.Box2D.destroy(_this.body);
          }
        });
      },
      bodyType: function(bodyType) {
        if (!(bodyType != null)) {
          return _bodyTypes[_body.GetType()];
        }
        if (__indexOf.call(_bodyTypes, bodyType) >= 0) {
          _body.SetType(b2Body["b2_" + bodyType + "Body"]);
        }
        return this;
      },
      /*
        #.circle
        @comp Box2D
        @sign public this .circle(Number radius)
        @param radius - The radius of the circle to create
        Attach a circle shape to entity's existing body.
        @example 
        ~~~
        this.attr({x: 10, y: 10, r:10}) // called internally
        this.attr({x: 10, y: 10}).circle(10) // called explicitly
        ~~~
      */

      circle: function(radius, x, y, attrs) {
        var shape;
        if (x == null) {
          x = this.x;
        }
        if (y == null) {
          y = this.y;
        }
        if (arguments.length === 2 && typeof arguments[1] === "object") {
          attrs = x;
          x = this.x;
        }
        _createBody(x, y, this);
        this.w = this.h = radius * 2;
        shape = new b2CircleShape(radius / SCALE);
        shape.SetLocalPosition(new b2Vec2(radius / SCALE, radius / SCALE));
        _configureFixtureDef(attrs, shape);
        return this;
      },
      /*
        #.rectangle
        @comp Box2D
        @sign public this .rectangle(Number w, Number h)
        @param w - The width of the rectangle to create
        @param h - The height of the rectangle to create
        Attach a rectangle or square shape to entity's existing body.
        @example 
        ~~~
        this.attr({x: 10, y: 10, w:10, h: 15}) // called internally
        this.attr({x: 10, y: 10}).rectangle(10, 15) // called explicitly
        this.attr({x: 10, y: 10}).rectangle(10, 10) // a square
        this.attr({x: 10, y: 10}).rectangle(10) // also square!!!
        ~~~
      */

      rectangle: function(w, h, x, y, attrs) {
        var hH, hW, shape;
        this.w = w;
        this.h = h;
        if (x == null) {
          x = this.x;
        }
        if (y == null) {
          y = this.y;
        }
        if (arguments.length === 3 && typeof arguments[2] === "object") {
          attrs = x;
          x = this.x;
        }
        _createBody(x, y, this);
        shape = new b2PolygonShape;
        hW = w / 2 / SCALE;
        hH = h / 2 / SCALE;
        shape.SetAsOrientedBox(hW, hH, new b2Vec2(hW, hH));
        _configureFixtureDef(attrs, shape);
        return this;
      },
      /*
        #.polygon
        @comp Box2D
        @sign public this .polygon(Array vertices)
        @sign public this .polygon(Array point, Array point[, Array point...])
        @param vertices - vertices array as an argument where index 0 is the x position
        and index 1 is the y position. Can also simply put each point as an argument.
        Attach a polygon to entity's existing body. When creating a polygon for an entity,
        each point should be offset or relative from the entities `x` and `y`
        @example
        ~~~
        this.attr({x: 10, y: 10}).polygon([[50,0],[100,100],[0,100]])
        this.attr({x: 10, y: 10}).polygon([50,0],[100,100],[0,100])
      */

      polygon: function(vertices, x, y, attrs) {
        var polygon, shape, vertex;
        if (x == null) {
          x = this.x;
        }
        if (y == null) {
          y = this.y;
        }
        if (arguments.length === 2 && typeof arguments[1] === "object") {
          attrs = x;
          x = this.x;
        }
        polygon = new Crafty.math.Polygon(vertices);
        /* Calculate the convex hull to ensure a clock-wise convex
        */

        vertices = polygon.convexHull();
        _createBody(x, y, this);
        shape = new b2PolygonShape;
        shape.SetAsArray((function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = vertices.length; _i < _len; _i++) {
            vertex = vertices[_i];
            _results.push(_arrayToVector(vertex));
          }
          return _results;
        })(), vertices.length);
        _configureFixtureDef(attrs, shape);
        return this;
      },
      /*
        #.hit
        @comp Box2D
        @sign public Boolean/Array hit(String component)
        @param component - Component to check collisions for
        @return `false if no collision. If a collision is detected, return an Array of
        objects that are colliding, with the type of collision, and the contact points.
        The contact points has at most two points for polygon and one for circle.
        ~~~
        [{
          obj: [entity],
          type: "Box2D",
          points: [Vector[, Vector]]
        }]
      */

      hit: function(component) {
        var contactEdge, contactPoints, finalresult, manifold, otherEntity;
        contactEdge = this.body.GetContactList();
        if (!(contactEdge != null)) {
          return false;
        }
        otherEntity = contactEdge.other.GetUserData();
        if (!otherEntity.has(component)) {
          return false;
        }
        if (!contactEdge.contact.IsTouching()) {
          return false;
        }
        finalresult = [];
        manifold = new b2WorldManifold();
        contactEdge.contact.GetWorldManifold(manifold);
        contactPoints = manifold.m_points;
        finalresult.push({
          obj: otherEntity,
          type: "Box2D",
          points: contactPoints
        });
        return finalresult;
      },
      /*
        #.onHit
        @comp Box2D
        @sign public this .onHit(String component, Function beginContact[, Function endContact])
        @param component - Component to check collisions for
        @param beginContact - Callback method to execute when collided with component, 
        @param endContact - Callback method executed once as soon as collision stops
        Invoke the callback(s) if collision detected through contact listener. We don't bind
        to EnterFrame, but let the contact listener in the Box2D world notify us.
      */

      onHit: function(component, beginContact, endContact) {
        var _this = this;
        if (component !== "Box2D") {
          return this;
        }
        this.bind("BeginContact", function(_arg) {
          var hitData, points, target;
          target = _arg.target, points = _arg.points;
          hitData = [
            {
              obj: target,
              type: "Box2D",
              points: points
            }
          ];
          return beginContact.call(_this, hitData);
        });
        if (typeof endContact === "function") {
          this.bind("EndContact", function(obj) {
            return endContact.call(_this, obj);
          });
        }
        return this;
      }
    };
  })());

  /*
  # #Crafty.Box2D
  # @category Physics
  # Dealing with Box2D
  */


  Crafty.extend({
    Box2D: (function() {
      /*
          PRIVATE
      */

      var _SCALE, _setContactListener, _setDebugDraw, _toBeRemoved, _world;
      _SCALE = 30;
      /*
          # #Crafty.Box2D.world
          # @comp Crafty.Box2D
          # This will return the Box2D world object through a getter,
          # which is a container for bodies and joints.
          # It will have 0 gravity when initialized.
          # Gravity can be set through a setter:
          # Crafty.Box2D.gravity = {x: 0, y:10}
      */

      _world = null;
      /*
          A list of bodies to be destroyed in the next step. Usually during
          collision step, it's bad to destroy bodies.
      */

      _toBeRemoved = [];
      /* 
      Setting up contact listener to notify the concerned entities based on
      the entify reference in their body's user data that we set during the
      construction of the body. We don't keep track of the contact but let 
      the entities handle the collision.
      */

      _setContactListener = function() {
        var contactListener;
        contactListener = new b2ContactListener;
        contactListener.BeginContact = function(contact) {
          var contactPoints, entityA, entityB, manifold;
          entityA = contact.GetFixtureA().GetBody().GetUserData();
          entityB = contact.GetFixtureB().GetBody().GetUserData();
          manifold = new b2WorldManifold();
          contact.GetWorldManifold(manifold);
          contactPoints = manifold.m_points;
          entityA.trigger("BeginContact", {
            points: contactPoints,
            target: entityB
          });
          return entityB.trigger("BeginContact", {
            points: contactPoints,
            target: entityA
          });
        };
        contactListener.EndContact = function(contact) {
          var entityA, entityB;
          entityA = contact.GetFixtureA().GetBody().GetUserData();
          entityB = contact.GetFixtureB().GetBody().GetUserData();
          entityA.trigger("EndContact", entityB);
          return entityB.trigger("EndContact", entityA);
        };
        return _world.SetContactListener(contactListener);
      };
      _setDebugDraw = function() {
        var canvas, debugDraw;
        if (Crafty.support.canvas) {
          canvas = document.createElement("canvas");
          canvas.id = "Box2DCanvasDebug";
          canvas.width = Crafty.viewport.width;
          canvas.height = Crafty.viewport.height;
          canvas.style.position = 'absolute';
          canvas.style.left = "0px";
          canvas.style.top = "0px";
          Crafty.stage.elem.appendChild(canvas);
          debugDraw = new b2DebugDraw();
          debugDraw.SetSprite(canvas.getContext('2d'));
          debugDraw.SetDrawScale(_SCALE);
          debugDraw.SetFillAlpha(0.7);
          debugDraw.SetLineThickness(1.0);
          debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_joinBit);
          return _world.SetDebugDraw(debugDraw);
        }
      };
      return {
        /*
            PUBLIC
        */

        /*
            # #Crafty.Box2D.debug
            # @comp Crafty.Box2D
            # This will determine whether to use Box2D's own debug Draw
        */

        debug: false,
        /*
            # #Crafty.Box2D.init
            # @comp Crafty.Box2D
            # @sign public void Crafty.Box2D.init(params)
            # @param options: An object contain settings for the world
            # Create a Box2D world. Must be called before any entities
            # with the Box2D component can be created
        */

        init: function(_arg) {
          var doSleep, gravityX, gravityY, scale, _ref3,
            _this = this;
          _ref3 = _arg != null ? _arg : {}, gravityX = _ref3.gravityX, gravityY = _ref3.gravityY, scale = _ref3.scale, doSleep = _ref3.doSleep;
          if (gravityX == null) {
            gravityX = 0;
          }
          if (gravityY == null) {
            gravityY = 0;
          }
          if (_SCALE == null) {
            _SCALE = 30;
          }
          if (doSleep == null) {
            doSleep = true;
          }
          _world = new b2World(new b2Vec2(gravityX, gravityY), doSleep);
          this.__defineGetter__('world', function() {
            return _world;
          });
          this.__defineSetter__('gravity', function(v) {
            var body, _results;
            _world.SetGravity(new b2Vec2(v.x, v.y));
            body = _world.GetBodyList();
            _results = [];
            while (body != null) {
              body.SetAwake(true);
              _results.push(body = body.GetNext());
            }
            return _results;
          });
          this.__defineGetter__('gravity', function() {
            return _world.GetGravity();
          });
          this.__defineGetter__('SCALE', function() {
            return _SCALE;
          });
          _setContactListener();
          Crafty.bind("EnterFrame", function() {
            var body, _i, _len;
            _world.Step(1 / Crafty.timer.getFPS(), 10, 10);
            for (_i = 0, _len = _toBeRemoved.length; _i < _len; _i++) {
              body = _toBeRemoved[_i];
              _world.DestroyBody(body);
            }
            _toBeRemoved = [];
            if (_this.debug) {
              _world.DrawDebugData();
            }
            return _world.ClearForces();
          });
          return _setDebugDraw();
        },
        /*
            #Crafty.Box2D.destroy
            @comp Crafty.Box2D
            @sign public void Crafty.Box2D.destroy([b2Body body])
            @param body - The body to be destroyed. Destroy all if none
            Destroy all the bodies in the world. Internally, add to a list to destroy
            on the next step to avoid collision step.
        */

        destroy: function(body) {
          var _results;
          if (body != null) {
            return _toBeRemoved.push(body);
          } else {
            body = _world.GetBodyList();
            _results = [];
            while (body != null) {
              _toBeRemoved.push(body);
              _results.push(body = body.GetNext());
            }
            return _results;
          }
        }
      };
    })()
  });

  Crafty.math.Polygon = (function() {
    /* PRIVATE
    */

    var _distance, _hull, _inputVertices, _maer, _quickHull;

    Polygon.name = 'Polygon';

    _inputVertices = null;

    _hull = null;

    _maer = null;

    /*
      #._distance
      @sign Number _distance(Array start, Array end, Array point)
      @param start - the start point forming the dividing line.
      @param end - the end point forming the dividing line.
      @param point - the point from which the distance to the line is calculated.
      Find the distance between a point and a line formed by a start and end points.
      All params have first index as the x and second index as y coordinate.
    
      The real distance value could be calculated as follows:
    
      Calculate the 2D Pseudo crossproduct of the line vector (start 
      to end) and the start to point vector. 
      ((y2*x1) - (x2*y1))
      The result of this is the area of the parallelogram created by the 
      two given vectors. The Area formula can be written as follows:
      A = |start->end| h
      Therefore the distance or height is the Area divided by the length 
      of the first vector. This division is not done here for performance 
      reasons. The length of the line does not change for each of the 
      comparison cycles, therefore the resulting value can be used to 
      finde the point with the maximal distance without performing the 
      division.
    
      Because the result is not returned as an absolute value its 
      algebraic sign indicates of the point is right or left of the given 
      line
    */


    _distance = function(start, end, point) {
      return (point[1] - start[1]) * (end[0] - start[0]) - (point[0] - start[0]) * (end[1] - start[1]);
    };

    /*
      #._quickHull
      @sign Array _quickHull(Array vertices, Array start, Array end)
      @param vertices - Contains the set of points to calculate the hull for.
                        Each point is an array with the form [x, y].
      @param start - The start point of the line, in the form [x, y].
      @param end - The end point of the line, in the form [x, y].
      @return set of points forming the convex hull, in clockwise order.
      Execute a QuickHull run on the given set of points, using the provided 
      line as delimiter of the search space.
    */


    _quickHull = function(vertices, start, end) {
      var d, maxDistance, maxPoint, newPoints, vertex, _i, _len;
      maxPoint = null;
      maxDistance = 0;
      newPoints = [];
      for (_i = 0, _len = vertices.length; _i < _len; _i++) {
        vertex = vertices[_i];
        if (!((d = _distance(start, end, vertex)) > 0)) {
          continue;
        }
        newPoints.push(vertex);
        if (d < maxDistance) {
          continue;
        }
        maxDistance = d;
        maxPoint = vertex;
      }
      /*
          The current delimiter line is the only one left and therefore a 
          segment of the convex hull. Only the end of the line is returned 
          to not have points multiple times in the result set.
      */

      if (!(maxPoint != null)) {
        return [end];
      }
      /*
          The new maximal point creates a triangle together with start and 
          end, Everything inside this trianlge can be ignored. Everything 
          else needs to handled recursively. Because the quickHull invocation 
          only handles points left of the line we can simply call it for the 
          different line segements to process the right kind of points.
      */

      return _quickHull(newPoints, start, maxPoint).concat(_quickHull(newPoints, maxPoint, end));
    };

    /* PUBLIC
    */


    /*
      #RotatingCalipers.constructor
      @sign void constructor(Array vertices)
      @sign void RotatingCalipers(Array vertex, Array vertex, Array vertex[, Array vertex...])
      @param vertices - An array contains vertices in form of an array. Can also take 
                        each vertex as arguments
    */


    function Polygon(verticesOrFirst) {
      var rest, vertex, vertex1, vertex2, vertex3, _i, _len;
      if (!(verticesOrFirst != null)) {
        throw new Error("Argument required");
      }
      if (!(verticesOrFirst instanceof Array) || verticesOrFirst.length < 3) {
        throw new Error("Array of vertices required");
      }
      vertex1 = verticesOrFirst[0], vertex2 = verticesOrFirst[1], vertex3 = verticesOrFirst[2], rest = 4 <= verticesOrFirst.length ? __slice.call(verticesOrFirst, 3) : [];
      for (_i = 0, _len = verticesOrFirst.length; _i < _len; _i++) {
        vertex = verticesOrFirst[_i];
        if (!(vertex instanceof Array) || vertex.length < 2) {
          throw new Error("Invalid vertex");
        }
        if (isNaN(vertex[0]) || isNaN(vertex[1])) {
          throw new Error("Invalid vertex");
        }
      }
      _inputVertices = verticesOrFirst;
      _hull = null;
      _maer = null;
    }

    /*
      RotatingCalipers.convexHull
      @sign Array convexHull(void)
      @return an Array of the points forming the minimal convex set containing all
              input vertices.
      Calculates the convex hull of the arbitrary vertices defined in constructor.
    */


    Polygon.prototype.convexHull = function() {
      var extremeX, finder;
      if (_hull != null) {
        return _hull;
      }
      finder = function(arr) {
        var el, ret, _i, _len;
        ret = {};
        ret.min = ret.max = arr[0];
        for (_i = 0, _len = arr.length; _i < _len; _i++) {
          el = arr[_i];
          if (el[0] < ret.min[0]) {
            ret.min = el;
          }
          if (el[0] > ret.max[0]) {
            ret.max = el;
          }
        }
        return ret;
      };
      extremeX = finder(_inputVertices);
      return _hull = _quickHull(_inputVertices, extremeX.min, extremeX.max).concat(_quickHull(_inputVertices, extremeX.max, extremeX.min)).reverse();
    };

    /*
      RotatingCalipers.angleBetweenVectors
      @sign Number angleBetweenVectors(Array vector1, Array vector2)
      @param vector1 - the first vector
      @param vector2 - the second vector
      @return the angle between them, in radian
      Calculate the angle between two vectors.
    */


    Polygon.prototype.angleBetweenVectors = function(vector1, vector2) {
      var dotProduct, magnitude1, magnitude2;
      dotProduct = vector1[0] * vector2[0] + vector1[1] * vector2[1];
      magnitude1 = Math.sqrt(vector1[0] * vector1[0] + vector1[1] * vector1[1]);
      magnitude2 = Math.sqrt(vector2[0] * vector2[0] + vector2[1] * vector2[1]);
      return Math.acos(dotProduct / (magnitude1 * magnitude2));
    };

    /*
      RotatingCalipers.rotateVector
      @sign Array rotateVector(Array vector, Number angle)
      @param vector - the vector to rotate
      @param angle - the angle to rotate to, in radian
      @return the rotated vector as an array
      Rotate a vector to an angle and return the rotated vector.
    */


    Polygon.prototype.rotateVector = function(vector, angle) {
      var rotated;
      rotated = [];
      rotated[0] = vector[0] * Math.cos(angle) - vector[1] * Math.sin(angle);
      rotated[1] = vector[0] * Math.sin(angle) + vector[1] * Math.cos(angle);
      return rotated;
    };

    /*
      RotatingCalipers.shortestDistance
      @sign Number shortestDistance(Array p, Array t, Array v)
      @param p - the point to which the shortest distance is calculated
      @param t - the point through which the vector extends
      @param v - the vector extended to t to form a line
      Calculate the shortest distance from point p to the line formed by extending
      the vector v through point t
    */


    Polygon.prototype.shortestDistance = function(p, t, v) {
      var a, c;
      if (v[0] === 0) {
        return Math.abs(p[0] - t[0]);
      }
      a = v[1] / v[0];
      c = t[1] - a * t[0];
      return Math.abs(p[1] - c - a * p[0]) / Math.sqrt(a * a + 1);
    };

    /*
      RotatingCalipers.intersection
      @sign Array intersection(Array point1, Array vector1, Array point2, Array vector2)
      @param point1 - the point through which the first vector passing
      @param vector1 - the vector passing through point1
      @param point2 - the point through which the second vector passing
      @param vector2 - the vector passing through point2
      @return the intersecting point between two vectors
      Finds the intersection of the lines formed by vector1 passing through
      point1 and vector2 passing through point2
    */


    Polygon.prototype.intersection = function(point1, vector1, point2, vector2) {
      var b1, b2, m1, m2, point;
      if (vector1[0] === 0 && vector2[0] === 0) {
        return false;
      }
      if (vector1[0] !== 0) {
        m1 = vector1[1] / vector1[0];
        b1 = point1[1] - m1 * point1[0];
      }
      if (vector2[0] !== 0) {
        m2 = vector2[1] / vector2[0];
        b2 = point2[1] - m2 * point2[0];
      }
      if (vector1[0] === 0) {
        return [point1[0], m2 * point1[0] + b2];
      }
      if (vector2[0] === 0) {
        return [point2[0], m1 * point2[0] + b1];
      }
      if (m1 === m2) {
        return false;
      }
      point = [];
      point[0] = (b2 - b1) / (m1 - m2);
      point[1] = m1 * point[0] + b1;
      return point;
    };

    /*
      RotatingCalipers.minAreaEnclosingRectangle
      @sign Object minAreaEnclosingRectangle(void)
      @return an object containing the vertices, width, height and area of the
      enclosing rectangle that has the minimum area.
      Calculate the mimimum area enclosing retangle for a convex polygon with n
      vertices given in clockwise order.
      The algorithm is based on Godfried Toussaint's 1983 whitepaper on "Solving
      geometric problems with the rotating calipers" and the Wikipedia page for 
      "Rotating Calipers". More info at http://cgm.cs.mcgill.ca/~orm/maer.html.
      Ported from Geoffrey Cox's PHP port (github.com/brainbook/BbsRotatingCalipers).
      Adapted for CoffeeScript by Son Tran.
      The general guidelines for the algorithm is as followed:
      1. Compute all four extreme points, and call them xminP, xmaxP, yminP ymaxP.
      2. Construct four lines of support for P through all four points. 
        These determine two sets of "calipers".
      3. If one (or more) lines coincide with an edge, then compute the area of the
        rectangle determined by the four lines, and keep as minimum. Otherwise, 
        consider the current minimum area to be infinite.
      4. Rotate the lines clockwise until one of them coincides with an edge.
      5. Compute area of new rectangle, and compare it to the current minimum area. 
        Update the minimum if necessary, keeping track of the rectangle determining the minimum. 
      6. Repeat steps 4 and 5, until the lines have been rotated an angle greater than 90 degrees.
      7. Output the minimum area enclosing rectangle.
    */


    Polygon.prototype.minAreaEnclosingRectangle = function() {
      var angles, area, caliper, calipers, getEdge, getItem, height, hull, i, idx, minAngle, minArea, minHeight, minPairs, minWidth, point, rotatedAngle, vertices, width, xIndices, _i, _j, _len, _len1;
      if (_maer != null) {
        return _maer;
      }
      hull = this.convexHull();
      xIndices = [0, 0, 0, 0];
      getItem = function(idxOfExtremePointInHull) {
        return hull[idxOfExtremePointInHull % hull.length];
      };
      getEdge = function(idxOfExtremePointInHull) {
        var pointA, pointB;
        pointA = getItem(idxOfExtremePointInHull + 1);
        pointB = getItem(idxOfExtremePointInHull);
        return [pointA[0] - pointB[0], pointA[1] - pointB[1]];
      };
      /*
          Compute all four extreme points for the polygon, store their indices.
      */

      for (idx = _i = 0, _len = hull.length; _i < _len; idx = ++_i) {
        point = hull[idx];
        if (point[1] < hull[xIndices[0]][1]) {
          xIndices[0] = idx;
        }
        if (point[1] > hull[xIndices[1]][1]) {
          xIndices[1] = idx;
        }
        if (point[0] < hull[xIndices[2]][0]) {
          xIndices[2] = idx;
        }
        if (point[0] > hull[xIndices[3]][0]) {
          xIndices[3] = idx;
        }
      }
      rotatedAngle = 0;
      minArea = minWidth = minHeight = null;
      calipers = [[1, 0], [-1, 0], [0, -1], [0, 1]];
      /*
          Repeat computing, until the lines have been rotated an angle greater than 90 degrees.
      */

      while (rotatedAngle < Math.PI) {
        /*
              Calculate the angle between the edge next adjacent to each extreme point
              and its caliper. The minimum of those angles indicates the angle needed
              to rotate all calipers to coincide with the nearest edge.
        */

        angles = (function() {
          var _j, _len1, _results;
          _results = [];
          for (i = _j = 0, _len1 = xIndices.length; _j < _len1; i = ++_j) {
            idx = xIndices[i];
            _results.push(this.angleBetweenVectors(getEdge(idx), calipers[i]));
          }
          return _results;
        }).call(this);
        minAngle = Math.min.apply(Math, angles);
        /*
              Then rotate all calipers to that minimum angle.
        */

        calipers = (function() {
          var _j, _len1, _results;
          _results = [];
          for (_j = 0, _len1 = calipers.length; _j < _len1; _j++) {
            caliper = calipers[_j];
            _results.push(this.rotateVector(caliper, minAngle));
          }
          return _results;
        }).call(this);
        idx = angles.indexOf(minAngle);
        /* 
        Compute the area of the new rectangle
        */

        switch (idx) {
          case 0:
          case 2:
            width = this.shortestDistance(getItem(xIndices[1]), getItem(xIndices[0]), calipers[0]);
            height = this.shortestDistance(getItem(xIndices[3]), getItem(xIndices[2]), calipers[2]);
            break;
          case 1:
            width = this.shortestDistance(getItem(xIndices[0]), getItem(xIndices[1]), calipers[1]);
            height = this.shortestDistance(getItem(xIndices[3]), getItem(xIndices[2]), calipers[2]);
            break;
          case 3:
            width = this.shortestDistance(getItem(xIndices[1]), getItem(xIndices[0]), calipers[0]);
            height = this.shortestDistance(getItem(xIndices[2]), getItem(xIndices[3]), calipers[3]);
        }
        rotatedAngle += minAngle;
        area = width * height;
        /*
              Compare the new area to the current minArea.
        */

        if (!(minArea != null) || area < minArea) {
          /*
                  Update the minArea, keeping track of the rectangle determining the minimum.
          */

          minArea = area;
          minPairs = (function() {
            var _j, _results;
            _results = [];
            for (i = _j = 0; _j < 4; i = ++_j) {
              _results.push([getItem(xIndices[i]), calipers[i]]);
            }
            return _results;
          })();
          minWidth = width;
          minHeight = height;
        }
        /*
              Update the index of the extreme point with the minimum angle to the next point
              of the polygon.
        */

        xIndices[idx]++;
      }
      vertices = [this.intersection(minPairs[0][0], minPairs[0][1], minPairs[3][0], minPairs[3][1]), this.intersection(minPairs[3][0], minPairs[3][1], minPairs[1][0], minPairs[1][1]), this.intersection(minPairs[1][0], minPairs[1][1], minPairs[2][0], minPairs[2][1]), this.intersection(minPairs[2][0], minPairs[2][1], minPairs[0][0], minPairs[0][1])];
      /* Round up the values to 3 decimal
      */

      for (_j = 0, _len1 = vertices.length; _j < _len1; _j++) {
        point = vertices[_j];
        Math.round(point * 1000) / 1000;
      }
      minWidth = Math.round(minWidth * 1000) / 1000;
      minHeight = Math.round(minHeight * 1000) / 1000;
      minArea = Math.round(minArea * 1000) / 1000;
      return {
        vertices: vertices,
        width: minWidth,
        height: minHeight,
        area: minArea
      };
    };

    return Polygon;

  })();

}).call(this);

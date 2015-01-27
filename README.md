#jweel-ring
![](http://i.imgur.com/txBKU1W.gif)
##Project architecture

This projects uses the JavaScript file and module loader [Require.js](http://requirejs.org/). Therefore each functional module lives in it's own file. All these modules can be found under `app/js/app`.
The dependencies of the project are handled using bower and can found unser `app/js/lib`.

##Installation instructions

1. Install [Node.js](http://nodejs.org/)
2. Install Grunt globally `npm install -g grunt-cli`
3. Clone the repo `git@github.com:Tomesch/jweel-ring.git`
4. `cd jweel-ring`
5. Install the npm dependencies `npm install`
6. Install the bower dependencies `grunt install`

##Available grunt tasks

- `grunt bower`: Install Bower packages. *
- `grunt jshint`: Validate files with JSHint. *
- `grunt requirejs`: Build a RequireJS project. *
- `grunt githooks`: Binds grunt tasks to git hooks *
- `grunt connect`: Start a connect web server. *
- `grunt build`: Alias for "jshint", "requirejs" tasks.
- `grunt install`: Alias for "githooks", "bower", "connect" tasks.

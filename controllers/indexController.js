exports.main = function(req, res) {
  res.render('index');
};

exports.index = function(req, res) {
  res.render('layout_map',{ path: 'empty' });
};

exports.map = function(req, res) {
    res.render('layout_map',{ path: 'empty',script : 'map_script' });
  };

exports.circuit = function(req, res) {
  res.render('layout_map' ,{path: 'empty', script : 'map1'});
}

exports.mine = function(req, res) {
  res.render('layout_map' ,{path: 'empty', script : 'mine'});
}

exports.editor = function(req, res) {
  res.render('terminal' );
}

exports.terrain = function(req, res) {
  res.render('layout_map' ,{path: 'empty', script : 'ter_test'} );
}

exports.environnement = function(req, res) {
  res.render('layout_map' ,{path: 'empty', script : 'env_test'} );
}


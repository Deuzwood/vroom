exports.main = function(req, res) {
  res.render('index');
};

exports.index = function(req, res) {
  res.render('layout_map',{ path: 'empty' });
};

exports.map = function(req, res) {
    res.render('layout_map',{ path: 'empty',script : 'seg_test' });
  };

exports.circuit = function(req, res) {
  res.render('layout_map' ,{path: 'empty', script : 'map_test'});
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


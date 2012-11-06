$(document).ready(function() {
		$('div').miller({
				'url': function(id) {
					if (!id) {
						return 'miller1.json';
					} else {
						var data = null;

						$.ajaxSetup( { "async": false } );

						$.getJSON('miller1.json', function(lines) {
								data = $.grep(lines, function(line) { return line['id'] == id; });
							}
						);

						if (data.length <= 0) {
							$.getJSON('miller2.json', function(lines) {
									data = $.grep(lines, function(line) { return line['id'] == id; });
								}
							);
						}

						$.ajaxSetup( { "async": true } );

						if (!data[0]['parent']) {
							return 'miller3.json';
						} else {
							return Math.random() <= 0.5 ? 'miller1.json' : 'miller2.json'; 
						}
					}
				},
				'panel': {
					'options': {
						'Add': function(id) { return function() { alert('add to ' + id); }; },
						'Update': function(id) { return function() { alert('update ' + id); }; },
						'Delete': function(id) { return function() { alert('delete ' + id); }; }
					}
				}
			}
		);
	}
);

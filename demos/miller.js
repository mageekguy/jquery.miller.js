$(document).ready(function() {
		$('div').miller({
				url: function(id) {
					if (!id) {
						return 'miller1.json';
					} else {
						var data = null;

						$.ajaxSetup({ "async": false });

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

						$.ajaxSetup({ "async": true });

						return (!data[0]['parent'] ? 'miller3.json' : (Math.random() <= 0.5 ? 'miller1.json' : 'miller2.json'));
					}
				},
				toolbar: {
					options: {
						Add: function(id) { return function() { alert('Do you really want to add to ' + id); }; },
						Update: function(id) { return function() { alert('update ' + id); }; },
						Delete: function(id) { return function() { alert('delete ' + id); }; }
					}
				},
				pane: {
					options: {
						Add: function(id) { return function() { alert('add to ' + id); }; },
						Update: function(id) { return function() { alert('update ' + id); }; },
						Delete: function(id) { return function() { alert('delete ' + id); }; }
					}
				}
			}
		);
	}
);

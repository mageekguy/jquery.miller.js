$(document).ready(function() {
		$('div').miller({
				'url': function(id) { return 'miller.json'; },
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

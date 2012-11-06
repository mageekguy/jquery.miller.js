(function($) {
	$.fn.miller = function(settings) {
		var settings = $.extend({
					'url': function(id) { return id; },
					'minWidth': 40,
					'panel': {
						'width': 100,
						'options': {}
					}
				},
				settings
			)
		;

		this.addClass('miller');

		var path = $('<div>', { class: 'path' })
			.appendTo(this)
		;

		var columns = $('<div>', { class: 'columns' })
			.appendTo(this)
		;

		var getColumnsWidth = function() {
				var width = 0;

				columns.children().each(function() {
						width += $(this).width();
					}
				);

				return width;
			}
		;

		var removeNextColumns = function() {
				var line = $(this);

				var column = line.parent();

				column
					.nextAll()
						.slice(1)
							.remove()
				;

				column
					.find('li')
						.removeClass('selected parentSelected')
				;

				line.addClass(line.hasClass('parent') ? 'parentSelected' : 'selected');

				var columnIndex = column.index();

				columnIndex -= (columnIndex - (columnIndex / 2));

				path
					.append($('<span>', { text: line.text() }))
					.children()
						.slice(columnIndex, -1)
							.remove()
				;

			}
		;

		var buildColumn = function(lines) {
				if (lines.length <= 0) {
					var line = $('li.parentLoading')
						.removeClass('parent')
						.addClass('selected')
					;

					var width = getColumnsWidth();

					var panel = $('<ul>')
						.css({ 'top': 0, 'left': width })
						.addClass('panel')
					;

					id = line.data('id');

					$.each(settings['panel']['options'], function(key, callbackGenerator) {
							var option = $('<li>', { text: key })
								.on('click', callbackGenerator(id))
							;

							option.appendTo(panel);
						}
					);

					columns
						.append(panel)
						.scrollLeft(width + panel.width())
					;
				} else {
					$('li.parentLoading').addClass('parentSelected');

					var width = getColumnsWidth();

					var column = $('<ul>')
						.css({ 'top': 0, 'left': width })
					;

					$.each(lines, function(id, data) {
							var line = $('<li>', { text: data['name'] })
								.data('id', data['id'])
								.on('click', removeNextColumns)
								.on('click', getLines)
								.appendTo(column)
							;

							if (data['parent']) {
								line.addClass('parent');
							}
						}
					);

					columns
						.append(column)
						.scrollLeft(width += column.width())
						.append(
							$('<div>', { class: 'grip' })
								.css({ 'top': 0, 'left': width })
								.mousedown(function(event) {
										var x = event.pageX;
										var cursor = columns.css('cursor');

										columns
											.css('cursor', 'col-resize')
											.mousemove(function(event) {
													var delta = event.pageX - x;
													var newWidth = column.width() + delta;

													if (newWidth > settings['minWidth']) {
														column
															.width(newWidth)
															.nextAll()
																.each(function() {
																		$(this).css('left', $(this).position().left + delta + columns.scrollLeft());
																	}
																)
														;
													}

													x = event.pageX;
												}
											)
											.mouseup(function() {
													columns
														.off('mousemove')
														.css('cursor', cursor)
													;
												}
											)
										;
									}
								)
						)
					;
				}
			}
		;

		var getLines = function(event) {
				var currentLine = $(event.currentTarget);

				currentLine
					.removeClass('parentSelected')
					.addClass('parentLoading')
				;

				$.getJSON(settings['url']($(this).data('id')), buildColumn)
					.always(function() {
							currentLine
								.removeClass('parentLoading')
							;
						}
					)
					.fail(function() {})
				;

			}
		;

		$.getJSON(settings['url'](), buildColumn);

		return this;
	};
})(jQuery);

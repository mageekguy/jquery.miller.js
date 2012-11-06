(function($) {
	$.fn.miller = function(settings) {
		var settings = $.extend({
					url: function(id) { return id; },
					minWidth: 40,
					panel: {
						width: 100,
						options: {}
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
				return columns.children().length;
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

				var columnIndex = column.index() - 1;

				path
					.append($('<span>', { text: line.text() }))
					.children()
						.slice(columnIndex < 0 ? 0 : columnIndex, -1)
							.remove()
				;

			}
		;

		var buildColumn = function(lines) {
				if (lines) {
					var width = getColumnsWidth();

					var column = $('<ul>')
						.css({ top: 0, left: width })
					;

					$.each(lines, function(id, value) {
							var line = $('<li>', { text: value[0] })
								.bind('click', removeNextColumns)
								.data('id', id)
							;

							if (value[1]) {
								line.addClass('parent').bind('click', getLines);
							} else {
								line.bind('click', buildPanel);
							}
							
							line.appendTo(column);
						}
					);

					columns
						.append(column)
						.scrollLeft(width += column.width())
						.append(
							$('<div>', { class: 'grip' })
								.css({ top: 0, left: width })
								.mousedown(function(event) {
										var x = event.pageX;
										var cursor = columns.css('cursor');

										columns
											.css('cursor', 'col-resize')
											.mousemove(function(event) {
													var delta = event.pageX - x;
													var newWidth = column.width() + delta;

													if (newWidth > settings.minWidth) {
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

		var getLines = function() {
				$.getJSON(settings.url($(this).data('id')), buildColumn);
			}
		;

		var buildPanel = function() {
				var width = getColumnsWidth();

				var panel = $('<ul>')
					.css({ top: 0, left: width })
					.addClass('panel')
				;

				id = $(this).data('id');

				$.each(settings['panel']['options'], function(key, callbackGenerator) {
						var option = $('<li>', { text: key })
							.bind('click', callbackGenerator(id))
						;

						option.appendTo(panel);
					}
				);

				columns
					.append(panel)
					.scrollLeft(width + panel.width())
				;
			}
		;

		$.getJSON(settings.url(), buildColumn);

		return this;
	};
})(jQuery);
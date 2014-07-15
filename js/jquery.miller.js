(function($) {
 	var methods = {
		'getPath': function() {
			var path = [];

			$.each($(this).find('div.path span'), function(key, node) {
					path.push({ 'id': $(node).data('id'), 'name': $(node).text() });
				}
			);

			return path;
		},
		'setPath': function(path) {
			// Make sure path is an array
			if (!$.isArray(path) || path.length == 0) {
				return;
			}

			$.each(path, function(index, value) {
				var list = $('.columns ul').get(index);
				var $listItems = $(list).children();
				var $item = $listItems.filter(function(index) {
					return $(this).data('id') == value;
				});
				$item.click();
			});
		}
	};

	$.fn.miller = function(mixed) {
		if (methods[mixed] ) {
			return methods[mixed].apply(this, Array.prototype.slice.call(arguments, 1));
		} else {
			var miller = this;
			var hasFocus = false;
			var currentAjaxRequest = null;
			var settings = $.extend(true, {
						'url': function(id) { return id; },
						'transform': function(lines) { return lines; },
						'preloadedData': {},
						'initialPath': [],
						'tabindex': 0,
						'minWidth': 40,
						'carroussel': false,
						'toolbar': {
							'options': {}
						},
						'pane': {
							'options': {}
						},
                        'onClick' : function() {
                            // No-op
                        }
					},
					mixed
				)
			;

			if (!miller.attr('tabindex')) {
				miller.attr('tabindex', settings.tabindex);
			}

			miller
				.addClass('miller')
				.focus(function() { hasFocus = true; })
				.blur(function() { hasFocus = false; })
			;

			var path = $('<div>', { 'class': 'path' })
				.appendTo(miller)
			;

			var columns = $('<div>', { 'class': 'columns' })
				.appendTo(miller)
			;

			var toolbar = null;

			if (!$.isEmptyObject(settings.toolbar.options)) {
				var toolbar = $('<div>', { 'class': 'toolbar' })
					.appendTo(miller)
				;
			};

			var currentLine = null;

			$(document).keypress(function(event) {
					if (hasFocus && currentLine && event.which != 37 && event.which != 38 && event.which != 39 && event.which != 40) {
						var newCurrentLine = currentLine.parent().children().filter(function() { return $(this).text().match(new RegExp('^' + String.fromCharCode(event.which))); }).first();

						if (newCurrentLine.length) {
							currentLine = newCurrentLine.click();
						}
					}
				}
			);

			$(document).keydown(function(event) {
					if (hasFocus && currentLine && (event.which == 37 || event.which == 38 || event.which == 39 || event.which == 40)) {
						var newCurrentLine = [];
						var scrollTop = currentLine.parent().scrollTop();

						switch (event.which) {
							case 37:
								newCurrentLine = currentLine.parent().prev().prev().find('li.parentSelected');
								break;

							case 38:
								newCurrentLine = currentLine.prev();

								if (!newCurrentLine.length && settings.carroussel) {
									newCurrentLine = currentLine.parent().find('li:last');
									scrollTop = newCurrentLine.position().top;
								}
								break;

							case 39:
								newCurrentLine = currentLine.parent().next().next().find('li:first');
								break;

							case 40:
								newCurrentLine = currentLine.next();

								if (!newCurrentLine.length && settings.carroussel) {
									newCurrentLine = currentLine.parent().find('li:first');
									scrollTop = 0;
								}
								break;
						}

						if (newCurrentLine.length && !newCurrentLine.parent().hasClass('pane')) {
							currentLine = newCurrentLine.click();
						}

						return false;
					}
				}
			);

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

					var node = $('<span>', { 'text': line.text() })
						.data('id', line.data('id'))
						.click(function() {
								columns
									.children()
										.slice((($(this).index() * 2) + 4))
											.remove()
								;
								columns
									.children('ul:last')
										.find('li')
											.removeClass('parentSelected')
								;
								path
									.children()
										.slice($(this).index() + 1)
											.remove()
								;
							}
						)
						.appendTo(path)
					;

					var child = column.index();

					child -= (child - (child / 2));

					path
						.scrollLeft(node.position().left)
						.children()
							.slice(child, -1)
								.remove()
					;
				}
			;

			var buildColumn = function(lines) {
					if (lines == null) {
						$('li.parentLoading').remove();
					} else {
						if (currentLine && toolbar) {
							toolbar.children().remove();

							$.each(settings.toolbar.options, function(key, callback) {
									$('<span>', { 'text': key })
										.click(function() { callback.call(miller, currentLine.data('id')) })
										.appendTo(toolbar)
									;
								}
							);
						}

						if (currentLine) {
							var currentColumn = currentLine.parent();
							var scroll = 0;
							var scrollTop = currentColumn.scrollTop();
							var topOfCurrentLine = currentLine.position().top;

							if (topOfCurrentLine < 0) {
								scroll = topOfCurrentLine;
							} else {
								var bottomOfCurrentLine = currentLine.position().top + currentLine.height();
								var heightOfCurrentColumn = currentColumn.height();

								if (bottomOfCurrentLine > heightOfCurrentColumn) {
									scroll = bottomOfCurrentLine - heightOfCurrentColumn;
								}
							}

							currentColumn.scrollTop(scrollTop + scroll);
						}

						var width = 0;

						var lastGrip = columns.children('div.grip:last')[0];

						if (lastGrip) {
							lastGrip = $(lastGrip);
							width = lastGrip.position().left + lastGrip.width() + columns.scrollLeft();
						}
						
						if (lines.length <= 0) {
							var line = $('li.parentLoading')
								.removeClass('parent')
								.addClass('selected')
							;

							if (!$.isEmptyObject(settings.pane.options)) {
								var pane = $('<ul>')
									.css({ 'top': 0, 'left': width })
									.addClass('pane')
								;

								var id = line.data('id');

								$.each(settings.pane.options, function(key, callback) {
										$('<li>', { 'text': key })
											.click(function() { callback.call(miller, currentLine.data('id')) })
											.appendTo(pane)
										;
									}
								);

								columns
									.append(pane)
									.scrollLeft(width + pane.width())
								;
							}
						} else {
							$('li.parentLoading').addClass('parentSelected');

							var column = $('<ul>')
								.css({ 'top': 0, 'left': width })
							;

							$.each(lines, function(id, data) {
									var line = $('<li>', { 'text': data['name'] })
										.data('id', data['id'])
										.click(removeNextColumns)
										.click(getLines)
                                        .click(settings.onClick)
										.appendTo(column)
									;

									if (data['parent']) {
										line.addClass('parent');
									}
									if (data['class']) {
										line.addClass(data['class']);
									}
									if (data['image']) {
										$('<img>', { 'src': data['image']})
											.prependTo(line)
										;
									}
								}
							);

							columns
								.append(column)
								.scrollLeft(width += column.width())
								.append(
									$('<div>', { 'class': 'grip' })
										.css({ 'top': 0, 'left': width })
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
				}
			;

			var transformAndBuildColumn = function(data) {
					buildColumn(settings.transform.call(miller, data));
			};

			var getLines = function(event) {
					var id = $(this).data('id');
					currentLine = $(event.currentTarget)
						.removeClass('parentSelected')
						.addClass('parentLoading')
					;
					// First, let's check for preloadedData
					var preloadedData = getPreloadedData();
					if (preloadedData) {
						buildColumn(preloadedData);
						currentLine
							.removeClass('parentLoading')
						;
					} else {
						if (currentAjaxRequest) {
							currentAjaxRequest.abort();
						}

						currentAjaxRequest = $.getJSON(settings.url.call(miller, id), transformAndBuildColumn)
							.always(function() {
									currentLine
										.removeClass('parentLoading')
									;

									currentAjaxRequest = null;
								}
							)
							.fail(function() {})
						;
					}
				}
			;

			var getPreloadedData = function() {
					if (!$.isEmptyObject(settings.preloadedData)) {
						var currentPath = $.map(methods['getPath'].call(miller), function(value, index) {
							return value.id;
						});

						var currentObj = settings.preloadedData;
						$.each(currentPath, function(pathIndex, pathValue) {
							var children = currentObj.children;
							if (!$.isArray(children) || children.length == 0) {
								return false; // break
							}
							$.each(children, function(childIndex, childValue) {
								if (childValue.id == pathValue) {
									currentObj = childValue;
									return false; // break
								}
							});
						});
						return currentObj.children || [];
					}
					return null;
				}
			;

			var init = function() {
					var preloadedData = getPreloadedData();
					if(preloadedData) {
						buildColumn(preloadedData);
					} else {
						$.getJSON(settings.url.call(miller), transformAndBuildColumn);
					}
					methods['setPath'](settings.initialPath);
				}
			;

			init();

			return miller;
		}
	};
})(jQuery);

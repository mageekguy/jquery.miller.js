# jQuery.miller.js

## An implementation of [Miller column](http://en.wikipedia.org/wiki/Miller_columns) with [jQuery](http://jquery.com)!

It's a work in progress, so use it carefully!  
If you want to see this plugin in action, there is a [demo](http://mgbx.net/demomiller).

## How to use it ?

There is no dependencies needed to use this plugin. 
To use it:
1. Clone the repository or download the source in a directory.  
2. Add this line in the head of your html page:--

``` html
<link href="url/to/css/jquery.miller.css" media="screen" rel="stylesheet" type="text/css" />
```

3. Add a `div` in the body of your html page.  
4. Add these lines at the end of the body of your html page:  

``` html
<script type="text/javascript" src="url/to/js/jquery-1.8.2.min.js"></script>
<script type="text/javascript" src="url/to/js/jquery.miller.js"></script>
```

5. Create a JavaScript script with this content and add it t the end of the body of your html page:

``` JavaScript
$(document).ready(function() { $('div').miller() });
```

You can pass an object litteral to the `miller` function to customize behavior of the plugin.  
The default values are :

```JavaScript
{
	'url': function(id) { return id; },
	'minWidth': 40,
	'panel': {
		'width': 100,
		'options': {}
	}
}
```

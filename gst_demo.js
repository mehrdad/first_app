var max_zindex = 0;

var hotspots_on = false;
var hide_hotspots_toggle = false;

var widget1_img = "widget1_id";
var widget2_img = "widget2_id";

/*
onmouseout_changeImage()

This function is to be used to restore a div's img back to it's original state before the 
handling of an onmouseover event.

The old_image parameter should be the image set by the onmouseover event.

This function will only change images if the old_image is currently the image being displayed.
So if the image has already been changed by the handling of a click,
the image will not be changed.
*/
function onmouseout_changeImage(image_id, old_image, new_image, hideAllPopovers)
{
	console.log('onmouseout_changeImage() ' + image_id + ' ' + old_image + ' ' + new_image + ' ' + hideAllPopovers);

	var image_selector = '#' + image_id;
	var image_layer_selector = image_selector + ' div.image_layer img:first';

	if ($(image_layer_selector).attr('src') == image_src_array[old_image])
	{
		changeImage(image_id, new_image, hideAllPopovers);
	}
}

function changeImage(div_id, new_image, hideAllPopovers)
{
	console.log('changeImage() ' + div_id + ' ' + new_image + ' ' + hideAllPopovers);

	if (hideAllPopovers)
	{
		hidePopovers();
	}
		
	var image_selector = '#' + div_id;
	
	var image_src = image_src_array[new_image];

	var image_layer_selector = image_selector + ' div.image_layer img:first';
	var hotspot_layer_selector = image_selector + ' div.hotspot_layer img:first';
	
	$(image_layer_selector).attr('src', image_src);		

	if (typeof image_src !== 'undefined')
	{
		var image_hs_src = image_src.replace(".png", "_hs.png");
		$(hotspot_layer_selector).attr('src', image_hs_src);
	}

	// Look for map defined in image_map_array[].
	var image_map = image_map_array[new_image];
	if (typeof image_map !== 'undefined')
	{
		$(image_layer_selector).attr('usemap', image_map);
		$(hotspot_layer_selector).attr('usemap', image_map);
	}
	// Look for map defined in html file whose name is new_image + '_map'.
	else if (document.getElementById(new_image + '_map'))
	{
		$(image_layer_selector).attr('usemap', '#' + new_image + '_map');
		$(hotspot_layer_selector).attr('usemap', '#' + new_image + '_map');
	}
	
	// Display hotspot layer based on value of hotspots_on.
	if (hotspots_on == true)
	{
		$(image_selector + ' div.hotspot_layer').css('opacity', '1.0');
	}
	else
	{
		$(image_selector + ' div.hotspot_layer').css('opacity', '0.0');
	}		
}

function toggleHotspots()
{
	console.log('toggleHotspots()');

	hotspots_on = !hotspots_on;

	if (hotspots_on == true)
	{
		$('.hotspot_layer').css('opacity', '1.0');
	}
	else
	{
		$('.hotspot_layer').css('opacity', '0.0');
	}
}

function hideHotspotsToggle()
{
	console.log('hideHotspotsToggle()');

	hotspots_on = false;
	hide_hotspots_toggle = true;

	$('.hotspot_layer').css('opacity', '0.0');
	
	changeImage('banner', 'banner_no_toggle', false);
};

function hideHotspotsToggle2(bannerId)
{
	console.log('hideHotspotsToggle2() ' + bannerId);

	hotspots_on = false;
	hide_hotspots_toggle = true;

	$('.hotspot_layer').css('opacity', '0.0');
	
	changeImage('banner', bannerId, false);
};

function showPopover(popoverId, x, y, hideAllPopovers)
{	
	console.log('showPopover() ' + popoverId + ' ' + x + ' ' + y + ' ' + hideAllPopovers);

	var original_zIndex = document.getElementById(popoverId).style.zIndex;

	if (hideAllPopovers)
	{
		hidePopovers();
	}

	$("#" + popoverId).css('left', (x) + "px");
	$("#" + popoverId).css('top', (y) + "px");

	if (original_zIndex <= 0)
	{
		if (max_zindex <= 0)
		{
			max_zindex = 10;
		}
		else
		{
			max_zindex += 10;
		}
		$("#" + popoverId).css('z-index', max_zindex);
	}
	else
	{
		$("#" + popoverId).css('z-index', '0');
		$("#" + popoverId).css('top', '-2000px');
		$("#" + popoverId).css('left', '-2000px');
	}
	
	changeImage(popoverId, popoverId, false);	
}

function hidePopover(popoverId)
{                 
	console.log('hidePopover() ' + popoverId);

	$('#' + popoverId).css('z-index', '0');
	$('#' + popoverId).css('top', '-2000px');
	$('#' + popoverId).css('left', '-2000px');
}

function hidePopovers()
{                 
	console.log('hidePopovers()');

	$('.popover').css('z-index', '0');
	$('.popover').css('top', '-2000px');
	$('.popover').css('left', '-2000px');
	
	max_zindex = 1;
}

function hideMenus()
{                 
	console.log('hideMenus()');

	$('.menu_popover').css('z-index', '0');
	$('.menu_popover').css('top', '-2000px');
	$('.menu_popover').css('left', '-2000px');
	
//	max_zindex = 1;
}
function showModalPopover(popoverId)
{
	console.log('showModalPopover() ' + popoverId);

	modal_popover_visible = true;
	
	hidePopovers();
	
	// Save usemap values for all divs that will be disabled.
	$('.disableable').each(function( index ) {
		var saved_map = $(this).attr('usemap');
		$(this).data('saved_map', saved_map);
		$(this).attr('usemap', '');
	});

	// Hide hotspots for everything under the modal popover.
	$('.hotspot_layer').css('opacity', '0.0');

	// Calculate modal popover position.
	var demo_width = 1920;
	var demo_height = 708;

	var popover_image_element = "#" + popoverId + " div.image_layer img:first";
	var popover_image_height = $(popover_image_element).height();
	var popover_image_width = $(popover_image_element).width();
		
	var popover_x = (demo_width - popover_image_width)/2;
	if (popover_x < 0)
	{
		popover_x = 0;
	}
	var popover_y = (demo_height - popover_image_height)/2;
	if (popover_y < 0)
	{
		popover_y = 0;
	}
	
	popover_y = 87;
	
	// Show modal popover.
	showPopover(popoverId, popover_x, popover_y, false);

	// Gray out disabled divs.
	$('img.disableable').css('opacity', '0.2');
	$('div.disableable').css('background-color', 'white');

	$('img.disableable_hide').css('opacity', '0.0');

	window.scrollTo(0,0);
}

function showModalPopoverWithImage(popoverId, image)
{
	console.log('showModalPopoverWithImage() ' + popoverId + ' ' + image);

	modal_popover_visible = true;
	
	hidePopovers();
	
	// Save usemap values for all divs that will be disabled.
	$('.disableable').each(function( index ) {
		var saved_map = $(this).attr('usemap');
		$(this).data('saved_map', saved_map);
		$(this).attr('usemap', '');
	});

	// Hide hotspots for everything under the modal popover.
	$('.hotspot_layer').css('opacity', '0.0');

	// Calculate modal popover position.
	var demo_width = 1920;
	var demo_height = 708;

	var popover_image_element = "#" + popoverId + " div.image_layer img:first";
	var popover_image_height = $(popover_image_element).height();
	var popover_image_width = $(popover_image_element).width();
		
	var popover_x = (demo_width - popover_image_width)/2;
	if (popover_x < 0)
	{
		popover_x = 0;
	}
	var popover_y = (demo_height - popover_image_height)/2;
	if (popover_y < 0)
	{
		popover_y = 0;
	}
	
	popover_y = 87;
	
	changeImage(popoverId, image, false);
	
	// Show modal popover.
	showPopover(popoverId, popover_x, popover_y, false);

	// Gray out disabled divs.
	$('img.disableable').css('opacity', '0.2');
	$('div.disableable').css('background-color', 'white');

	$('img.disableable_hide').css('opacity', '0.0');

	window.scrollTo(0,0);
}

function hideModalPopover()
{	
	console.log('hideModalPopover()');
	
	modal_popover_visible = false;
		
	hidePopovers();

	$('img.disableable').css('opacity', '1');
	$('div.disableable').css('background-color', '');

	$('.disableable').each(function( index ) {
		var saved_map = $(this).attr('usemap');
		$(this).attr('usemap', $(this).data('saved_map'));
	});
	
	if (hotspots_on == true)
	{
		$('.hotspot_layer').css('opacity', '1.0');
	}
	else
	{
		$('.hotspot_layer').css('opacity', '0.0');
	}	
}

function getQueryVariable(variable)
{
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i=0;i<vars.length;i++)
	{
		var pair = vars[i].split("=");
		if (pair[0] == variable)
		{
			return pair[1];
		}
	}
	return("");
}

/*
swapImageSrcAndMap()

Used for drag and drop.
*/
function swapImageSrcAndMap(image_id, new_image_src, new_image_map, hideAllPopovers)
{
	console.log('swapImageSrcAndMap()');

	if (hideAllPopovers)
	{
		hidePopovers();
	}
	
	var image_selector = '#' + image_id;
	$(image_selector).attr('src', new_image_src);
	$(image_selector).attr('usemap', new_image_map);
}

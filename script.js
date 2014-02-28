/*
 * All Mod Cons archive webpage
 * - JavaScript
 *
 * > Author:  Seon-Wook Park
 * > License: CC BY-NC-SA
 */
$(document).ready(function() {
	$.getJSON('shows.json', function(shows) {
		var table = $('table');

		// Add shows to table
		$.each(shows, function (i, e) {
			st = 0;
			if (e[3].length) {
				a  = e[3].split(':');
				st = parseInt(a[0]) * 60 + parseInt(a[1]);
			}
			table.append('<tr>'+
				'<td title="'+e[2].split(" ")[0]+'">'+e[0]+'</td>'+
				'<td>'+(e.length >= 2 ? e[1] : '')+'</td>'+
				'<td>'+(e.length >= 3 ? '<a class="download" href="'+e[2]+'" starttime="'+st+'"><i class="icon-download"></i> MP3</a>' : '')+'</td>');
		});

		// Setup tablesorter
		table.tablesorter({
			textExtraction : function(node) {
				var $node = $(node),
					title = $node.attr('title');
				if (title > "") return title;
				return $node.html();
			},
		});

		// Setup MediaElementPlayer
		var audio  = $('audio'),
		    tracks = $('tr'),
		    first   = $('a.download', tracks[1]); // Autoplay first track
		audio.attr('src', first.attr('href'));
		window.player = new MediaElementPlayer('audio', {
			audioWidth:     500,
			success:        function(m) {
				// Change play position of autoplay-ed track accordingly
				setTimeout(function() {
					m.play();
					m.setCurrentTime(first.attr('starttime'));
				}, 100);
			}
		});

		// Bind mouse click to track entries in table
		tracks.click(function(e) {
			var lnk = $('a.download', this),
			    url = lnk.attr('href'),
			    st  = lnk.attr('starttime');
			if (!url) return;
			window.player.pause();
			if (url != window.player.media.src) window.player.setSrc(url);
			window.player.pause();
			if (st > 0) {
				setTimeout(function() {
					window.player.play();
					window.player.setCurrentTime(st);
				}, 100);
			} else window.player.play();
		});
	});
});

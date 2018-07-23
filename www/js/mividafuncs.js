(function($) {
	$.fn.src = function(src) {
		console.log(this);
		this.attr('src', src);
	};

	$.create = function(str, obj) {
		let created = $(document.createElement(str));
		if (obj) {
			if (obj.inner) {
				created.html(obj.inner);
			}
			for (key in obj) {
				if (key == 'inner' || key == '$') continue;
				created.attr(key, obj[key]);
			}
			if (obj.isError) {
				created.addClass('error');
			}
			if (obj.$) {
				for (key in obj.$) {
					$(created)[key](obj.$[key]);
				}
			}
		}
		return created;
	};
})(jQuery);

function getQueries() {
	let query = {};
	let index = window.location.href.indexOf('?');
	if (index != -1) {
		let arr = window.location.href.substring(index + 1).split('&');
		arr.forEach(q => {
			let que = q.split('=');
			query[decode(que[0])] = decode(que[1]);
		});
	}
	return query;
}

function decode(str) {
	return decodeURIComponent(str.replace(/\+/g, ' '));
}

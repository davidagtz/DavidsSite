function getQueries() {
	let query = {};
	let index = window.location.href.indexOf("?");
	if(index != -1){
		let arr = window.location.href.substring(index + 1).split("&");
		arr.forEach((q) => {
			let que = q.split("=");
			query[decode(que[0])] = decode(que[1]);
		});
	}
	return query;
}

function decode(str) {
	return decodeURIComponent(str.replace(/\+/g, " "));
}
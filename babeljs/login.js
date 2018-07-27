$(document).ready(() => {
	const query = getQueries();

	if(query.msg){
		let msg = $('<p></p>');
		console.log(query.isError)
		if(query.isError == "true" || query.isError == undefined)
			msg.addClass("error");
		msg.text(query.msg);
		$("#thedeets").prepend(msg);
	}
});
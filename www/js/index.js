$(document).ready(() => {
	let rows = $('#squares').children()
	for(let i = 0; i < rows.length; i++){
		let squares = $(rows[i]).children();
		for(let j = 0; j < squares.length; j++){
			let square = $(squares[j]);
			$.ajax({
				url:"/articles/details",
				complete: (xhr, code) => {
					console.log(xhr);
					let status = xhr.status;
					square.empty();
					if(status == 404) {
						square.append($("<h1>404</h1>"));
						square.append($("<p>Page not found.</p>"))
					}
					else {
						// ADD DETAILS< TITLE< AND IMAGE
					}
				}
			})
		}
	}
});
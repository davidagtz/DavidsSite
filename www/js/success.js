$(document).ready(() => {
	let queries = getQueries();
	let contain = $('#contain');
	if($.isEmptyObject(queries)){
		queries.title = 'Nothing to show here';
	}
	if(queries.title){
		contain.append($.create('h1', {
			inner : queries.title,
			isError : queries.isError
		}));
	}
	if(queries.msg){
		contain.append($.create('p', {
			inner : queries.msg,
			isError : queries.isError
		}));
	}
});
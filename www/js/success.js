$(document).ready(() => {
	let queries = getQueries();
	let contain = $('#contain');
	if($.isEmptyObject(queries)){
		queries.title = 'Nothing to show here';
	}
	if(queries.title){
		contain.append($.create('h1', {
			inner : queries.title
		}));
	}
	if(queries.msg){
		contain.append($.create('p', {
			inner : queries.msg 
		}));
	}
});
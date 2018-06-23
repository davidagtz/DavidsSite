
$(document).ready(() => {
	const query = getQueries();

	if(query.msg){
		let msg = $('<p class="error moveleft5" id="loaded-msg"></p>');
		msg.text(query.msg);
		$("#req").after(msg);
	}

	let req;
	const good = $("<img>");
	good.attr("src", "/res/imgs/checkmark.png");
	good.addClass("user");
	good.addClass("remove");
	good.css("height", $("#user").height());
	good.css("margin-left", "2px");

	$("#user").change(() => {
		let field = $("#user");
		req = $.ajax("/exists", {
			data: {
				type: "account",
				user: $("#user").val()
			},
			success: (data) => {
				if(data.exists){
					$(".remove.user").remove();
					show("user", "Username taken", {
						class: "user"
					});
				}
				else{
					$(".remove.user").remove();
					show("user", "", {
						change: good
					})
				}
			}
		})
	});
});

function validateForm(){
	let isGood = true;
	$(".remove").remove();

	let pwd1 = $("#pwd").val();
	let pwd2 = $("#pwdConfirm").val();

	// check length of passwords and equality
	if(pwd1.length > 72 || pwd.length < 7){
		show('pwd', 'Password must not be more than 72 characters or less than 7 characters.');
		isGood = false;
	}
	if(pwd1 != pwd2){
		show('pwd', 'Passwords do not match.');
		isGood = false;
	}

	let email1 = $("#email").val();
	let email2 = $("#emailConfirm").val();
	
	if(email1 != email2){
		show('email', 'Emails do not match.');
		isGood = false;
	}

	let nameFirst = $("#first").val();
	if(nameFirst == ""){
		show('last', 'Need a first name');
		isGood = false;
	}

	$("#loaded-msg").remove();

	if(isGood)
		$("#signup").submit();
}

/* will append an error that will be removed after each
   validation. Currently, options.class will append classes
   to the error.											*/
function show(id, msg, options) {
	let mes = $('<span class="remove error"> </span>');
	if(options){
		// Nested in case if I want to expand it in the future
		if(options.change){
			mes = options.change;
		}
		if(options.class){
			if(options.class instanceof Array)
				options.class.forEach(theclass => mes.addClass(theclass));
			else
				mes.addClass(options.class);
		}
	}
	mes.text(" " + msg);
	$("#" + id).parent().append(mes);
}
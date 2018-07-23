$(document).ready(() => {
	// for the file preview
	let img = $('#file');
	img.change(() => {
		let reader = new FileReader();
		reader.onload = () => {
			$('#filePreview').src(reader.result);
		};
		reader.readAsDataURL(img[0].files[0]);
	});

	addItem();

	$('#article').change(() => {
		let article = $('#article').val();
		let preview = $('#preview');

		let insert = '';

		while (article != '') {
			console.log('l', article, 'l');
			let i = article.search(/!\d+\s/);
			if (i == -1) i = article.length;
			let t = article.length;
			insert += article.substring(0, i);
			article = article.substring(i);

			if (i == t) {
				console.log('dad');
				break;
			}

			let j = article.search(/\s/);
			let num = article.substring(1, j);
			article = article.substring(j);
			console.log(num, 'index ', i);
		}

		preview.html(insert);
	});
});

function addItem() {
	let list = $('#thelist');
	const l = list.children().length + 1;
	list.append(
		$.create('div', {
			inner: [
				$.create('li', {
					inner: [
						$.create('span', {
							inner: l + '. '
						}),
						$.create('input', {
							id: 'img_' + l,
							name: 'img_' + l,
							value: 'Upload Image',
							accept: 'image/*',
							type: 'file',
							$: {
								change: () => {
									let imgp = $('#imgp_' + l);
									let inp = $('#img_' + l);
									let reader = new FileReader();
									reader.onload = () => {
										imgp.src(reader.result);
									};
									reader.readAsDataURL(inp[0].files[0]);
								}
							}
						}),
						$.create('button', {
							type: 'button',
							onclick: 'deleteItem(img_' + l + ')',
							inner: 'Delete'
						}),
						$.create('break'),
						$.create('img', {
							class: 'preview',
							id: 'imgp_' + l
						})
					]
				}),
				$.create('br')
			]
		})
	);
}

function deleteItem(id) {
	let num =
		+$(id)
			.attr('id')
			.substring('img_'.length) - 1;
	let children = $('#thelist').children();
	const length = children.length;
	for (let i = num; i < length - 1; i++) {
		children[i].children[0].children[4].src =
			children[i + 1].children[0].children[4].src;
	}
	$(children[length - 1]).remove();
}

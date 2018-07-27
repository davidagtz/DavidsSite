$(document).ready(() => {
	let preview = ReactDOM.render(React.createElement(Preview, null), _('#preview'));

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

	$('#article').change(render);
	$('#thelist').bind('img-changed', render);

	function render() {
		preview.setState({ revisions: preview.state.revisions + 1 });
	}
});

function addItem() {
	let list = $('#thelist');
	const l = list.children().length + 1;
	list.append($.create('div', {
		inner: [$.create('li', {
			inner: [$.create('span', {
				inner: l + '. '
			}), $.create('input', {
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
							$('#thelist').trigger('img-changed');
						};
						reader.readAsDataURL(inp[0].files[0]);
					}
				}
			}), $.create('button', {
				type: 'button',
				onclick: 'deleteItem(img_' + l + ')',
				inner: 'Delete'
			}), $.create('break'), $.create('img', {
				class: 'preview',
				id: 'imgp_' + l
			})]
		}), $.create('br')]
	}));
}

function deleteItem(id) {
	let num = +$(id).attr('id').substring('img_'.length) - 1;
	let children = $('#thelist').children();
	const length = children.length;
	for (let i = num; i < length - 1; i++) {
		children[i].children[0].children[4].src = children[i + 1].children[0].children[4].src;
	}
	$(children[length - 1]).remove();
	$('#thelist').trigger('img-changed');
}
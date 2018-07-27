class Preview extends React.Component {
	constructor(props) {
		super(props);
		this.state = { revisions: 0 };
		this.render = this.render.bind(this);
	}

	render() {
		let article = $('#article').val();
		let insert = [];

		while (article != '') {
			// console.log('l', article, 'l');
			let i = article.search(/!\d+\s/);
			if (i == -1) i = article.length;
			let t = article.length;
			insert.push(article.substring(0, i));
			article = article.substring(i);

			if (i == t) {
				// console.log('dad');
				break;
			}

			let j = article.search(/\s/);
			let num = article.substring(1, j);
			article = article.substring(j);
			if (!$('#imgp_' + num).src()) continue;
			insert.push(
				<div key={insert.length} className="ib">
					<img
						src={$('#imgp_' + num).src()}
						className="default"
						id={'e' + insert.length}
					/>
					<ImgButtonBar for={'e' + insert.length} />
				</div>
			);
		}

		return <div>{insert}</div>;
	}
}

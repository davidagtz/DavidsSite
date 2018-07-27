class ImgButtonBar extends React.Component {
	constructor(props) {
		super(props);
		this.grow = this.grow.bind(this);
		this.shrink = this.shrink.bind(this);
	}

	render() {
		return React.createElement(
			"div",
			{ className: "imgEdit" },
			React.createElement(
				"div",
				{ className: "left", onClick: this.grow },
				React.createElement("div", { className: "gro" })
			),
			React.createElement(
				"div",
				{ className: "right", onClick: this.shrink },
				React.createElement("div", { className: "shr" })
			)
		);
	}
	grow() {
		console.log('grow');
		let id = this.props.for;
		let img = $('#' + id);
		let size = img.height() / parseFloat(img.parent().css('font-size'));
		console.log(size);
		img.css('height', size + 1 + 'em');
	}
	shrink() {
		console.log('shrink');
		let id = this.props.for;
		let img = $('#' + id);
		let size = img.height() / parseFloat(img.parent().css('font-size'));
		img.css('height', size - 1 + 'em');
	}
}

ImgButtonBar.propTypes = {
	for: PropTypes.any.isRequired
};
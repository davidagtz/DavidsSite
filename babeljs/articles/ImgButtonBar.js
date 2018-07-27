class ImgButtonBar extends React.Component {
	constructor(props) {
		super(props);
		this.grow = this.grow.bind(this);
		this.shrink = this.shrink.bind(this);
	}

	render() {
		return (
			<div className="imgEdit">
				<div className="left" onClick={this.grow}>
					<div className="gro" />
				</div>
				<div className="right" onClick={this.shrink}>
					<div className="shr" />
				</div>
			</div>
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

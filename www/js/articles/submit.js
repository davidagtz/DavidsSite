$(document).ready(() => {
	let img = $("#file");
	img.change(() => {
		let reader = new FileReader();
		reader.onload = () => {
			$("#filePreview").src(reader.result);
		};
		reader.readAsDataURL(img[0].files[0]);
	});
});
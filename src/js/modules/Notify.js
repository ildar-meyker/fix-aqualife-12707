import $ from "jquery";

const Notify = {
	_counter: 0,

	_handleItemClick(e) {
		e.preventDefault();

		$(e.currentTarget).remove();
	},

	_notify(message, colorType) {
		const uniqueId = ++this._counter;
		$(
			'<div id="notify-' +
				uniqueId +
				'" class="notify__item notify__item--' +
				colorType +
				'">' +
				message +
				"</div>"
		).prependTo($("#notify"));

		setTimeout(() => {
			$("#notify-" + uniqueId).remove();
		}, 8000);
	},

	error(message) {
		this._notify(message, "error");
	},

	warning(message) {
		this._notify(message, "warning");
	},

	success(message) {
		this._notify(message, "success");
	},

	init() {
		$(document).on(
			"click",
			".notify__item",
			this._handleItemClick.bind(this)
		);
	},
};

$(function () {
	Notify.init();
});

export default Notify;

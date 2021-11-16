import $ from "jquery";

const NavTabs = {
	_handleTabClick(e) {
		e.preventDefault();

		const $root = $(e.currentTarget).closest(".nav-tabs");
		const index = $(e.currentTarget).index();

		this.renderView($root, index);
		this.updateTarget($root, index);
	},

	renderView($root, index) {
		$root
			.find(".nav-tabs__item")
			.removeClass("active")
			.eq(index)
			.addClass("active");
	},

	updateTarget($root, index) {
		const target = $root.find(".nav-tabs__item").eq(index).attr("href");
		$(target).siblings().removeClass("active").end().addClass("active");
	},

	init() {
		$(document).on(
			"click",
			".nav-tabs__item",
			this._handleTabClick.bind(this)
		);
	},
};

$(function () {
	NavTabs.init();
});

export default NavTabs;

import $ from "jquery";
import Swiper from "swiper/swiper-bundle";

const SliderSelect = {
	_handleItemClick(e) {
		e.preventDefault();

		const id = $(e.currentTarget).data("id");

		$(e.currentTarget)
			.siblings()
			.removeClass("active")
			.end()
			.addClass("active")
			.closest(".slider-select")
			.find('input[type="hidden"]')
			.val(id);
	},

	init() {
		$(".slider-select").each(function () {
			new Swiper($(this).find(".swiper")[0], {
				mousewheel: true,
				slidesPerView: "auto",
				navigation: {
					prevEl: $(this).find(".slider-select__prev")[0],
					nextEl: $(this).find(".slider-select__next")[0],
				},
			});
		});

		$(document).on(
			"click",
			".swiper-slide",
			this._handleItemClick.bind(this)
		);
	},
};

$(function () {
	SliderSelect.init();
});

export default SliderSelect;

import $ from "jquery";
import "slick-carousel";
import { throttle } from "throttle-debounce";
import Notify from "./Notify";

const SliderGallery = {
	_currentMode: "product",

	_selectors: {
		product: {
			content: "#slider-gallery",
			fullsize: "#popup-gallery",
		},
		"quick-view": {
			content: "#slider-gallery--quick-view",
			fullsize: "#popup-gallery--quick-view",
		},
	},

	_setVideosSize() {
		const ratio = 0.5625;
		const $content = $(
			"#popup-gallery--quick-view .popup-gallery__content"
		);
		const contentW = $content.width();
		const contentH = $content.height();

		if (contentH / contentW <= ratio) {
			var videoH = contentH;
			var videoW = contentH / ratio;
		} else {
			var videoH = contentW * ratio;
			var videoW = contentW;
		}

		$("#popup-gallery--quick-view .popup-gallery__video")
			.add("#popup-gallery .popup-gallery__video")
			.css({
				width: videoW,
				height: videoH,
			});
	},

	_setActiveByIndex($collection, index) {
		$collection
			.eq(index)
			.addClass("active")
			.siblings()
			.removeClass("active");
	},

	_setActiveNavItem(index) {
		this._setActiveByIndex(
			$(this._selectors[this._currentMode].content).find(
				".slider-gallery__nav__item"
			),
			index
		);
		this._setActiveByIndex(
			$(this._selectors[this._currentMode].fullsize).find(
				".popup-gallery__nav__item"
			),
			index
		);
	},

	_setActiveSlide(index) {
		$(
			this._selectors[this._currentMode].content +
				" .slider-gallery__list"
		).slick("slickGoTo", index);
	},

	_updateQuickViewFullsizeSlider(data) {
		$("#popup-gallery--quick-view").html(
			$(data).find("#popup-gallery--quick-view").html()
		);
		this._initFullsizeSlider(
			"#popup-gallery--quick-view",
			"#slider-gallery--quick-view"
		);
	},

	_updateQuickViewContentSlider(data) {
		$("#popup-quick-view .popup__window").html(
			$(data).find(".popup__window").html()
		);
		this._initContentSlider(
			"#popup-gallery--quick-view",
			"#slider-gallery--quick-view"
		);
	},

	_handleNavItemClick(e) {
		e.preventDefault();

		const index = $(e.currentTarget).index();

		this._setActiveNavItem(index);
		this._setActiveSlide(index);
	},

	_handleImageMouseenter(e) {
		$(e.currentTarget).addClass("hover");
	},

	_handleImageMouseleave(e) {
		$(e.currentTarget).removeClass("hover");
	},

	_handleImageMousemove(e) {
		const $item = $(e.currentTarget);
		const w = $item.outerWidth();
		const h = $item.outerHeight();

		$item
			.find(".slider-gallery__zoom")
			.css(
				"background-position",
				`${(e.offsetX / w) * 100}% ${(e.offsetY / h) * 100}% `
			);
	},

	_handleSlideClick(e) {
		e.preventDefault();

		const index = $(e.currentTarget).data("index");

		this._setActiveNavItem(index);
		this._setActiveSlide(index);
		this._setVideosSize();
		this._openFullsize();
	},

	_handleFullsizeClose(e) {
		e.preventDefault();

		this._closeFullsize();
		this._currentMode = "product";
	},

	_handleWindowResize() {
		this._setVideosSize();
	},

	_handleQuickViewOpen(e) {
		e.preventDefault();

		const productId = $(e.currentTarget)
			.closest(".js-quick-view-card")
			.data("product-id");

		const url = $('head meta[name="gallery-data-url"]')
			.attr("content")
			.replace("{id}", productId);

		$("#popup-quick-view").addClass("loading");

		$.get(url)
			.done((data) => {
				this._updateQuickViewContentSlider(data);
				this._updateQuickViewFullsizeSlider(data);

				$("#popup-quick-view .nav-path__window").scrollLeft(9999);
				$("#popup-quick-view").addClass("active");
				this._currentMode = "quick-view";
			})
			.fail(() => {
				$("#popup-quick-view").removeClass("loading");
				Notify.error("Ошибка при запросе: " + url);
			});
	},

	_handleQuickViewClose(e) {
		e.preventDefault();

		$("#popup-quick-view").removeClass("loading active");
	},

	_initContentSlider(fullsizeSelector, contentSelector) {
		$(contentSelector)
			.find(".slider-gallery__list")
			.slick({
				asNavFor: fullsizeSelector + " .popup-gallery__list",
				arrows: false,
				slidesToShow: 1,
				dots: true,
				swipe: false,
				speed: 0,
				responsive: [
					{
						breakpoint: 1220,
						settings: {
							swipe: true,
							speed: 300,
						},
					},
				],
			});
	},

	_initFullsizeSlider(fullsizeSelector, contentSelector) {
		$(fullsizeSelector + " .popup-gallery__list").slick({
			asNavFor: contentSelector + " .slider-gallery__list",
			arrows: false,
			slidesToShow: 1,
			slidesToScroll: 1,
			dots: false,
		});
	},

	_closeFullsize() {
		$(this._selectors[this._currentMode].fullsize).removeClass("active");
		$("body").removeClass("page__lock");
	},

	_openFullsize() {
		$(this._selectors[this._currentMode].fullsize).addClass("active");
		$("body").addClass("page__lock");
	},

	init() {
		$(document).on(
			"click",
			".slider-gallery__nav__item, .popup-gallery__nav__item",
			this._handleNavItemClick.bind(this)
		);

		$(document).on(
			"mouseenter",
			".slider-gallery__item",
			this._handleImageMouseenter.bind(this)
		);

		$(document).on(
			"mouseleave",
			".slider-gallery__item",
			this._handleImageMouseleave.bind(this)
		);

		$(document).on(
			"mousemove",
			".slider-gallery__item",
			this._handleImageMousemove.bind(this)
		);

		$(document).on(
			"click",
			".slider-gallery__item",
			this._handleSlideClick.bind(this)
		);

		$(document).on(
			"click",
			".popup-gallery__close",
			this._handleFullsizeClose.bind(this)
		);

		$(document).on(
			"click",
			".js-quick-view-open",
			this._handleQuickViewOpen.bind(this)
		);

		$(document).on(
			"click",
			".js-quick-view-close",
			this._handleQuickViewClose.bind(this)
		);

		$(window).on(
			"resize",
			throttle(250, this._handleWindowResize.bind(this))
		);

		$(document).on(
			"afterChange",
			".slider-gallery__list",
			(event, slick, currentSlide) => {
				this._setActiveNavItem(currentSlide);
			}
		);

		$(document).on(
			"afterChange",
			".popup-gallery__list",
			(event, slick, currentSlide) => {
				this._setActiveNavItem(currentSlide);
			}
		);

		this._initContentSlider("#popup-gallery", "#slider-gallery");
		this._initFullsizeSlider("#popup-gallery", "#slider-gallery");
	},
};

$(function () {
	SliderGallery.init();
});

export default SliderGallery;

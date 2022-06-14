$(function () {
    $('.top-block__slider').slick({
        arrows: true,
        dots: false,
        adaptiveHeight: true,
        infinite: false,
        speed: 1000,
        easing: 'ease',
        autoplay: true,
        autoplaySpeed: 5000,
        slidesToShow: 1,
        slidesToScroll: 1,
        pauseOnFocus: true,
        pauseOnHover: true,
        pauseOnDotsHover: true,
        responsive: [{
            breakpoint: 540,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false,
                dots: true,
            }
        }]
    });
});

$(function () {
    $('.popular-products__slider, .business-services__slider').slick({
        arrows: false,
        dots: false,
        adaptiveHeight: true,
        infinite: true,
        speed: 1000,
        easing: 'ease',
        autoplay: false,
        variableWidth: true,
    });
});
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

const hamb = document.querySelector("#hamb");
const popup = document.querySelector("#popup");
const menu = document.querySelector("#menu").cloneNode(1);
const body = document.body;

hamb.addEventListener("click", hambHandler);

function hambHandler(e) {
    e.preventDefault();
    popup.classList.toggle("open");
    hamb.classList.toggle("active");
    body.classList.toggle("noscroll");
    renderPopup();
}

function renderPopup() {
    popup.appendChild(menu);
}

// Код для закрытия меню при нажатии на ссылку

const links = Array.from(menu.children);

links.forEach((link) => {
    link.addEventListener("click", closeOnClick);
});

function closeOnClick() {
    popup.classList.remove("open");
    hamb.classList.remove("active");
    body.classList.remove("noscroll");
}


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

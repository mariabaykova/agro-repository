const bookRateButton = document.querySelector("#button-book-currency-1");
const buyCurrButton = document.querySelector("#button-buy-currency-1");

const currMainBlock = document.querySelector(".currency__main");
const currInitialBlock = document.querySelector(".currency__initial");


// console.log("currInitialBlock " + currInitialBlock);

// забрать курсы валют




// обработка клика на кнопку "забронировать курс"
bookRateButton.addEventListener("click", (event) => {
    // показать блок currency__main
    showBlock(currMainBlock, "grid");
    // скрыть блок currency__initial
    hideBlock(currInitialBlock);
});

// обработка клика на кнопку "купить валюту"
buyCurrButton.addEventListener("click", (event) => {

});


function hideBlock( elem ) {
    elem.style.display = "none";
}

function showBlock( elem, display ) {
    elem.style.display = display;
}
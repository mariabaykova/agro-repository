const bookRateButton = document.querySelector("#button-book-currency-1");
const buyCurrButton = document.querySelector("#button-buy-currency-1");

const currMainBlock = document.querySelector(".currency__main");
const currInitialBlock = document.querySelector(".currency__initial");

const currItemsBlock = document.querySelector(".currency__items");
const currNamesBlock = document.querySelector(".currency__names");
const currCBBlock = document.querySelector(".currency__cb-block");
const currBuyBlock= document.querySelector(".currency__buy-block");
const currSellBlock = document.querySelector(".currency__sell-block");

const rateTypeCheckbox = document.getElementsByName("rate-type");
const rateTypePopup = document.querySelector("#rate-type-popup");
let selectedPayType = "";

// console.log("currInitialBlock " + currInitialBlock);

// откуда забрать курсы валют
const urlApi = `https://www.cbr-xml-daily.ru/daily_json.js`;
// где лежат иконки валют
const iconsPath = "../../assets/images/currency/";
// список валют для показа по умолчанию в обоих блоках
const currenciesToInitial = [
    {
        "id": "EUR",
        "icon" : "eur-icon.svg"
    },
    {
        "id": "USD",
        "icon" : "usd-icon.svg"
    },
    {
        "id": "CNY",
        "icon" : "cny-icon.svg"
    }
];

// коэффициент комиссии по типам рассчета + покупка или продажа
const exchangeCoef = {
    "cash" : 1,
    "cards" : 1.1,
    "online-bank" : 1.15,
    "sell" : 1.23,
    "buy" : 1.05
};
// по умолчанию, если вдруг не выбран тип рассчетов, пусть будет кэш
const defaultPayType = "cash";

const rubSign = "₽";

// где храним курсы валют
let exchangeRatesInfo = {};

getData(urlApi);

// обработка клика на кнопку "забронировать курс"
bookRateButton.addEventListener("click", (event) => {
    // показать блок currency__main
    showBlock(currMainBlock, "grid");
    // скрыть блок currency__initial
    hideBlock(currInitialBlock);
});

// обработка клика (или изменения) на поле с первым числом
// обработка клика (или изменения) на поле со вторым числом
// обработка клика на выбор валюты 1
// обработка клика на выбор валюты 2

// обработка выбора курса для обмена (cash, cards...)
// менять для радио и селекта

// обработка клика на кнопку "купить валюту"
buyCurrButton.addEventListener("click", (event) => {

});

// забрать курсы валют из источника и заполнить зависимые от этого элементы в блоке currency
function getData( url ) {
    console.log("getData started");
    fetch(url)
    .then( response => {
            // console.log("responce " + response.status);
            if ( !response.ok ) {
                throw Error( "Статус " + response.status + " при попытке обратиться к " + url );
            }
            return response.json()
        }
    )
    .then(result => {
        // console.log("result " + result);
        // console.log("result[Valute] " + result["Valute"] );
        // console.log( "result[Valute][AUD] " + result["Valute"]["AUD"] );
        // console.log( "result[Valute][AUD][Name] " + result["Valute"]["AUD"]["Name"] );
        exchangeRatesInfo = result["Valute"];
        console.log( "exchangeRatesInfo[AUD] " + exchangeRatesInfo["AUD"] );
        console.log( "exchangeRatesInfo[AUD][Name] " + exchangeRatesInfo["AUD"]["Name"] );

        // заполнить курсы трех валют в currency__initial
        // очистить то, что в html по умолчанию
        clearBlock(currItemsBlock);

        // заполнить блок снова уже с курсами из json
        for ( let i = 0; i < currenciesToInitial.length; i++ ) {
            let currencyItem = addBlock( "div", { "class": "currency__item" }, currItemsBlock );
            let currencyName = addBlock( "div", { "class": "currency__name" }, currencyItem );
            let ico = addBlock( 
                        "img", 
                        { 
                            "class": "currency__icon",
                            "src": iconsPath + currenciesToInitial[i]["icon"],
                            "alt": "currency icon"
                     
                        }, 
                        currencyName 
            );

            let currencyType = addBlock( "div", { "class": "currency__type" }, currencyName );
            currencyType.textContent = "1 " + currenciesToInitial[i]["id"];

            // цена валюты в рублях
            let currencyPrice = addBlock( "div", { "class": "currency__price" }, currencyItem );
            currencyPrice.textContent = exchangeRatesInfo[currenciesToInitial[i]["id"]]["Value"].toFixed(2) + " " + rubSign;
        }

        // перед заполнением курсов трех валют нужно узнать, что выбрано, кэш, карты, онлайн
        // console.log("rateTypeCheckbox " + rateTypeCheckbox);
        selectedPayType = checkedRadio( rateTypeCheckbox );
        // console.log("selectedPayType " + selectedPayType);

        // console.log("rateTypePopup " + rateTypePopup);
        // сделать выпадающему списку типов рассчетов такое же значение
        checkSelect(rateTypePopup, selectedPayType );

        // вынести в функцию
        // заполнить курсы валют (покупка, продажа, ЦБ в currency__main)
        // пройдем по списку валют для показа еще раз, их всего 3, так что не критично
        for ( let i = 0; i < currenciesToInitial.length; i++ ) {
            // наименования валют + иконки
            let currencyName = addBlock( "div", { "class": "currency__name" }, currNamesBlock );
            let ico = addBlock( 
                "img", 
                { 
                    "class": "currency__icon",
                    "src": iconsPath + currenciesToInitial[i]["icon"],
                    "alt": "currency icon"
             
                }, 
                currencyName 
            );
            let currencyType = addBlock( "div", { "class": "currency__type" }, currencyName );
            currencyType.textContent = "1 " + currenciesToInitial[i]["id"];
            
            // колонка "покупка"
            let currencyPriceBuy = addBlock( "div", { "class": "currency__price" }, currBuyBlock );
            currencyPriceBuy.textContent = ( exchangeCoef[selectedPayType] * exchangeCoef["buy"] * exchangeRatesInfo[currenciesToInitial[i]["id"]]["Value"]).toFixed(2) + " " + rubSign;

            // колонка "продажа"
            let currencyPriceSell = addBlock( "div", { "class": "currency__price" }, currSellBlock );
            currencyPriceSell.textContent = ( exchangeCoef[selectedPayType] * exchangeCoef["sell"] * exchangeRatesInfo[currenciesToInitial[i]["id"]]["Value"]).toFixed(2) + " " + rubSign;

            // колонка ЦБ
            let currencyPriceCB = addBlock( "div", { "class": "currency__price" }, currCBBlock );
            currencyPriceCB.textContent = ( exchangeRatesInfo[currenciesToInitial[i]["id"]]["Value"]).toFixed(2) + " " + rubSign;

        }

        // заполнить наименования валют в калькуляторе
        


    })
    .catch(error => {
            console.log("Ошибка при загрузке данных " + error);
            console.log("error " + typeof error);
            // for ( let key in error ) {
            //     console.log("key " + key );
            // }
    } )
    ;
    console.log("getData finished");

}

function checkSelect( elem, val ) {
    for ( let s of elem ) {
        // console.log(s);
        s.selected = false;
        if ( s.value == val ) {
            s.selected = true;
            return;
        }
        // console.log(s.selected);

    }
}

function checkCheckbox( elem, val ) {
    for ( let p of elem ) {
        if ( p.value == val ) {
            p.checked = true;
            return;
        } 
    }
}

// какой value элемента select выбран
function checkedSelect( elem ) {
    console.log("checkedSelect started");
    console.log("elem " + elem);
    console.log("checkedSelect finished");
}

// какой value элемента radio-список выбран
function checkedRadio( elem ) {
    for ( let p of elem ) {
        if ( p.checked ) {
            return p.value;
        } 
    }
    // если попали сюда, значит ничего не выбрано, хотя, этого не может быть
    return defaultPayType;
}

// очистка блока
function clearBlock( block ) {
    let blockLength = block.children.length;
    for ( let ii = 0; ii < blockLength; ii++ ) {
        block.removeChild(block.lastElementChild);
    }
}

// добавить блок childBlock с параметрами paramList в parentBlock
function addBlock( childBlock, paramList, parentBlock ) {
    let newElem = document.createElement(childBlock);
    for ( let ii in paramList ) {
        newElem.setAttribute(ii, paramList[ii]);
    }
    parentBlock.appendChild(newElem);
    return newElem;

}

function hideBlock( block ) {
    block.style.display = "none";
}

function showBlock( block, display ) {
    block.style.display = display;
}
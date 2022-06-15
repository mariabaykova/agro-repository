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
// тут будем запоминать тип рассчетов кэш, карты или онлайн
let selectedPayType = "";

// первая и вторая типы валют в калькуляторе
const currencyType1st = document.querySelector("#currency-type-1");
const currencyType2nd = document.querySelector("#currency-type-2");

// первое и второе числа в калькуляторе
const firstCalcVal = document.querySelector("#calc-first-num");
const secondCalcVal = document.querySelector("#calc-second-num");

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

// где будем хранить курсы валют
let exchangeRatesInfo = {};

getData(urlApi);

// обработка клика на кнопку "забронировать курс"
bookRateButton.addEventListener("click", (event) => {
    // показать блок currency__main
    showBlock(currMainBlock, "grid");
    // скрыть блок currency__initial
    hideBlock(currInitialBlock);
});

// обработка изменения на поле с первым числом в калькуляторе
firstCalcVal.addEventListener( "input", () => {
    // selectedPayType - здесь должен быть определен, но если вдруг не определен, берем его из выпадающего списка:
    selectedPayType = rateTypePopup.value;
    // узнаем, какие валюты выбраны в калькуляторе
    const fromCurr = currencyType1st.value;
    const toCurr = currencyType2nd.value;

    secondCalcVal.value = (Calc( firstCalcVal.value, fromCurr, toCurr ) * exchangeCoef[selectedPayType]).toFixed(2);
});

// обработка изменения на поле со вторым числом
secondCalcVal.addEventListener( "input", (event) => {
    // selectedPayType - здесь должен быть определен, но если вдруг не определен, берем его из выпадающего списка:
    selectedPayType = rateTypePopup.value;
    // узнаем, какие валюты выбраны в калькуляторе
    const fromCurr = currencyType1st.value;
    const toCurr = currencyType2nd.value;

    firstCalcVal.value = (Calc( secondCalcVal.value, toCurr, fromCurr ) / exchangeCoef[selectedPayType]).toFixed(2);
});
// обработка выбора валюты 1
currencyType1st.addEventListener("change", (event) => {
    // selectedPayType - здесь должен быть определен, но если вдруг не определен, берем его из выпадающего списка:
    selectedPayType = rateTypePopup.value;
    // узнаем, какие валюты выбраны в калькуляторе
    const fromCurr = currencyType1st.value;
    const toCurr = currencyType2nd.value;

    secondCalcVal.value = (Calc( firstCalcVal.value, fromCurr, toCurr ) * exchangeCoef[selectedPayType]).toFixed(2);
});
// обработка выбора валюты 2
currencyType2nd.addEventListener("change", (event) => {
    // selectedPayType - здесь должен быть определен, но если вдруг не определен, берем его из выпадающего списка:
    selectedPayType = rateTypePopup.value;
    // узнаем, какие валюты выбраны в калькуляторе
    const fromCurr = currencyType1st.value ;
    const toCurr = currencyType2nd.value;
    let res = Calc( firstCalcVal.value, fromCurr, toCurr );

    secondCalcVal.value = res ? (res * exchangeCoef[selectedPayType]).toFixed(2) : "";
});
// обработка выбора способа обмена (cash, cards...) через выпадающий список
rateTypePopup.addEventListener( "change", ( event ) => {
    selectedPayType = event.target.value;
    // выберем то же значение для radio выбора
    checkRadio( rateTypeCheckbox, selectedPayType );
    // пересчет и перестроение секции с курсами трех валют
    showMainRates();
    // пересчет калькулятора
    const fromCurr = currencyType1st.value;
    const toCurr = currencyType2nd.value;
    let res = Calc( firstCalcVal.value, fromCurr, toCurr );

    secondCalcVal.value = res ? (res * exchangeCoef[selectedPayType]).toFixed(2) : "";
});

// обработка выбора способа обмена (cash, cards...) через radio-список
for ( let i of rateTypeCheckbox ) {
    i.addEventListener( "change", (event) => {
        selectedPayType = event.target.value;
        // выберем то же значение для select-варианта
        checkSelect( rateTypePopup, selectedPayType );
        // пересчет секции с курсами трех валют
        showMainRates();
        // пересчет калькулятора
        // узнаем, какие валюты выбраны в калькуляторе
        const fromCurr = currencyType1st.value;
        const toCurr = currencyType2nd.value;
        let res = Calc( firstCalcVal.value, fromCurr, toCurr );

        secondCalcVal.value = res ? (res * exchangeCoef[selectedPayType]).toFixed(2) : "";
    });
}

// обработка клика на кнопку "купить валюту"
buyCurrButton.addEventListener("click", ( event ) => {
    // пока заглушено модальным окном
});


// вычисление стоимости валют для калькулятора
function Calc( firstVal, firstCurr, secondCurr ) {
    if ( Number(firstVal) <= 0 ) {
        return "";
    }
    // нам понядобятся:
    // стоимость в рублях одного firstCurr
    const firstCurrPrice = Number(exchangeRatesInfo[firstCurr]["Value"]) / Number(exchangeRatesInfo[firstCurr]["Nominal"]);
    // стоимость в рублях одного secondCurr
    const secondCurrPrice = Number(exchangeRatesInfo[secondCurr]["Value"]) / Number(exchangeRatesInfo[secondCurr]["Nominal"]);


    return (Number(firstVal) * ( firstCurrPrice / secondCurrPrice )).toFixed(2); 
}

// забрать курсы валют из источника и заполнить зависимые от этого элементы в блоке currency
function getData( url ) {
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
        exchangeRatesInfo = result["Valute"];
        // добавить блок с рублем для корректной работы калькулятора
        exchangeRatesInfo["RUB"] = {
            "CharCode": "RUB",
            "Nominal": 1,
            "Name": "Рубль",
            "Value": 1,
            "Previous": 1
        };

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

        // перед заполнением курсов обмена трех валют нужно узнать, что выбрано, кэш, карты, онлайн
        selectedPayType = checkedRadio( rateTypeCheckbox );
        // сделать выпадающему списку типов рассчетов такое же значение
        checkSelect(rateTypePopup, selectedPayType );

        // заполнить курсы валют (покупка, продажа, ЦБ в currency__main)
        showMainRates();

        // заполнить наименования валют в калькуляторе
        clearBlock(currencyType1st);
        clearBlock(currencyType2nd);
        for ( r in exchangeRatesInfo ) {
            let curr = addBlock( "option", { "value": r }, currencyType1st );
            curr.textContent = exchangeRatesInfo[r]["Name"];
            curr = addBlock( "option", { "value": r }, currencyType2nd );
            curr.textContent = exchangeRatesInfo[r]["Name"];
        }

    })
    .catch(error => {
            console.log("Ошибка при загрузке данных " + error);
    } )
    ;

}

// показать курсы 3 валют в блоке currency
// перестраивается в зависимости от типа рассчета (кэш, карты, онлайн)
function showMainRates() {
            // очистить блоки, в которых будем показывать курсы
            clearBlock(currNamesBlock);
            clearBlock(currBuyBlock);
            clearBlock(currSellBlock);
            clearBlock(currCBBlock);
            let title = addBlock( "h5", { "class": "currency__title" }, currNamesBlock );
            title.textContent = "Валюта";
            title = addBlock( "h5", { "class": "currency__title" }, currBuyBlock );
            title.textContent = "Покупка";
            title = addBlock( "h5", { "class": "currency__title" }, currSellBlock );
            title.textContent = "Продажа";
            title = addBlock( "h5", { "class": "currency__title" }, currCBBlock );
            title.textContent = "ЦБ";
            // пройдем по списку валют для показа , их всего 3
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
    
}

// установить значение селекту
function checkSelect( elem, val ) {
    for ( let s of elem ) {
        s.selected = false;
        if ( s.value == val ) {
            s.selected = true;
            return;
        }
    }
}

function checkRadio( elem, val ) {
    for ( let p of elem ) {
        if ( p.value == val ) {
            p.checked = true;
            return;
        } 
    }
}

// какой value элемента select выбран
function checkedSelect( elem ) {
    for ( let s of elem ) {
        if ( s.selected ) {
            return s.value;
        } 
    }
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
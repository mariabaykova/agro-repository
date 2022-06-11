const wrapperElem = document.querySelector(".wrapper");
const shadowElem = document.querySelector("#wrapper-shadow");
const bodyElem = document.querySelector("body");

let modalWindowElem;

const buttonElems = document.querySelectorAll(".dummy");

const modalWindowMessages = {
    "button-online-bank-1" :
    {
        id: "button-online-bank-1",
        message : "Переход в раздел он-лайн банка"
    },
    "button-details-1" : { 
        id: "button-details-1", 
        message: "Переход к более подробной информации о вкладе"
    },
};

shadowElem.style.display = "none";

let btnTarget;
let btn;
for ( let i = 0; i < buttonElems.length; i++ ) {
    btn = buttonElems[i];
    btn.addEventListener( "click", handleButtonClick);
        
}

function handleButtonClick( e ) {
    // запоминаем кнопку, на которую нажали
    btnTarget = e.target; 
    try {
        modalWindowElem = openModalWindow(modalWindowMessages[this.id]["message"]);
    } catch (error) {
        console.error(error);
        modalWindowElem = openModalWindow("Этот функционал в разработке");
    }
    // включить прослушку клика всего документа
    document.addEventListener( "click", handleDocumentClick);

}

function handleDocumentClick( e1 ) {
    let target = e1.target;
    // если окно уже открыто и клик - это не нажатие на кнопку
    if ( modalWindowElem && ( btnTarget != target ) ) {
        if ( modalWindowElem.contains(target) ) {
            // кликнули по модальному окну, ничего не делать пока
          } else {
            closeModalWindow( modalWindowElem );
            // убрать прослушку всего документа
            document.removeEventListener('click', handleDocumentClick);
          }
    }

}

// открыть модальное окно
function openModalWindow( message ) {
    // создать окно
    const modalWin = document.createElement("div");
    modalWin.classList.add("modal-window");
    setTimeout(() => {
        // для плавного открытия окна небольшой таймаут, чтобы окно сначала добавилось прозрачным, а потом сстало плавно непрозрачным
        modalWin.classList.add("modal-window_open");
      }, "10");

    // затемнить страницу
    shadowElem.style.display = "";
    // отменить прокрутку
    bodyElem.classList.add("scroll-cancel");

    const messageBox = document.createElement("div");
    messageBox.classList.add("message");

    messageBox.textContent = message;
    modalWin.appendChild(messageBox);

      //добавить окно в документ
      wrapperElem.appendChild(modalWin);

      return modalWin;
}
// закрыть модальное окно
function closeModalWindow( elem ) { 
    // окно убрать
    elem.remove();
     // растемнить страницу
    shadowElem.style.display = "none";
    // включить прокрутку
    bodyElem.classList.remove("scroll-cancel");
}
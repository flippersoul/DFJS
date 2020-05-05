const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

function toggleModal() {
  modal.classList.toggle("is-open");
}



//day 1

const buttonAuth = document.querySelector(".button-auth");
const modalAuth = document.querySelector(".modal-auth");
const closeAuth = document.querySelector(".close-auth");
const logInForm = document.querySelector("#logInForm");
const loginInput = document.querySelector("#login ");
const userName = document.querySelector(".user-name");
const buttonOut = document.querySelector(".button-out");


let login = localStorage.getItem('gloDelivery');

// console.log(modalAuth);

//для вывода структуры console.dir(modalAuth);  

function toggleModalAuth() {
  modalAuth.classList.toggle("is-open");
}



function authorized(){


  function logOut (){
    login = null;
    localStorage.removeItem('gloDelivery');
    //чтобы значения вернулись к первоначальным как в css
    buttonAuth.style.display = '';
    userName.style.display = ''; 
    buttonOut.style.display = '';
    buttonOut.removeEventListener('click', logOut);

    checkAuth();
  }

  userName.textContent = login;

  console.log('Авторизован');
  buttonAuth.style.display = 'none';
  userName.style.display = 'inline'; 
  buttonOut.style.display = 'block'; 
  buttonOut.addEventListener('click', logOut);
}

function notAuthorized(){

  function logIn(event){
    // console.log(event);
    //отмена перезагрузки страницы 
    event.preventDefault();
    login = loginInput.value;

    //Чтобы данные оставались при перезагрузке
    localStorage.setItem('gloDelivery', login);

    // console.log(login);
    if((typeof(login)) === 'string' && login != '' && (typeof(login)) != null && login.length < 50){
      console.log('Все верно');  
      toggleModalAuth();
      //console.log('Логин');
      buttonAuth.removeEventListener('click', toggleModalAuth);
      closeAuth.removeEventListener('click', toggleModalAuth);
      logInForm.removeEventListener('submit', logIn);    
      logInForm.reset();
      checkAuth(); 
    } else{
      alert('Ошибка при вводе');
   }
  }

  console.log('Не авторизован');
  buttonAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', toggleModalAuth);
  logInForm.addEventListener('submit', logIn);

}

function checkAuth(){
  if (login){
    authorized()
   }else {
    notAuthorized() 
   }
};

checkAuth();
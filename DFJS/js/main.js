'use strict';



const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector(".button-auth");
const modalAuth = document.querySelector(".modal-auth");
const closeAuth = document.querySelector(".close-auth");
const logInForm = document.querySelector("#logInForm");
const loginInput = document.querySelector("#login ");
const userName = document.querySelector(".user-name");
const buttonOut = document.querySelector(".button-out");
const cardsRestaurants = document.querySelector(".cards-restaurants");
const containerPromo = document.querySelector(".container-promo");
const restaurants = document.querySelector(".restaurants");
const menu = document.querySelector(".menu");
const logo = document.querySelector(".logo");
const cardsMenu = document.querySelector(".cards-menu");





let login = localStorage.getItem('gloDelivery');

//console.log(login);
function toggleModal() {
  modal.classList.toggle("is-open");
};


// console.log(modalAuth);

//для вывода структуры console.dir(modalAuth);  

function toggleModalAuth() {
  modalAuth.classList.toggle("is-open");
};



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
  };

  userName.textContent = login;

  console.log('Авторизован');
  buttonAuth.style.display = 'none';
  userName.style.display = 'inline'; 
  buttonOut.style.display = 'block'; 
  buttonOut.addEventListener('click', logOut);
};

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



//Чтобы вставить верстку
function createCardRestaurant(){
    const card =  `
          <a class="card card-restaurant">
          <img src="img/tanuki/preview.jpg" alt="image" class="card-image"/>
          <div class="card-text">
            <div class="card-heading">
              <h3 class="card-title">Тануки</h3>
              <span class="card-tag tag">60 мин</span>
            </div>
            <!-- /.card-heading -->
            <div class="card-info">
              <div class="rating">
                4.5
              </div>
              <div class="price">От 1 200 ₽</div>
              <div class="category">Суши, роллы</div>
            </div>
            <!-- /.card-info -->
          </div>
          <!-- /.card-text -->
        </a>
        <!-- /.card -->
     `;

    //Метод вставки верстки на страницу
    cardsRestaurants.insertAdjacentHTML('beforeend', card);

};

//элемент event событие создается в момент действия
//например, при клике
//target хранит событие что кликнул именно по нужному элементу

function createCardGood(){
  //Создание жлементов другим способом
  const card = document.createElement('div');
  card.className = 'card';
  card.insertAdjacentHTML('beforeend', `
        <img src="img/pizza-plus/pizza-classic.jpg" alt="image" class="card-image"/>
        <div class="card-text">
          <div class="card-heading">
            <h3 class="card-title card-title-reg">Пицца Классика</h3>
          </div> 
          <div class="card-info">
            <div class="ingredients">Соус томатный, сыр «Моцарелла», сыр «Пармезан», ветчина, салями,
              грибы.
            </div>
          </div>
          <div class="card-buttons">
            <button class="button button-primary button-add-cart">
              <span class="button-card-text">В корзину</span>
              <span class="button-cart-svg"></span>
            </button>
            <strong class="card-price-bold">510 ₽</strong>
          </div>
        </div>
  `);
  cardsMenu.insertAdjacentElement('beforeend', card);
}; 

function openGoods(event) {
    const target = event.target; 
    //поднимается выше, пока не найдет элемент с указанным селектором
    const restaurant = target.closest('.card-restaurant');
    //console.log(restaurant);
    if(restaurant && login){

        console.log('Выполняется');
        cardsMenu.textContent = ''; 
        containerPromo.classList.add('hide');  
        restaurants.classList.add('hide');  
        menu.classList.remove('hide'); 

       

       createCardGood();
       createCardGood();
       createCardGood();
      

    }else{
      toggleModalAuth();
    }


};



cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

cardsRestaurants.addEventListener('click', openGoods);
logo.addEventListener('click', function(){
  containerPromo.classList.remove('hide');  
  restaurants.classList.remove('hide');  
  menu.classList.add('hide');
});

checkAuth();

createCardRestaurant();
createCardRestaurant();
createCardRestaurant();

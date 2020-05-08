'use strict'

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector('.button-auth')
const modalAuth = document.querySelector('.modal-auth')
const closeAuth = document.querySelector('.close-auth')
const loginForm = document.querySelector('#logInForm')
const loginInput = document.querySelector('#login')
const userName = document.querySelector('.user-name')
const buttonOut = document.querySelector('.button-out')
const cardsRestaurants = document.querySelector('.cards-restaurants')
const containerPromo = document.querySelector('.container-promo')
const restaurants = document.querySelector('.restaurants')
const menu = document.querySelector('.menu')
const logo = document.querySelector('.logo')
const cardsMenu = document.querySelector('.cards-menu')
const restaurantTitle = document.querySelector('.restaurant-title')
const rating = document.querySelector('.rating')
const minPrice = document.querySelector('.price')
const category = document.querySelector('.category')
const inputSearch = document.querySelector('.input-search')
const modalBody = document.querySelector('.modal-body')
const modalPrice = document.querySelector('.modal-pricetag')
const buttonClearCart = document.querySelector('.clear-cart')
let login = localStorage.getItem('gloDelivery');

const cart = []
const loadCart = function() {
  if(localStorage.getItem(login)) {
    JSON.parse(localStorage.getItem(login)).forEach(item => {
      cart.push(item)
    })
  }
}

console.log(cart);

const saveCart = function() {
  localStorage.setItem(login, JSON.stringify(cart))
}


const getData = async function(url) {
  const response = await fetch(url)
  if(!response.ok) {
    throw new Error(`Ошибка по адресу ${url}, статус ошибки ${response.status}!`)
  }
  return await response.json()
  
}

getData('./db/partners.json')

const valid = (str) => {
  const nameReg = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/
  return nameReg.test(str)
}
valid()

const toggleModal = () => {
  modal.classList.toggle("is-open");
}

const toggleModalAuth = () => {
  modalAuth.classList.toggle('is-open')
}

function returnMain() {
  containerPromo.classList.remove('hide')
  restaurants.classList.remove('hide')
  menu.classList.add('hide')
}

function authorized() {
  function logOut() {
    login = null
    cart.length = 0
    localStorage.removeItem('gloDelivery')
    buttonAuth.style.display = ''
    userName.style.display = ''
    buttonOut.style.display = ''
    cartButton.style.display = ''
    buttonOut.removeEventListener('click', logOut)
    
    checkAuth()
    returnMain()
  }

  userName.textContent = login
  buttonAuth.style.display = 'none'
  userName.style.display = 'inline'
  buttonOut.style.display = 'flex'
  cartButton.style.display = 'flex'
  buttonOut.addEventListener('click', logOut)
  loadCart()
}

function notAuthorized() {
  
  function logIn(e) {
    e.preventDefault()
    if(valid(loginInput.value)) {
      login = loginInput.value
      localStorage.setItem('gloDelivery', login)
    toggleModalAuth()
    buttonAuth.removeEventListener('click', toggleModalAuth)
    closeAuth.removeEventListener('click', toggleModalAuth)
    logInForm.removeEventListener('submit', logIn)
    logInForm.reset()
    checkAuth()
    } else {
      loginInput.style.borderColor = 'red'
      loginInput.value = ''
    }
  }
  buttonAuth.addEventListener('click', toggleModalAuth)
  closeAuth.addEventListener('click', toggleModalAuth)
  logInForm.addEventListener('submit', logIn)
  
}

function checkAuth() {
  if(login) {
    authorized()
  } else {
  notAuthorized()
  }
}
checkAuth()

function createCardRestaurant(restaurant) {//карточка ресторана
  const { image, kitchen, name, price, stars, products, time_of_delivery: timeOfDelivery } = restaurant

  const card = document.createElement('a');
  card.className = 'card card-restaurant'
  card.products = products
  card.info = [name, price, stars, kitchen]
  
  card.insertAdjacentHTML('beforeend', `
 
                  <img src="${image}" alt="image" class="card-image"/>
                  <div class="card-text">
                    <div class="card-heading">
                      <h3 class="card-title">${name}</h3>
                      <span class="card-tag tag">${timeOfDelivery} мин</span>
                    </div>
                    <div class="card-info">
                      <div class="rating">
                        ${stars}
                      </div>
                      <div class="price">От ${price} ₽</div>
                      <div class="category">${kitchen}</div>
                    </div>
                  </div>
                  `)
                  
                cardsRestaurants.insertAdjacentElement('beforeend', card)
}


function createCardGood({ description, image, name, price, id }) {//Карточки товаров конкретного ресторана
  
  const card = document.createElement('div')
  
  card.className = 'card'
  //card.id = id
  card.insertAdjacentHTML('beforeend',`
                      <img src="${image}" alt="${name}" class="card-image"/>
                      <div class="card-text">
                        <div class="card-heading">
                          <h3 class="card-title card-title-reg">${name}</h3>
                        </div>
                        <div class="card-info">
                          <div class="ingredients">${description}
                          </div>
                        </div>
                        <div class="card-buttons">
                          <button class="button button-primary button-add-cart" id="${id}">
                            <span class="button-card-text">В корзину</span>
                            <span class="button-cart-svg"></span>
                          </button>
                          <strong class="card-price card-price-bold">${price} ₽</strong>
                        </div>
                      </div>
                    `)
                    cardsMenu.insertAdjacentElement('beforeend', card)
}

function openGoods(e) {
  
  const target = e.target
  if(login) {
    const restaurant = target.closest('.card-restaurant')//вся карточка
    if(restaurant) {
      
      const [ name, price, stars, kitchen ] = restaurant.info;
    
    cardsMenu.textContent = ''//очищаем, чтоб не дублировались при повторном входе
      
    containerPromo.classList.add('hide')
    restaurants.classList.add('hide')
    menu.classList.remove('hide')
      restaurantTitle.textContent = name;
      rating.textContent = stars;
      minPrice.textContent = 'От ' +  price + ' ₽';
      category.textContent = kitchen;

      getData(`./db/${restaurant.products}`).then(data => {
        data.forEach(createCardGood)
      });
    }
    
  } else {//если не авторизованы - вызываем модальное окно
    toggleModalAuth()
  }
}

function addToCart(e) {
  
  
  const target = e.target
  const buttonAddToCart = target.closest('.button-add-cart')

  if(buttonAddToCart) {
    const card = target.closest('.card')
    const title = card.querySelector('.card-title-reg').textContent
    const cost = card.querySelector('.card-price').textContent
    const id = buttonAddToCart.id
    console.log(title, cost, id);
    const food = cart.find((item) => {
      return item.id === id
    })
    if(food) {
      food.count++
    } else {
      cart.push({
        id: id,
        title: title,
        cost: cost,
        count: 1
      })
    }
  }
  saveCart()
}

function renderCart() {
 
  modalBody.textContent = ''
  
  cart.forEach(function({id, title, cost, count}){
    const itemCart = `
    <div class="food-row">
      <span class="food-name">${title}</span>
      <strong class="food-price">${cost}</strong>
      <div class="food-counter">
        <button class="counter-button counter-minus" data-id=${id}>-</button>
        <span class="counter">${count}</span>
        <button class="counter-button counter-plus" data-id=${id}>+</button>
      </div>
    </div>
    `

    modalBody.insertAdjacentHTML('afterbegin', itemCart)
  })
  const totalPrice = cart.reduce((result, item) => {
    return result + (parseFloat(item.cost) * item.count)
  }, 0)
  modalPrice.textContent = totalPrice + ' ₽'
}

function changeCount(e) {
  const target = e.target
  if(target.classList.contains('counter-button')) {
    const food = cart.find((item) => {
      return item.id === target.dataset.id
    })
    if(target.classList.contains('counter-minus')) {
      food.count--
      
      if(food.count === 0) {
        cart.splice(cart.indexOf(food), 1)
        
      }
    }
    if(target.classList.contains('counter-plus')) {
      food.count++
      
    }
    renderCart()
    //localStorage.setItem('cart', JSON.stringify(cart))

  }
  
  saveCart()
}

function init() {
  getData('./db/partners.json').then(function(data) {
    data.forEach(createCardRestaurant)
   });
   buttonClearCart.addEventListener('click', () => {
     cart.length = 0
     renderCart()
     localStorage.removeItem('cart');
   })
   modalBody.addEventListener('click', changeCount)
   cardsMenu.addEventListener('click', addToCart)
   close.addEventListener("click", toggleModal);// закрытие окна авторизации
   cartButton.addEventListener("click", () => {
    renderCart()
    toggleModal()
   });//переключение
   cardsRestaurants.addEventListener('click', openGoods)//переход в конкретный ресторан
   logo.addEventListener('click', function() {//возврат к списку ресторанов
     containerPromo.classList.remove('hide')
     restaurants.classList.remove('hide')
     menu.classList.add('hide')
   })
   inputSearch.addEventListener('keydown', function(e) {
    if(e.keyCode === 13) {
      const value = e.target.value.toLowerCase().trim();
      e.target.value = ''
      if(!value || value.length < 3) {
        e.target.style.backgroundColor = 'tomato'
        setTimeout(() => {
          e.target.style.backgroundColor = ''
        }, 2000)
        return
      }
      
      const goods = []
      getData('./db/partners.json')
      .then(data => {
        console.log(data);
        const products = data.map(item => {
          return item.products
        })
        products.forEach((product) => {
          getData(`./db/${product}`)
          .then((data) => {
            goods.push(...data)
            const searchGoods = goods.filter((item) => {
              return item.name.toLowerCase().includes(value)
            })

            cardsMenu.textContent = ''//очищаем, чтоб не дублировались при повторном входе

            containerPromo.classList.add('hide')
            restaurants.classList.add('hide')
            menu.classList.remove('hide')
            restaurantTitle.textContent = 'Результат поиска';
            rating.textContent = '';
            minPrice.textContent = '';
            category.textContent = '';
            return searchGoods

          }).then((data) => {
            data.forEach(createCardGood)
          })
        })
      })
    }
    
   })
   
   
   new Swiper('.swiper-container', {
     loop: true,
     autoplay: true,
     slidesPerView: 1
   })
}

init()

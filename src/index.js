import axios from 'axios';
var carousels = bulmaCarousel.attach();

const postAPI = axios.create({
  baseURL: process.env.API_URL
});
const rootEl = document.querySelector('.root');
const mainHeaderEl = document.querySelector('.main-header');

const loginBtnEl = document.querySelector('.main-header__login-btn');
const logoutBtnEl = document.querySelector('.main-header__logout-btn');
const signupBtnEl = document.querySelector('.main-header__signup-btn');
const cartBtnEl = document.querySelector('.main-header__cart-btn');
const topBtnEl = document.querySelector('.top-list__btn');
const bottomBtnEl = document.querySelector('.bottom-list__btn');
const shoesBtnEl = document.querySelector('.shoes-list__btn');
const mainBtnel = document.querySelector('.middle-head');

const bgReverseEl = document.querySelector('.background-img');
const menuReverseEl = document.querySelector('.menu');

const templates = {
  login: document.querySelector('#login').content,
  signup: document.querySelector('#signup').content,
  indexImg: document.querySelector('#index-page__img').content,
  productList: document.querySelector('#product-list').content,
  productItem: document.querySelector('#product-item').content,
  cartList: document.querySelector('#product-cart').content,
  cartBody: document.querySelector('#cart-body').content
}

//로그인 함수
function login(token){
  localStorage.setItem('token',token); 
  postAPI.defaults.headers['Authorization'] = `Bearer ${token}`;
  mainHeaderEl.classList.add('login--authed'); 
}

//로그아웃 함수
function logout(){
  localStorage.removeItem('token');
  delete postAPI.defaults.headers['Authorization'];
  mainHeaderEl.classList.remove('login--authed');
}

// 화면 렌더링 함수
function render(fragment){
  rootEl.textContent = "";  
  rootEl.appendChild(fragment);
}

// 항상 보여지는 첫화면
async function indexPage(){
  const fragment = document.importNode(templates.indexImg, true);

  mainBtnel.addEventListener('click', e => {
    bgReverseEl.classList.remove('reverse');
    menuReverseEl.classList.remove('reverse');
    render(fragment);
  })
  
  loginBtnEl.addEventListener('click', e=> {
    bgReverseEl.classList.add('reverse');
    menuReverseEl.classList.add('reverse'); 
    render(fragment);
    loginPage()
  })
  
  logoutBtnEl.addEventListener('click', e=> {
    render(fragment);
    logout();
  })
  
  signupBtnEl.addEventListener('click', e=> {
    bgReverseEl.classList.add('reverse');
    menuReverseEl.classList.add('reverse');
    render(fragment);
    signUpPage();
  })

  cartBtnEl.addEventListener('click', e=> {
    bgReverseEl.classList.add('reverse');
    menuReverseEl.classList.add('reverse');
    render(fragment);
    cartPage();
  })
  
  topBtnEl.addEventListener('click', e=> {
    render(fragment);
    topProductPage();
  })

  bottomBtnEl.addEventListener('click', e=> {
    render(fragment);
    bottomProductPage();
  })

  shoesBtnEl.addEventListener('click', e=> {
    render(fragment);
    shoesProductPage();
  })

  render(fragment);
}

//로그인 페이지
async function loginPage(){
  const fragment = document.importNode(templates.login, true);
  const formEl = fragment.querySelector('.login__form');
  formEl.addEventListener('submit', async e=>{
    const payload = {
      username: e.target.elements.username.value,
      password: e.target.elements.password.value
    };
    e.preventDefault();
    // rootEl.classList.add('root--loading');
    const res = await postAPI.post('/users/login',payload);
    // rootEl.classList.remove('root--loading');
    login(res.data.token);  
    bgReverseEl.classList.remove('reverse');
    menuReverseEl.classList.remove('reverse');
    const clearFragment = document.importNode(templates.indexImg, true);
    render(clearFragment);
  })
  render(fragment);
}

//회원가입 페이지
async function signUpPage(){
  const fragment = document.importNode(templates.signup, true);
  const formEl = fragment.querySelector('.signup__form');
  formEl.addEventListener('submit', async e=>{
    const payload = {
      username: e.target.elements.username.value,
      password: e.target.elements.password.value
    };
    e.preventDefault();
    const res = await postAPI.post('/users/register',payload);
    alert('회원가입이 완료 되었습니다.');
    bgReverseEl.classList.remove('reverse');
    menuReverseEl.classList.remove('reverse');
    const clearFragment = document.importNode(templates.indexImg, true);
    render(clearFragment);
  })
  render(fragment);
}

// top 상품리스트 페이지
async function topProductPage(){
  bgReverseEl.classList.add('reverse');
  menuReverseEl.classList.add('reverse');
  const clearFragment = document.importNode(templates.indexImg, true);
  render(clearFragment);
  // rootEl.classList.add('root--loading');
  const res = await postAPI.get(`/topProducts`);
  // rootEl.classList.remove('root--loading');
  for(let i=0; i<res.data.length;i++){
    const fragment = document.importNode(templates.productList, true);
    fragment.querySelector('.product-name').textContent = res.data[i].productName;
    fragment.querySelector('.product-price').textContent = res.data[i].price.toLocaleString() + ' won';
    const imageEl = fragment.querySelector('.thumbnail-img')
    imageEl.setAttribute('src', res.data[i].img);
    rootEl.appendChild(fragment);

    imageEl.addEventListener('click', e=> {
      productItemPage('topProducts',res.data[i].id);
    })
  }
}

// bottom 상품리스트 페이지
async function bottomProductPage(){
  bgReverseEl.classList.add('reverse');
  menuReverseEl.classList.add('reverse');    
  const clearFragment = document.importNode(templates.indexImg, true);
  render(clearFragment);
  // rootEl.classList.add('root--loading');
  const res = await postAPI.get(`/bottomProducts`);
  // rootEl.classList.remove('root--loading');
  for(let i=0; i<res.data.length;i++){
    const fragment = document.importNode(templates.productList, true);
    fragment.querySelector('.product-name').textContent = res.data[i].productName;
    fragment.querySelector('.product-price').textContent = res.data[i].price.toLocaleString() + ' won';
    const imageEl = fragment.querySelector('.thumbnail-img')
    imageEl.setAttribute('src', res.data[i].img);
    rootEl.appendChild(fragment);

    imageEl.addEventListener('click', e=> {
      productItemPage('bottomProducts',res.data[i].id);
    })
  }
}

// shoes 상품리스트 페이지
async function shoesProductPage(){
  bgReverseEl.classList.add('reverse');
  menuReverseEl.classList.add('reverse');    
  const clearFragment = document.importNode(templates.indexImg, true);
  render(clearFragment);
  // rootEl.classList.add('root--loading');
  const res = await postAPI.get(`/shoesProducts`);
  // rootEl.classList.remove('root--loading');
  for(let i=0; i<res.data.length;i++){
    const fragment = document.importNode(templates.productList, true);
    fragment.querySelector('.product-name').textContent = res.data[i].productName;
    fragment.querySelector('.product-price').textContent = res.data[i].price.toLocaleString() + ' won';
    const imageEl = fragment.querySelector('.thumbnail-img');
    imageEl.setAttribute('src', res.data[i].img);
    rootEl.appendChild(fragment);

    imageEl.addEventListener('click', e=> {
      productItemPage('shoesProducts',res.data[i].id);
    })
  }
}

// 상품 상세 정보 페이지 
 async function productItemPage(productTag,productId){
   const res = await postAPI.get(`/${productTag}/${productId}`)
   const fragment = document.importNode(templates.productItem, true);
   const itemImgEl = fragment.querySelector('.product-item__img');
   itemImgEl.setAttribute('src', res.data.img);
   fragment.querySelector('.product-item__name').textContent = res.data.productName;
   fragment.querySelector('.product-item__price').textContent = res.data.price.toLocaleString() + ' won';
   fragment.querySelector('.product-item__detail').textContent = res.data.productDetail;
   fragment.querySelector('.list-item1').textContent = res.data.productInfo1;
   fragment.querySelector('.list-item2').textContent = res.data.productInfo2;
   fragment.querySelector('.list-item3').textContent = res.data.productInfo3;
   fragment.querySelector('.list-item4').textContent = res.data.productInfo4;
   fragment.querySelector('.list-item5').textContent = res.data.productInfo5;

   const itemCartBtnEl = fragment.querySelector('.product-item__cart-btn');

   
   render(fragment);
     itemCartBtnEl.addEventListener('click', async e=>{
      e.preventDefault();
      const payload = {
        img: res.data.img,
        productName: res.data.productName,
        price: res.data.price
      }
      const cartRes = await postAPI.post(`/cart`, payload);
      alert('장바구니에 담겼습니다');
     })
 } 

 //장바구니 페이지 완성
 async function cartPage(){
   const fragment = document.importNode(templates.cartList, true);
   const parentCartBodyEl = fragment.querySelector('.tbody-cart');

   const res = await postAPI.get('/cart')
   for(let i = 0; i<res.data.length; i++){
     const bodyCartFragment = document.importNode(templates.cartBody, true);
     const imageEl = bodyCartFragment.querySelector('.cart-body-img');
     imageEl.setAttribute('src', res.data[i].img);
     bodyCartFragment.querySelector('.td--info').textContent = res.data[i].productName;
     bodyCartFragment.querySelector('.td--price').textContent = res.data[i].price.toLocaleString() + ' won';
     bodyCartFragment.querySelector('.td--quantity').textContent = 1;
     bodyCartFragment.querySelector('.td--total').textContent = res.data[i].price.toLocaleString() + ' won';

     parentCartBodyEl.appendChild(bodyCartFragment);
   }
   
   render(fragment);
 }



//indexPage start
indexPage();
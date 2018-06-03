import axios from 'axios';
// import { DEFAULT_ECDH_CURVE } from 'tls';
// import { tmpdir } from 'os';
var carousels = bulmaCarousel.attach();

const postAPI = axios.create({
  baseURL: process.env.API_URL
});
const rootEl = document.querySelector('.root');
const mainHeaderEl = document.querySelector('.menu-root__container');

const mainBtnel = document.querySelector('.middle-head');
const loginBtnEl = document.querySelector('.menu__login-btn');
const logoutBtnEl = document.querySelector('.menu__logout-btn');
const signupBtnEl = document.querySelector('.menu__signup-btn');
const cartBtnEl = document.querySelector('.menu__cart-btn');
const orderBtnEl = document.querySelector('.menu__order-btn');

const topBtnEl = document.querySelector('.top-list__btn');
const bottomBtnEl = document.querySelector('.bottom-list__btn');
const shoesBtnEl = document.querySelector('.shoes-list__btn');

const bgReverseEl = document.querySelector('.background-img');
const menuReverseEl = document.querySelector('.menu');
const headerReverseEl = document.querySelector('.main-header');

//************************************ test1
// const testEl = document.querySelectorAll('.tbody-cart__info');

const templates = {
  login: document.querySelector('#login').content,
  signup: document.querySelector('#signup').content,
  indexImg: document.querySelector('#index-page__img').content,
  productList: document.querySelector('#product-list').content,
  productItem: document.querySelector('#product-item').content,
  cartList: document.querySelector('#product-cart').content,
  cartBody: document.querySelector('#cart-body').content,
  orderList: document.querySelector('#order-list').content,
  orderBody: document.querySelector('#order-body').content
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
    headerReverseEl.classList.remove('reverse');
    render(fragment);
  })
  
  loginBtnEl.addEventListener('click', e=> {
    bgReverseEl.classList.add('reverse');
    menuReverseEl.classList.add('reverse');
    headerReverseEl.classList.add('reverse'); 
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
    headerReverseEl.classList.add('reverse');     
    render(fragment);
    signUpPage();
  })

  cartBtnEl.addEventListener('click', e=> {
    bgReverseEl.classList.add('reverse');
    menuReverseEl.classList.add('reverse');
    headerReverseEl.classList.add('reverse');     
    render(fragment);
    cartPage();
  })

  orderBtnEl.addEventListener('click', e => {
    render(fragment);     
    orderPage();
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
    headerReverseEl.classList.remove('reverse');        
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

    const payloadInfo = {
      name: e.target.elements.name.value,
      address: e.target.elements.address.value,
      phone: e.target.elements.phone.value,
      mail:  e.target.elements.mail.value,    
    };

    e.preventDefault();
    const res = await postAPI.post('/users/register',payload);
    login(res.data.token);

    const meRes = await postAPI.get(`/me`);
    const id = meRes.data.id;
    
    const addInfoRes = await postAPI.patch(`/users/${id}`,payloadInfo);
    logout();
    alert('회원가입이 완료 되었습니다.');
    bgReverseEl.classList.remove('reverse');
    menuReverseEl.classList.remove('reverse');
    headerReverseEl.classList.remove('reverse');        
    const clearFragment = document.importNode(templates.indexImg, true);
    render(clearFragment);
  })


  render(fragment);
}

// top 상품리스트 페이지
async function topProductPage(){
  bgReverseEl.classList.add('reverse');
  menuReverseEl.classList.add('reverse');
  headerReverseEl.classList.add('reverse');          
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

    //마우스를 호버했을때 나타나는 이미지 체인지
    imageEl.addEventListener('mouseover', e=>{
      imageEl.setAttribute('src', res.data[i].hoverImg)
    })

    imageEl.addEventListener('mouseout', e=>{
      imageEl.setAttribute('src', res.data[i].img);
    })


    imageEl.addEventListener('click', e=> {
      productItemPage('topProducts',res.data[i].id);
    })
  }
}

// bottom 상품리스트 페이지
async function bottomProductPage(){
  bgReverseEl.classList.add('reverse');
  menuReverseEl.classList.add('reverse');
  headerReverseEl.classList.add('reverse');    
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

    //마우스를 호버했을때 나타나는 이미지 체인지
    imageEl.addEventListener('mouseover', e=>{
      imageEl.setAttribute('src', res.data[i].hoverImg)
    })

    imageEl.addEventListener('mouseout', e=>{
      imageEl.setAttribute('src', res.data[i].img);
    })


    imageEl.addEventListener('click', e=> {
      productItemPage('bottomProducts',res.data[i].id);
    })
  }
}

// shoes 상품리스트 페이지
async function shoesProductPage(){
  bgReverseEl.classList.add('reverse');
  menuReverseEl.classList.add('reverse');
  headerReverseEl.classList.add('reverse');    
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

    //마우스를 호버했을때 나타나는 이미지 체인지
    imageEl.addEventListener('mouseover', e=>{
      imageEl.setAttribute('src', res.data[i].hoverImg)
    })

    imageEl.addEventListener('mouseout', e=>{
      imageEl.setAttribute('src', res.data[i].img);
    })

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
      const meRes = await postAPI.get(`/me`);
      const payload = {
        img: res.data.img,
        productName: res.data.productName,
        price: res.data.price,
        userId: meRes.data.id
      }
      const cartRes = await postAPI.post(`/carts`, payload);
      alert('장바구니에 담겼습니다');
     })

 } 

 //장바구니 페이지 완성
 async function cartPage(){
   const fragment = document.importNode(templates.cartList, true);
   const parentCartBodyEl = fragment.querySelector('.tbody-cart');

   const res = await postAPI.get('/carts')

   for(let i = 0; i<res.data.length; i++){
     const bodyCartFragment = document.importNode(templates.cartBody, true);
     const imageEl = bodyCartFragment.querySelector('.cart-body-img');
     imageEl.setAttribute('src', res.data[i].img);
     bodyCartFragment.querySelector('.tbody-cart__info').setAttribute('value',res.data[i].id);     
     bodyCartFragment.querySelector('.td--info').textContent = res.data[i].productName;
     bodyCartFragment.querySelector('.td--price').textContent = res.data[i].price.toLocaleString() + ' won';
     bodyCartFragment.querySelector('.td--quantity').textContent = 1;
     bodyCartFragment.querySelector('.td--total').textContent = res.data[i].price.toLocaleString() + ' won';

     parentCartBodyEl.appendChild(bodyCartFragment);  
    }

    render(fragment);   
    
    // 장바구니 페이지에서 삭제 버튼 클릭시 db에서도삭제 화면에서도 바로 렌더링 시켜주는 로직.
    const deleteInfoEl = document.querySelectorAll('.tbody-cart__info');
    const cartDeleteBtn = document.querySelectorAll('.cart-body__delete_btn');
    const deleteRes = await postAPI.get('/carts');
    
    for(let i = 0; i < deleteInfoEl.length; i++){
      if(parseInt(deleteInfoEl[i].getAttribute('value')) === deleteRes.data[i].id){
        cartDeleteBtn[i].addEventListener('click', async e=> {
          e.preventDefault();
          const removeRes = await postAPI.delete(`/carts/${deleteRes.data[i].id}`);
          cartPage();
        })
      }
    }
    const orderBtn = document.querySelector('.cart-order__btn');
    orderBtn.addEventListener('click',  e=>{
      orderPage();
    })  
 }

 async function orderPage(){
   const fragment = document.importNode(templates.orderList, true);
   const parentOrderBodyEl = fragment.querySelector('.tbody-order');
   let priceTotal = 0;
   const res = await postAPI.get('/carts');


   for(let i = 0; i<res.data.length; i++){
    const bodyOrderFragment = document.importNode(templates.orderBody, true);
    const imageEl = bodyOrderFragment.querySelector('.cart-body-img');
    imageEl.setAttribute('src', res.data[i].img);
    bodyOrderFragment.querySelector('.td--info').textContent = res.data[i].productName;
    bodyOrderFragment.querySelector('.td--price').textContent = res.data[i].price.toLocaleString() + ' won';
    bodyOrderFragment.querySelector('.td--quantity').textContent = 1;
    bodyOrderFragment.querySelector('.td--total').textContent = res.data[i].price.toLocaleString() + ' won';
    priceTotal += res.data[i].price
    parentOrderBodyEl.appendChild(bodyOrderFragment);  
   }
   fragment.querySelector('.order-total').textContent = priceTotal.toLocaleString() + ' won';
   render(fragment); 
 }





if(localStorage.getItem('token')){
  login(localStorage.getItem('token'));
}
//indexPage start
indexPage();
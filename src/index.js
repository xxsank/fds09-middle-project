import axios from 'axios';

const postAPI = axios.create({
  baseURL: process.env.API_URL
});
const rootEl = document.querySelector('.root');
const mainHeaderEl = document.querySelector('.main-header');
const loginBtnEl = document.querySelector('.main-header__login-btn');
const logoutBtnEl = document.querySelector('.main-header__logout-btn');
const signupBtnEl = document.querySelector('.main-header__signup-btn');
const topBtnEl = document.querySelector('.top-list__btn');

const templates = {
  login: document.querySelector('#login').content,
  signup: document.querySelector('#signup').content,
  indexImg: document.querySelector('#index-page__img').content,
  productList: document.querySelector('#product-list').content
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
function indexPage(){
  const fragment = document.importNode(templates.indexImg, true);
  loginBtnEl.addEventListener('click',e=>{
    loginPage()
  })
  
  logoutBtnEl.addEventListener('click',e=>{
    logout();
    indexPage();
  })
  
  signupBtnEl.addEventListener('click',e=>{
    signUpPage();
  })
  
  topBtnEl.addEventListener('click', e=> {
    indexPage();
    topProductPage();
  })
  render(fragment);
}

indexPage();

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
    indexPage();
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
    indexPage();
  })
  render(fragment);
}

// top 상품리스트 페이지
async function topProductPage(){
  // rootEl.classList.add('root--loading');
  const res = await postAPI.get(`/topProducts`);
  // rootEl.classList.remove('root--loading');
  for(let i=0; i<res.data.length;i++){
    const fragment = document.importNode(templates.productList, true);
    fragment.querySelector('.product-name').textContent = res.data[i].productName;
    fragment.querySelector('.product-price').textContent = res.data[i].price;
    const imageEl = fragment.querySelector('.thumbnail-img')
    imageEl.setAttribute('src', res.data[i].img);
    rootEl.appendChild(fragment);
  }
}



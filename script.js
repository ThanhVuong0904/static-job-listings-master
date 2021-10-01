const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const postList = $(".post-list");
const filterSection = $(".filter");
const filterList = $(".filter-list");
const wrap = $(".wrapper");
let checkHeight;
let filterArray = [];
function runApp() {
     getData().then((data) => {
          renderPosts(data);
          handleEvent(data);
     })
}

runApp();

async function getData() {
     const API = "data.json";
     const response = await fetch(API);
     const postData = await response.json();
     return postData;
}

function renderPosts(posts) {
     var htmls = posts.map((post) => {
          return (
               `
               <div class="post-item" key=${post.id}>
                    ${post.featured ? `<span class="label-DesaturatedDarkCyan"></span>` : ``}
                    <img src="${post.logo}" alt="account-image" class="post-image">
                    <div class="post-content">
                         <div class="post-title">
                              <span class="text-primary">${post.company}</span>
                              <div class="label">
                              ${post.new ? `<span class="label-new">New!</span>` : ``}
                              ${post.featured ? `<span class="label-featured">FEATURED</span>` : ``}
                              </div>
                         </div>
                         <h1 class="post-heading">${post.position}</h1>
                         <ul class="post-public">
                              <li class="post-public-item">${post.postedAt}</li>
                              <span>•</span>
                              <li class="post-public-item">${post.contract}</li>
                              <span>•</span>
                              <li class="post-public-item">${post.location}</li>
                         </ul>
                    </div>
                    <div class="post-tag">
                         <button class="post-tag-item post-role button button--primary" data-tag=${post.role}>${post.role}</button>
                         <button class="post-tag-item post-level button button--primary" data-tag=${post.level}>
                              ${post.level}
                         </button>
                         ${post.languages.length > 0 
                              ? post.languages.map((lang)=>
                              `<button class="post-tag-item post-lang button button--primary" data-tag=${lang}>${lang}</button>`
                              ).join("")
                              : null
                         }
                         ${post.tools.map((tool)=>
                              `<button class="post-tag-item post-tool button button--primary" data-tag=${tool}>${tool}</button>`
                         ).join("")}
                    </div>
               </div>
               `
          );
     });
     postList.innerHTML = htmls.join("");
}

function renderFilter(filterMap) {
     var htmls = filterMap.map((element) => {
          return (
               `
               <div class="filter-item">
                    <span class="filter-item-text">${element}</span>
                    <div class="delete" data-fil=${element}>
                         <img class="delete-image" src="./images/icon-remove.svg" alt="delete" data-fil=${element}>
                    </div> 
               </div>
               `
          );
     });
     filterList.innerHTML = htmls.join("");
     filterArray.length != 0 ? filterSection.style.opacity = 1 : filterSection.style.opacity = 0;
}

function checkUnique(arr) {
     var newArr = [];
     newArr = arr.filter(function (item) {
          return newArr.includes(item) ? '' : newArr.push(item)
     })
     return newArr;
}

function isTrue(array, role, level, languages, tools) {
     return array.every((element) =>
          role.includes(element) ||
          level.includes(element) ||
          languages.includes(element) ||
          tools.includes(element)
     );
}

function updateRender(postData) {
     const check = postData.filter((post) => {
          return isTrue(
               filterArray,
               post.role,
               post.level,
               post.languages,
               post.tools
          );
     });
     renderPosts(check);
}

function handleAdd(postData, fil) {
     filterArray.push(fil)
     filterArray = checkUnique(filterArray)
     updateRender(postData);
     renderFilter(filterArray);
}

function handleRemove(postData, fil) {
     const indexOf = filterArray.indexOf(fil)
     console.log(indexOf);
     filterArray.splice(indexOf, 1);
     updateRender(postData);
     renderFilter(filterArray);
}

function handleClearAll(postData) {
     filterArray = [];
     renderFilter(filterArray);
     updateRender(postData);
}
function updatePaddingTopPost() {
     //74 is height natural
     if(checkHeight != 74) {
          post.style.paddingTop = filterSection.offsetHeight + 20 + 'px';
     }
     if(checkHeight == 74) {
          post.style.paddingTop = '80px';
     }
}
const post = $(".post")
function handleEvent(postData) {
     wrap.addEventListener("click", (e) => {
          const clickButtonTag = e.target.matches(".post-tag-item");
          const clickDelete = e.target.matches(".delete-image") 
          || e.target.matches(".delete") 
          || e.target.matches(".filter-item");
          const clickClearAll = e.target.matches(".filter-clear > span");
          const tagDataSet = e.target.getAttribute("data-tag");
          const filterDataSet = e.target.getAttribute("data-fil");
          
          if(clickButtonTag) {
               handleAdd(postData, tagDataSet);
          }
          if(clickDelete) {
               console.log(filterDataSet);
               handleRemove(postData, filterDataSet);
          }
          if(clickClearAll) {
               handleClearAll(postData)
          }
          updatePaddingTopPost();
     })
}
window.onresize = function() {
     checkHeight = filterSection.offsetHeight;
     updatePaddingTopPost();
}
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const postList = $(".post-list");
const filterSection = $(".filter")
const filterList = $(".filter-list");
const filterClear = $(".filter-clear");
const searchBar = $("#search");

let filterArray = [];
function runApp() {
     getData().then((data) => {
          renderPosts(data);
          addFilter(data);
          clearAll(data)
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
                    <img src="${post.logo}" alt="account-image">
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
                         <button class="post-tag-item post-level button button--primary" data-tag=${post.level}>${post.level}</button>
                              ${post.languages.map((postLanguages) => {
                    return (
                         `
                         <button class="post-tag-item post-languages button button--primary" data-tag=${postLanguages}>${postLanguages}<button>
                                        `
                    );
               }).join("")}
                              ${post.tools.map((tool) => {
                    return (
                         `
                                        <button class="post-tag-item tool button button--primary" data-tag=${tool}>${tool}</button>
                                        `
                    );
               }).join("")}
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
                    <span data-fil=${element} class="filter-item-text">${element}</span>
                    <div class="delete">
                         <img class="delete-image" src="./images/icon-remove.svg" alt="">
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

function addFilter(postData) {
     const postTagItem = $$(".post-tag-item")
     postTagItem.forEach((element) => {
          element.addEventListener("click", () => {
               const dataTag = element.dataset.tag;
               filterArray.push(dataTag)
               filterArray = checkUnique(filterArray)
               updateRender(postData);
               renderFilter(filterArray);
               addFilter(postData);
               const deleteIcon = $$(".delete");
               removeFilter(deleteIcon, postData);
          })
     })
}

function removeFilter(deleteIcon, postData) {
     deleteIcon.forEach((element, index) => {
          element.addEventListener("click", () => {
               filterArray.splice(index, 1);
               updateRender(postData);
               renderFilter(filterArray);
               addFilter(postData);
               removeFilter($$(".delete"), postData)
          })
     })
}

function clearAll(postData) {
     const clickClearAll = $(".filter-clear");
     clickClearAll.addEventListener("click", ()=>{
          filterArray = [];
          renderFilter(filterArray);
          updateRender(postData);
          addFilter(postData);
     })
}
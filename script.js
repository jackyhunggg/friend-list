//data
const BASE_URL = "https://user-list.alphacamp.io/api/v1/users/";
const userData = document.querySelector("#user-data");
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const paginator = document.querySelector("#paginator")
const users = [];
let filteredUser = []
const Users_Per_Page = 12;

//functions
function displayUser(users) {
  let html = "";
  users.forEach((user) => {
    html += `
    <div class="col-sm-3">
    <div class="mb-2">
      <div class="card">
        <img src="${user.avatar}" class="card-img-top" alt="user avatar" data-modal-user-id="${user.id}" style="width: 120px">
        <div class="card-body" d-flex" data-modal-user-id="${user.id}">
          <h5 class="card-title" data-modal-user-id="${user.id}">${user.name} ${user.surname}</h5>
        </div>
        <div class="card-footer">
          <button 
            class="btn btn-primary 
            btn-show-user" 
            data-bs-toggle="modal" 
            data-bs-target="#user-modal" 
            data-modal-user-id="${user.id}"
          >
            More
          </button>
          <button 
            class="btn btn-info btn-add-favorite" 
            data-modal-user-id="${user.id}"
          >
            +
          </button>
        </div>
      </div>
    </div>
  </div>
  `;
  });
  userData.innerHTML = html;
}
function showModal(event) {
  const target = event.target;
  const id = target.dataset.modalUserId;
  const title = document.querySelector(".modal-title");
  const body = document.querySelector(".modal-body");
  const img = document.querySelector(".modal-img");
  //axios
  axios
    .get(BASE_URL + id)
    .then((response) => {
      const user = response.data;
      title.innerText = `${user.name}  ${user.surname}`;
      img.src = `${user.avatar}`;
      body.innerHTML = `
          <p>email: ${user.email}</p>
          <p>gender: ${user.gender}</p>
          <p>age: ${user.age}</p>
          <p>region: ${user.region}</p>
          <p>birthday: ${user.birthday}</p>
          `;
    })
    .catch((error) => console.log(error));
}

function addToFavorite(id) {
    const list = JSON.parse(localStorage.getItem("favoriteUsers")) || [];
    const user = users.find((user) => user.id === id);
    if (list.some((user) => user.id === id)) {
      return alert("this user is already in the favorite list!");
    }
    list.push(user);
    console.log(list);
  
    const jsonString = JSON.stringify(list);
    localStorage.setItem("favoriteUsers", JSON.stringify(list));
  }

function getUsersByPage (page) {
  const data = filteredUser.length? filteredUser : users;
  const startIndex = (page-1) * Users_Per_Page;
  return data.slice(startIndex, startIndex + Users_Per_Page) 
}
function renderPaginator (amount) {
    let totalPage = Math.ceil(amount / Users_Per_Page);
    let html = '';
    for(let page = 1; page < totalPage; page ++) {
        html += `
        <li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>
        `
    }
    paginator.innerHTML = html;
}

userData.addEventListener("click", (event) => {
    let target = event.target;
    if (target.matches(".btn-add-favorite")) {
      addToFavorite(Number(target.dataset.modalUserId));
      console.log(target.dataset.modalUserId);
    }
  });

searchForm.addEventListener('submit', function onSearchFormSubmit (event) {
  event.preventDefault();
  let target = event.target;
  const keyword = searchInput.value.trim().toLowerCase();

  filteredUser = users.filter((user) => 
    user.name.toLowerCase().includes(keyword) || user.surname.toLowerCase().includes(keyword)
  )

  if(filteredUser.length === 0) {
    return alert(`No user match the keyword: ${keyword} !`)
  }

  displayUser(filteredUser);
})

paginator.addEventListener('click', function onPaginatorClicked (event) {
    let target = event.target;
    if(target.tagName !== 'A') return;
    const page = Number(target.dataset.page);
    displayUser(getUsersByPage(page))
})



//axios
axios.get(BASE_URL).then((response) => {
  const results = response.data.results;
  users.push(...results);
  displayUser(getUsersByPage(1));
  renderPaginator(users.length)
  userData.addEventListener("click", showModal);
});
//display


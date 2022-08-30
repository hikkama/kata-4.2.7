const searchInput = document.querySelector('.search-input')
const autoCompleteBox = document.querySelector('.autocomplete-box')
const resultBox = document.querySelector('.result-box')

const sendRequestDebounced = debounce(sendRequest, 500)
searchInput.addEventListener('keyup', e => {
  const searchingQuery = e.target.value
  if (searchingQuery && e.key != 'Backspace') {
    sendRequestDebounced(searchingQuery)
  } else {
    autoCompleteBox.textContent = '';
  }
})


async function sendRequest(request, repoToShow = 5) {
  const response = await fetch(`https://api.github.com/search/repositories?q=${request}&per_page=${repoToShow}`)
  const data = await response.json()

  autoCompleteBox.innerHTML = '';

  const fragment = document.createDocumentFragment();

  data.items.forEach(item => {
    const newSearchItem = createSearchListItem(item)

    newSearchItem.addEventListener('click', () => {
      searchInput.value = ''
      autoCompleteBox.innerHTML = '';
      createNewRepo(item)
    })

    fragment.appendChild(newSearchItem)
  })

  autoCompleteBox.appendChild(fragment)
}

function createSearchListItem(item) {
  const listItem = document.createElement('li')
  listItem.classList.add('search-item')
  listItem.innerText = item.name

  return listItem
}

function createNewRepo(repoData) {
  const repoContainer = document.createElement('div');
  const repoInfo = document.createElement('div');
  repoInfo.insertAdjacentHTML('beforeend',
    `<div>Name: ${repoData.name}</div>
          <div>Owner: ${repoData.owner.login}</div>
          <div>Stars: ${repoData.stargazers_count}</div>`)

  const repoRemoveBtn = document.createElement('button');
  const repoRemoveIcon = document.createElement('i');
  repoContainer.classList.add('repo-info')

  repoRemoveBtn.classList.add('btn')
  repoRemoveIcon.classList.add('fa-solid', 'fa-xmark', 'icon')

  repoContainer.appendChild(repoInfo);
  repoRemoveBtn.appendChild(repoRemoveIcon);
  repoContainer.appendChild(repoRemoveBtn);


  resultBox.appendChild(repoContainer)

  repoRemoveBtn.addEventListener('click', () => {
    resultBox.removeChild(repoContainer)
  })
}

function debounce(fn, delay) {
  let timer
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}


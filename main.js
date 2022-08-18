// const searchRequest = async(value) => {
//   return await fetch(`https://api.github.com/search/repositories?q=${value}`).then(response => {
//     if(response.ok) {
//       return response.json()
//     }
//   })
// }
//
// const input = document.querySelector('.search-input')
// const box = document.querySelector('.autocomplete-box')
// const resultBox = document.querySelector('.result')
//
// resultBox.addEventListener('click', e => {
//   if(e.target.tagName === 'I') {
//     e.target.closest('li').remove()
//   }
// })
//
// function onChange(e) {
//   if(e.target.value) {
//     searchRequest(e.target.value).then(res => {
//       const items = res.items.map(el => {
//         return `<li class="search-item" data-owner=${el.owner.login} data-stars=${el.stargazers_count}>${el.name}</li>`
//       })
//
//       box.innerHTML = items.join('')
//       box.classList.remove('close')
//
//     })
//   }
// }
//
//
// const debounce = (fn, delay) => {
//   let timer
//   return function (...args) {
//     clearTimeout(timer)
//     timer = setTimeout(() => fn.apply(this, args), delay)
//   }
// }
//
// onChange = debounce(onChange, 250)
//
// input.addEventListener('keyup', onChange)
// box.addEventListener('click', (e) => {
//   input.value = ''
//   const dataset = e.target.dataset
//   const element = document.createElement('li')
//   element.classList.add('result-list')
//   element.innerHTML = `
//    <div>
//     <div>Name: ${e.target.textContent}</div>
//     <div>Owner: ${dataset.owner}</div>
//     <div>Stars: ${dataset.stars}</div>
//   </div>
//   <i class="fa-solid fa-xmark icon"></i>
//   `
//
//   box.classList.add('close')
//   resultBox.append(element)
// })


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
  return await fetch(`https://api.github.com/search/repositories?q=${request}&per_page=${repoToShow}`)
    .then(response => response.json())
    .then(data => {
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
    })
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
  const repoTitle = document.createElement('p');
  const repoOwner = document.createElement('p');
  const repoStars = document.createElement('p');
  const repoRemoveBtn = document.createElement('i');

  repoContainer.classList.add('repo-info')

  repoTitle.innerHTML = `Name: ${repoData.name}`
  repoOwner.innerHTML = `Owner: ${repoData.owner.login}`
  repoStars.innerHTML = `Stars: ${repoData.stargazers_count}`
  repoRemoveBtn.classList.add('fa-solid', 'fa-xmark', 'icon')

  repoInfo.appendChild(repoTitle);
  repoInfo.appendChild(repoOwner);
  repoInfo.appendChild(repoStars);
  repoContainer.appendChild(repoInfo);
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


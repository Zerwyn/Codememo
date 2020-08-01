const snippetList = document.querySelector('.memos-menu')
const hostname = location.protocol + '//' + location.hostname +(location.port? ':'+location.port:'')

const getSnippets = () => {
    return fetch(`${hostname}/codememoNames`)
    .then((res) => res.json());
}

const createSnippetList = (snippets) => {
    const fragment = document.createDocumentFragment()
    Object.values(snippets).forEach(v => {
        const li = document.createElement('li')
        const link = document.createElement('a')
        link.setAttribute('href',`${hostname}/codememos/${v.id}`)
        link.innerText = v.title
        li.appendChild(link)
        fragment.appendChild(li)
    })
    return fragment
}

const init = async () => {
    const snippets = await getSnippets()

    snippetList.appendChild(createSnippetList(snippets))
}

init()
const memos = document.querySelector('.memos')
const addMemo = document.querySelector('.add-memo')
const saveButton = document.querySelector('.save-button')
const hostname = location.protocol + '//' + location.hostname +(location.port? ':'+location.port:'')
const languageList = ['','bsh', 'c', 'cc', 'cpp', 'cs', 'csh', 'cyc', 'cv', 'htm', 'html',
    'java', 'js', 'm', 'mxml', 'perl', 'pl', 'pm', 'py', 'rb', 'sh', 'text', 'xhtml', 'xml', 'xsl']
let codememoID


const getSnippet = () => {
    return fetch(`${hostname}/codememo/${codememoID}`)
    .then(res => res.json())
}

// change tabulation to behave like in text editor
const changeTabBehavior = e => {
    if(e.key === 'Tab'){
        e.preventDefault()
        const textarea = e.target
        const startPosition=textarea.selectionStart
        const endPosition=textarea.selectionEnd
        textarea.value = textarea.value.substring(0,startPosition) + '\t' + textarea.value.substring(endPosition)
        textarea.selectionStart=startPosition+1
        textarea.selectionEnd=startPosition+1
    }
}

const autoResizeTextarea = function() {
    this.style.height = 'auto'
    this.style.height = this.scrollHeight + 'px'
}

const renderLanguageSelector= (id, language) => {
    const newSelector = document.createElement('select')
    newSelector.id='language-'+id
    languageList.forEach(l => {
        const opt = document.createElement('option')
        opt.value = l
        opt.text = l
        if(l === language) opt.setAttribute('selected','selected')
        newSelector.appendChild(opt)
    })
    return newSelector
}

const renderDeleteButton= id => {
    const newButton = document.createElement('button')
    newButton.target = id
    newButton.addEventListener('click', function() {
        document.getElementById(this.target).remove() //textarea
        document.getElementById(`language-${this.target}`).remove() //languageSelector
        this.remove()
    })
    newButton.textContent = 'Delete'
    return newButton
}

const renderSnippet = (id, value='', language='') => {
    const newSnippet = document.createElement('textarea')
    newSnippet.value = value
    newSnippet.id = id
    newSnippet.addEventListener('input', autoResizeTextarea)
    newSnippet.addEventListener('keydown', changeTabBehavior)

    const snippetDiv = document.createElement('div')
    snippetDiv.classList.add('snippet-div')
    snippetDiv.appendChild(newSnippet)
    const optionsDiv = document.createElement('div')
    optionsDiv.appendChild(renderLanguageSelector(id,language))
    optionsDiv.appendChild(renderDeleteButton(id))
    snippetDiv.appendChild(optionsDiv)
    return snippetDiv
}

const loadCodememo = json => {
    document.querySelector('.input-title').value = json.title
    const fragment = document.createDocumentFragment()
    let textareaId = 0
    json.memos.forEach(m => {
        fragment.appendChild(renderSnippet(`area${textareaId}`, m.content, m.language))
        textareaId++
    })
    memos.appendChild(fragment)
}

addMemo.addEventListener('click', () =>{
    const id = 'area'+memos.getElementsByTagName('textarea').length
    memos.appendChild(renderSnippet(id))
})

saveButton.addEventListener('click', () => {
    const contents = [...memos.getElementsByTagName('textarea')].map(m => 
        ({content:m.value, language: document.getElementById('language-'+m.id).value}))
    const save = {
        title: document.querySelector('.input-title').value,
        memos : contents
    }

    if(codememoID){ // If ID is already defined, we need to update
        fetch(`${hostname}/edit/${codememoID}`,{
            method:'PATCH',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(save)
        })
        .then(() => location.replace(`/codememos/${codememoID}`))
    }else{ // snippet undefined => first save (need to get an ID for next saves)
        fetch(`${hostname}/codememo`,{
            method:'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(save)
        })
        .then(res => res.json())
        .then(json => location.replace(`/codememos/${json.id}`))
        .catch(err => console.error(err))
    }
})

const init = async () => {
    const match = document.URL.match(/https?:\/\/[\.\w:]+\/edit\/(\w+)/)
    if(match){ // else new codememo
        codememoID = match[1]
        const json = await getSnippet()
        loadCodememo(json)
    }
}

init()
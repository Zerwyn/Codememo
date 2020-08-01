const match = document.URL.match(/https?:\/\/[\.\w:]+\/memos\/(\w+)/)
const hostname = location.protocol + '//' + location.hostname +(location.port? ':'+location.port:'')

document.querySelector('.remove-codememo').addEventListener('click', () =>{
    if(!match) return
    if(window.confirm('Do you really want to delete this Codememo?')){
        fetch(`${hostname}/edit/${match[1]}`, {
            method: 'DELETE'
        })
        .then(()=>location.replace('/'))
        .catch(err => console.error(err))
    }
})
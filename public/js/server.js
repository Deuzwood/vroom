document.querySelectorAll('.card').forEach( (card) => {
    card.addEventListener('click', element => {

        document.querySelectorAll('.card').forEach( c => c.classList= 'card')
        if(element.target.classList != "card")
            element.target.offsetParent.classList = 'card border-success'
    })
})

/**
 * Selection des serveurs
 */
document.querySelectorAll('.card').forEach( (card) => {
    card.addEventListener('click', element => {
        document.querySelectorAll('.card').forEach( c => c.classList= 'card')
        if(element.target.classList != "card")
            element.target.offsetParent.classList = 'card border-success'
    })
})



/* LOG */
document.querySelector('#log').addEventListener('submit', event => {
	event.preventDefault();

    //On recupere le server selectionné
	server=document.querySelector('.card.border-success').id

    //créer un socket
    socket=io();
        
    // on envoie au serveur nos info
    socket.emit('player', pseudo.value,clr.value.replace('#','0x'),server)


    socket.on('new', (id,name,color)=>{
        if(f){
            console.log('i init here')
            init(color);
            animate();
            init_control();
            f=false;
        }
        else{
            newCar(id,color)
        }
        let li = document.createElement('li');
        li.textContent = name;
        li.id='user_'+id;
        li.style = "color:"+color.replace("0x",'#');
        document.querySelector('#list_user').appendChild(li);
        document.querySelector('#gui').classList = 'gui';
        document.querySelector('#stats').classList = 'stats';
        document.querySelector('#main_gui').classList = '';
    }) 

    // Si le server nous demande de retirer un joueur
    socket.on('remove' , id => {
        scene.remove(scene.getObjectByName(id));
        document.querySelector('#user_'+id).remove();
        other.splice(other.indexOf(id),1)
        })

    //rm container
    document.querySelector('.container').remove();

})
// CRUD = CREATE READ UPDATE DELETE
const openModal = ()=> document.querySelector('#modal').classList.add('active');
const closeModal = ()=> {document.querySelector('#modal').classList.remove('active');
clearFields();
}

const getLocalStorage = ()=> JSON.parse(localStorage.getItem('db_client')) ?? [] // this ??[] is the same IF
const setLocalStorage = (dbClient)=> localStorage.setItem("db_client", JSON.stringify(dbClient)); // this is going to be responsible to save the information in the local storage in f12 "Applications"

//CRUD DELETE
const deleteClient = (index)=>{
    const dbClient = readClient()
    dbClient.splice(index,1) // splice is a function that removes or replace an existing elements in an array
    setLocalStorage(dbClient)
}
//CRUD UPDATE to change any information you want that already exists in the database
const updateClient = (index,client) =>{
    const dbClient = readClient() // this is to read all the information and put it in the variable dbClient
    dbClient[index] = client
    setLocalStorage(dbClient);
}

//CRUD READ
const readClient = ()=>getLocalStorage()

//CRUD CREATE
const createClient = (client) =>{
    const dbClient = getLocalStorage()
    dbClient.push (client) 
    setLocalStorage(dbClient)
}
const isValidFields = ()=>{
    return document.querySelector('#form').reportValidity();
}

//Interaction with the layout
const clearFields = ()=>{
    const fields = document.querySelectorAll('.modal-field') 
    fields.forEach(field=>field.value = " ") // this is to erase all the information after we close the modal
    document.querySelector('#nome').dataset.index = 'new';
}

const saveClient = ()=>{
    debugger
    if (isValidFields()){
        const client = {
            nome: document.querySelector('#nome').value,
            email: document.querySelector('#email').value,
            celular:document.querySelector('#celular').value,
            cidade:document.querySelector('#cidade').value
        }
        const index = document.querySelector('#nome').dataset.index;
        if(index == 'new'){
        createClient(client);
        updateTable();
        closeModal();
        }
        else{
            updateClient(index,client);
            updateTable();
            closeModal();
        }
    }
}

const createRow = (client,index) =>{ // this index is going to be responsible to specify which client we are editing in our CRUD
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
    <td>${client.nome}</td>
    <td>${client.email}</td>
    <td>${client.celular}</td>
    <td>${client.cidade}</td>
    <td> 
        <button type="button" class="button green" id ="edit-${index}">Editar</button>
        <button type="button" class="button red" id="delete-${index}">Remover</button>
    </td>`
    document.querySelector('#tableClient>tbody').appendChild(newRow); // this is actually what put the information from db to the HTML
}

const clearTable = ()=>{
    const rows = document.querySelectorAll('#tableClient>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = ()=>{
    const dbClient = readClient();
    clearTable();
    dbClient.forEach(createRow) // this function createRow will be responsible to put the information from the database on the
}
const fillFields=(client)=>{
    document.querySelector('#nome').value = client.nome
    document.querySelector('#email').value = client.email
    document.querySelector('#celular').value = client.celular
    document.querySelector('#cidade').value = client.cidade
    document.querySelector('#nome').dataset.index = client.index
}

const editClient = (index) =>{
    const client = readClient()[index]
    client.index = index;
    fillFields(client)
    openModal();
}
const editDelete = (event)=>{
    if(event.target.type == 'button'){
        const [action, index] = event.target.id.split('-');
        if(action == 'edit'){
            editClient(index)
        }
        else{
            const client = readClient()[index]
            const response = confirm(`Deseja realmente excluir o cliente ${client.nome}`)
            if (response){
            deleteClient(index)
            updatable();
            }
            
        }
    }
    
}

updateTable()

//Events

document.querySelector('#cadastrarCliente').addEventListener('click',openModal);
document.querySelector('#modalClose').addEventListener('click',closeModal);
document.querySelector('#salvar').addEventListener('click',saveClient);
document.querySelector('#tableClient>tbody').addEventListener('click',editDelete);
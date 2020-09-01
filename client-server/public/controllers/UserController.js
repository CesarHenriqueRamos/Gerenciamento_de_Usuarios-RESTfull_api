class UserController{
    constructor(formIdCreate,formIdUpdate, tableId){
        this.formEl = document.getElementById(formIdCreate);
        this.formUpdateEl = document.getElementById(formIdUpdate);
        this.tableEl = document.getElementById(tableId);
        this.onSubmit();
        this.onEdite();
        this.selectAll();
     }

        //metodo
        onSubmit(){
            this.formEl.addEventListener('submit',(event) => {
                event.preventDefault();
               let value = this.getValues(this.formEl);
               let btn = this.formEl.querySelector('[type=submit]');
               btn.disabled = true;
               if(!value){
                return false;
            }
               this.getPhoto(this.formEl).then((content)=>{
                value.photo = content;
                value.save();
                this.addUser(value);
                this.formEl.reset();
                btn.disabled = false;
               },(e)=>{
                   console.log(e);
               })
               
               
            });
        
        }
        //onSubmit
        getPhoto(formEl){
            return new Promise((resolve, reject) => {
                let fileReader = new FileReader();
                let elements = [...formEl.elements].filter(item=>{
                if(item.name === 'photo'){
                    return item;
                }
                });
                let file = elements[0].files[0];
                fileReader.onload = () => {
                    resolve(fileReader.result);
                }
                fileReader.onerror= (e) =>{
                    reject(e);
                }
                if(file){
                   fileReader.readAsDataURL(file);  
                }else{
                   resolve('dist/img/boxed-bg.jpg');
                }
            });
            
        }
        //getPhoto
        getValues(formEl){
            let user = {};
            let isValid = true;

            [...formEl.elements].forEach(function(field,index){
                if(['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value){
                    field.parentElement.classList.add('has-error');
                    isValid = false;
                }

                if(field.name == 'gender'){
                    if(field.checked){
                       user[field.name] = field.value;
                    }        
                }else if(field.name == 'admin'){
                    user[field.name] = field.checked;
                }
                else{
                    user[field.name] = field.value;
                }
            });
            if(!isValid){
                return false;
            }
            return new User(user.name,
                user.gender,user.birth,user.country,user.email,user.password,user.photo,user.admin);
            
    }
    //getvalue
    //metodo para criar campos na tabela
    getTr(dataUser, tr = null){
        if(tr === null) tr = document.createElement('tr');

        tr.dataset.user = JSON.stringify(dataUser);     
        tr.innerHTML = `
        <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
        <td>${dataUser.name}</td>
        <td>${dataUser.email}</td>
        <td>${(dataUser.admin)?"Sim":"Não"}</td>
        <td>${Utils.dateFormat(dataUser.register)}</td>
        <td>
          <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
          <button type="button" class="btn btn-danger btn-delet btn-xs btn-flat">Excluir</button>
        </td>`;
        this.addEventsTR(tr);
        return tr;
    }
    //metodo para adicionar um novo usuario
    addUser(dataUser){
        let tr = this.getTr(dataUser);
        
        this.tableEl.appendChild(tr);
        this.updateCout();
    }
    //addUser
    updateCout(){
        let numberUser = 0;
        let numberAdmin = 0;
        [...this.tableEl.children].forEach(tr=>{
            numberUser++;
            let user = JSON.parse(tr.dataset.user);
            if(user._admin)numberAdmin++;
        });
        document.querySelector('#number-users').innerHTML = numberUser;
        document.querySelector('#number-users-admin').innerHTML = numberAdmin;
    }
    //updateCout
    onEdite(){
        document.querySelector('#box-user-update #btn-cancel').addEventListener('click', e=>{
            this.showPanelCreate();
        });
        this.formUpdateEl.addEventListener("submit", event=>{
            event.preventDefault();
            let btn = this.formUpdateEl.querySelector('[type=submit]');
            btn.disabled = true;
            let value = this.getValues(this.formUpdateEl);
            console.log(value);
            let index =this.formUpdateEl.dataset.trIndex;
            let tr = this.tableEl.rows[index];
            let userOld = JSON.parse(tr.dataset.user);
            let result = Object.assign({}, userOld, value);
            
            
            
            this.showPanelCreate();
            this.getPhoto(this.formUpdateEl).then((content)=>{
                if(!value.photo){
                   result._photo = userOld._photo; 
                }else{
                    result._photo = content;
                } 

                let user = new User();
                user.loadFormJSON(result);
                user.save();
                this.getTr(user, tr);
                this.updateCout();
                btn.disabled = false;
                this.formUpdateEl.reset();

               },(e)=>{
                   console.log(e);
               })
        })
    }
    //onEdite
    showPanelCreate(){
        document.querySelector('#box-user-create').style.display = 'block';
        document.querySelector('#box-user-update').style.display = 'none';
    }
    //showPanelCreate
    showPanelUpdate(){
        document.querySelector('#box-user-create').style.display = 'none';
        document.querySelector('#box-user-update').style.display = 'block';
    }
    addEventsTR(tr){
        tr.querySelector(".btn-delet").addEventListener('click', e=>{
            if(confirm('Deseja Realmente Excluir?')){
                let user = new User();
                user.loadFormJSON(JSON.parse(tr.dataset.user));
                user.remove();
                tr.remove();
                this.updateCout();
            }
        });
        tr.querySelector(".btn-edit").addEventListener('click', e=>{
            let json = JSON.parse(tr.dataset.user);
            this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex;
            for(let name in json){
               let field = this.formUpdateEl.querySelector("[name="+ name.replace('_','')+"]");
               if(field){
                   switch(field.type){
                        case 'file':
                           continue;
                           break;
                        case 'radio':
                            field = this.formUpdateEl.querySelector("[name="+ name.replace('_','')+"][value="+json[name]+"]");
                            field.checked = true;
                            break;
                        case 'checkbox':
                            field.checked = json[name];
                            break;
                        default:
                            field.value = json[name];
                   }            
               }
            }
            this.formUpdateEl.querySelector(".photo").src = json._photo;
            this.showPanelUpdate();
        });
    }
    //inserir sessionStorage
    
    selectAll(){
        let users = User.getStorageUsers();
        users.forEach(datauser=>{
            let user = new User();
            user.loadFormJSON(datauser);
            this.addUser(user);
        })
    }

}
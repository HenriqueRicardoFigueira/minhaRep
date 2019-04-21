export const validation = {
    nome: {
        presence: {
            message: 'Insira um nome'
        }
    },
    email: {
        presence: {
            message: 'Insira um Email'
        },
        format: {
            pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            message: 'Insira um Email valido'
        }
    },
    password: {
        presence: {
            message: 'Insira uma senha'
        },
        length: {
            minimum: {
                val: 6,
                message: 'Senha muito curta'
            }
        }
    },
    cidade: {
        presence: {
            message: 'Insira sua cidade'
        },
        format: {
            pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            message: 'Insira uma cidade valida'
        }
    },
    idade: {
        presence: {
            message: 'Insira sua idade'
        }
    }
}

export function validate(nameField, value){
    let resp = [null, null];
    if(validation.hasOwnProperty(nameField)){
        let v = validation[nameField]
        if(value == '' || value == null){
            resp[0] = false
            resp[1] = v['presence']['message']
        } else if(v.hasOwnProperty('format') && !v['format']['pattern'].test(value)){
            resp[0] = false
            resp[1] = v['format']['message']
        } else if(v.hasOwnProperty('length')){
            let l = v['length'];
            if(l.hasOwnProperty('minimum') && value.length < l['minimum']['val']){
                resp[0] = false
                resp[1] = v['minimum']['message'] 
            } else if(l.hasOwnProperty('maximum') && value.length < l['maximum']['val']){
                resp[0] = false
                resp[1] = v['maximum']['message']
            }
        } else {
            resp[0] = true
        }
    } else {
        resp[0] = true
    }
    return resp;
}
const jwt = require("jsonwebtoken");
const fs = require('fs');
const expTime = 60; //tempo di validità del token espresso in secondi

var tokenAdministration = function() {
    this.payload="";
    this.token="";
    this.valoreCookie="";
    this.privateKey=fs.readFileSync('keys/private.key', 'UTF8');
}

tokenAdministration.prototype.ctrlToken = function (req,callback) {
    this.payload = "";
    this.token = this.readCookie(req, "token");
    let errToken={codeErr:-1,message:""};
    if (this.token == "")  //prima connessione in assoluto
        errToken={codeErr:403,message:"Token inesistente"};
    else {
        try {
            this.payload = jwt.verify(this.token, this.privateKey);  // restituisce il payload del token (nel caso in cui sia ancora valido)
            console.log("Token OK!");
        } catch (err) {
            errToken={codeErr:403,message:"Token scaduto"};
        }
    }
    callback(errToken);
}

tokenAdministration.prototype.ctrlTokenLocalStorage = function (req,callback) {
    const token = req.headers["token"].split(' ')[1];
    if (token!="null"){
        jwt.verify(token, this.privateKey, function (err, data) {
            if (!err)
                this.payload = data;
            else
                this.payload = {"err_exp": true, "message": "Token scaduto"};
            callback(this.payload);
        });
    }else{
        this.payload = {"err_exp": true, "message": "Token inesistente"};
        callback(this.payload);
    }
}

tokenAdministration.prototype.createToken = function (user) {
    this.token = jwt.sign({
            '_id':user._id,
            'user': user.user,
            'mail':user.mail,
            'exp': Math.floor(Date.now() / 1000 + expTime)
        },
        this.privateKey
    );
    console.log("Creato Nuovo token: " + this.token);
}

tokenAdministration.prototype.readCookie = function (req, name) {
    this.valoreCookie = "";
    if (req.headers.cookie){
        let cookies = req.headers.cookie.split('; ');
        for (let i = 0; i < cookies.length; i++){
            cookies[i] = cookies[i].split("=");
            if (cookies[i][0] == name){
                this.valoreCookie = cookies[i][1];
                break;
            }
        }
    }
    return this.valoreCookie;
}

module.exports = new tokenAdministration();
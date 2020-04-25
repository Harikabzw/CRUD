const config = require('../config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helper/db');
var jwtDecode = require('jwt-decode');

const User = db.User;
// var getIP = require('ipware')().get_ip;
// const requestIp = require('request-ip');


module.exports = {
    authenticate,
    getAll,  
    create, 
    delete:_delete
};

async function authenticate(contdata) {
    console.log('contdata.body',contdata.body.username)
    var username=contdata.body.username

 
    const user = await User.findOne({ username });
    console.log('user',user)
    if (user && bcrypt.compareSync(contdata.body.password, user.password)) {
        
        const { hash, ...password } = user.toObject();
        const token = jwt.sign({ sub: user.role }, config.secret);
        console.log('user',user)    
    
        return {
            ...password,
            hash,
    
            token
        };
   //  }
     
    }
}


async function getAll(req) {
    console.log(req.headers.authorization.split(" ")[1])
  
    let token=req.headers.authorization.split(" ")[1]
    var decoded = jwtDecode(token);
console.log(decoded)
if(decoded.sub=="admin"){
    return await User.find().select('-hash');

}
else{
    return {
        "message":"UnAuthrorized Access"
    }
}
}


async function create(userParam) {
    // validate

    if (await User.findOne({ username: userParam.username })) {
         await User.findOneAndUpdate({username:userParam.username}, {$inc:{attempts:1}});

        throw 'Username "' + userParam.username + '" is already taken';

        
    }

    const user = new User(userParam);

    // hash password
    if (userParam.password) {
        user.password = bcrypt.hashSync(userParam.password, 10);
    }

    // save user
    await user.save(function(err,res){
        //console.log(res)
        if(err) {
         //   throw  "Rqest faile"+err     
            
        }
        
    });
}



async function _delete(id) {
    
    let token=req.headers.authorization.split(" ")[1]
    var decoded = jwtDecode(token);
console.log(decoded)
if(decoded.sub=="admin"){
    await User.findByIdAndRemove(id);
}
else{
    return {
        "message":"UnAuthrorized Access"
    } 
}
}
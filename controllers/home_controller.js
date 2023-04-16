module.exports.home = function(req,res){
    /*return res.end('<h1>running</h1>');*/
    return res.render('home' , {
        title: "home"
    });
}
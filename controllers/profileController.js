class ProfileController{
    static async index(req,res){
        const user = req.user;
        return res.json({status:200, user});
    }
    static async store(){
        
    }
    static async show(){
        
    }
    static async update(){
        
    }
    static async destroy(){
        
    }
}

export default ProfileController;
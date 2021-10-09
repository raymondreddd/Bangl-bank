const Customer= require('./models/customer')

const addData = async () =>{
    //deleteing prv data, for no duplication
    await Customer.deleteMany({});
    console.log("In ADDDDDD");
    try{
        const response=await Customer.insertMany([
            {
                name: "Muku", email: "jamesbondkum@gmail.com", balance: 5000
            }, {
                name: "Tambi", email: "sing@gmail.com", balance: 20
            }, {
                name: "anshul ", email: "aryan@gmail.com", balance: 1500, 
            },
            {
                name: "Varun", email: "dh78@gmail.com", balance: 500
            },
            {
                name: "Magician", email: "sahil_Dogra@gmail.com", balance: 500
            },
            {
                name: "Kabir", email: "12preeta.sax@gmail.com", balance: 500,
            },
            {
                name: "kapoor", email: "kapoor90anku@gmail.com", balance: 500
            },
            {
                name: "Bhoole", email: "dh78@gmail.com", balance: 500
            },
            {
                name: "King", email: "sahil_Dogra@gmail.com", balance: 500
            },
            {
                name: "Piyush", email: "12preeta.sax@gmail.com", balance: 500,
            },
        ])
        console.log(response);
    }catch(err){
        console.log(err);
    }

    // console.log(response);

}


module.exports= addData ;
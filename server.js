const express = require('express');
const axios = require('axios');
const parser = require('body-parser');
const productStoreApp = express();
productStoreApp.use(parser.json())
productStoreApp.use(parser.urlencoded({extended:false}));

productStoreApp.set("view engine","ejs");
productStoreApp.set("views","./views")

// array to store products fetched from API
var products=[];


// homepage
productStoreApp.get("/",(req,res)=>{
    res.sendFile(__dirname+"/views/home.html");
})

// URL mapped to return 10 products from API
productStoreApp.get("/getproducts",async (req,res)=>{

        try{
            let response = await axios.get('https://fakestoreapi.com/products');
            let result = response.data.slice(0,10)
            products = [...result]
            res.render("index.ejs",{data:products})
        } catch(error){
            console.error(error);
        }    
});

// URL mapped to a form for adding a new product
productStoreApp.get('/addproduct',async (req,res)=>{
    res.render("product.ejs")
})

// URL mapped to return the fetched products from API along with the newly added product
productStoreApp.post('/postproduct',async (req,res)=>{

    let newProduct = {
        "id":parseInt(req.body.id),
        "title":req.body.title,
        "price":parseFloat(req.body.price),
        "description":req.body.desc,
        "category":req.body.category,
        "image":req.body.image,
        "rating":{
            "rate":parseFloat(req.body.rate),
            "count":parseInt(req.body.count)
        }
    }

    try{
        let response = await axios.get("https://fakestoreapi.com/products");
        let result = response.data.slice(0,10)
        products = [...result]  
        products.push(newProduct) 
        res.render('index.ejs', {data: products})
    }catch(error){
        console.error(error);
    };
});


productStoreApp.listen(5000,()=>{console.log("Server is up on 5000")})
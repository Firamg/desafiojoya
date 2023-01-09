//IMPORT CONSULTAS

const {getJoyas, prepararHATEOAS, obtenerJoyasConFiltro}=require("./consultas")

//IMPORT EXPRESS

const express=require('express')
const { get } = require("express/lib/response")
const app=express()

//SERVER UP!

app.listen(3000,console.log('Server up!!'))
app.use(express.json())

//MOSTRAR INVENTARIO
app.get("/inventario",async(req,res)=>{
    const queryString=req.query
    const inventario=await getJoyas(queryString)
    const HATEOAS=await prepararHATEOAS(inventario)
    res.json(HATEOAS)

})


//FILTROS

app.get("/invetario/filter",async(req,res)=>{
    const queryString=req.query
    const inventario=await obtenerJoyasConFiltro(queryString)
    res.json(inventario)
})
//MULTIPLES CONEXIONES

const {Pool}=require('pg')

const pool=new Pool({
    host:'localhost',
    user:'postgres',
    password:'1234',
    database:'joyas',
    allawExitOnIdle:true
})

//CONST FORMAT
const format=require('pg-format')

//VALIDADOR
/* const getData=async()=>{
    let consulta="SELECT * FROM inventario"
    const {rows}=await pool.query(consulta)
    console.log(rows)
    return rows
}

getData() */

//1. Crear una ruta GET /joyas que:

//a. Devuelva la estructura HATEOAS de todas las joyas almacenadas en la base de datos (1.5 puntos)

const prepararHATEOAS=(inventario)=>{
    const results=inventario.map((i)=>{
        return{
            name:i.nombre,
            href:`/inventario/obtejo/${i.id}`
        }
    }).slice(0,4)

    const total=inventario.length
    const HATEOAS={
        total,
        results
    }
    return HATEOAS
}


//b. Reciba en la query string los parámetros (2 puntos):
//i. limits: Limita la cantidad de joyas a devolver por página
//ii. page: Define la página
//iii. order_by: Ordena las joyas según el valor de este parámetro, ejemplo: stock_ASC

const getJoyas=async({limits=10,order_by="id_ASC", page=0})=>{

    try{//OBTENER VARIABLES
        const [campo,direccion]=order_by.split("_")
        const offset=page*limits
    
        const formattQuery=format("SELECT * FROM inventario order by %s %s LIMIT %s OFFSET %s",campo,direccion,limits,offset)
        pool.query(formattQuery)
        const {rows:inventario}=await pool.query(formattQuery)
        return inventario
    }catch (e){console.log("error 1")}
    

    

}
//2. Crear una ruta GET /joyas/filtros que reciba los siguientes parámetros en la query string: (3.5 puntos)
//a. precio_max: Filtrar las joyas con un precio mayor al valor recibido
//b. precio_min: Filtrar las joyas con un precio menor al valor recibido.
//c. categoria: Filtrar las joyas por la categoría
//d. metal: Filtrar las joyas por la categoría

const obtenerJoyasConFiltro1=async({precio_max,precio_min,categoria,metal})=>{
    try{

        let filtros=[]
        

    if(precio_max) filtros.push(`precio<=${precio_max}`)
    if(precio_min) filtros.push(`precio>=${precio_min}`)
    if(categoria) filtros.push(`categoria=${categoria}`)
    if(metal) filtros.push(`metal=${metal}`)

    let consulta="SELECT * FROM INVENTARIO"
    if(filtros.length>0){
        filtros=filtros.join(" AND ")
        consulta+=` WHERE ${filtros}`
    }

    const {rows:inventario}=await pool.query(consulta)
    return inventario


    }catch(e){console.log("error")}
    

    
}

const obtenerJoyasConFiltro=async({precio_max,precio_min,categoria_id,metal_id})=>{
    try{

        let filtros=[]
        const values=[]

        const agregarFiltro=(campo,comparador,valor)=>{
            values.push(valor)
            const {length}=filtros
            filtros.push(`${campo} ${comparador} $${length+1}`)
        }
    if(precio_max) agregarFiltro('precio','<=',precio_max)
    if(precio_min) agregarFiltro('precio','>=',precio_min)
    if(categoria_id) agregarFiltro('categoria','=',categoria_id)
    if(metal_id) agregarFiltro('metal','=',metal_id)

    let consulta="SELECT * FROM inventario"

    if(filtros.length>0){
        filtros=filtros.join(" AND ")
        consulta+=` WHERE ${filtros}`
    }

    const {rows:inventario}=await pool.query(consulta,values)
    return inventario


    }catch(e){console.log("error")}
    

    
}

//MODULE EXPORTS

module.exports={getJoyas,prepararHATEOAS,obtenerJoyasConFiltro}
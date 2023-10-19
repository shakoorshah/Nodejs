const forcast = require('./utils/forcast')
const hbs = require('hbs')
const path = require('path')
const express = require('express')
const app = express()

//define paths for express config
const publicDirPath = path.join(__dirname,'../public')  
const viewsPath = path.join(__dirname, '../templates/views')
const partialPath = path.join(__dirname, '../templates/partials')

//setup views location and  handlebars engine 
app.set('views', viewsPath)  
app.set('view engine', 'hbs') 
hbs.registerPartials(partialPath)

//setting up static directory to serve
app.use(express.static(publicDirPath))  

const num = 234.8768798;
console.log(num.toFixed(2));

app.get('',(req,res) => {
       res.render('index',{
           title:'Weather App',
           name: 'Hasaan'
       })

})
app.get('/about',(req,res) => {
    res.render('about',{
        title: 'About me',
        name: 'Hasaan'
    })
})
app.get('/help',(req,res) => {
    res.render('help',{
        title: 'Help',
        message: 'Call 100 for help',
        name: 'Hasaan'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error:'Must provide address'
        })
    }
    forcast(req.query.address,(error,{Temp,Weather,Location} = {}) => {
        if (error) {
            return res.send({error})
        }
        res.send({
            temp: Temp,
            weather: Weather,
            location: Location,
            info: 'Weather here in '+Location+' is '+Weather+' and Temperture is '+Temp+'◦c'
        })
          
    })
    
})

app.get('/products',(req,res) => {
    if (!req.query.search) {
        return res.send({
            error:'You must porvide input'
        })
    }
    console.log(req.query.search)
    res.send({
        products: [] 
    })
})

app.get('/help/*', (req,res) => {
    res.render('404',{
        error:'Help article'
    })
})
app.get('*', (req,res) => {
    res.render('404',{
        error:'Page',
        name:'Hasaan'
    })
})

app.listen(process.env.PORT || 2000, () => {
    console.log('Server is up on port 2000.')
})

const express = require('express')
const morgan = require('morgan')
const app = express()
const body = require('body-parser')
const path = require('path')
const PORT = process.env.PORT || 5000

app.set('view engine', 'ejs')
app.use(express.static('static'))
// app.use(express.static('public'))
app.use(morgan('dev'))

//routes
app.get('/', (req, res) => {
    res.render('homepage',{
        upload: 'upload',
        live: 'live'
    })
})

// upload image
app.get('/upload', (req, res) => {
    res.render('imageUpload',{
        upload: 'upload',
        live: 'live',
        home: "/"
    })
})

// predict live image
app.get('/live', (req, res) => {
    res.render('live',{
        upload: 'upload',
        live: 'live',
        home: "/"
    })
})


app.listen(PORT,() => { console.log(`App listening to port ${PORT}`)})
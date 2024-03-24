import app from "./app.js";
import { sequelize } from "./database/database.js";
import "./models/User.js"
import "./models/Game.js"
import "./models/UserGame.js"

async function main () {
  try {
    await sequelize.sync({force:true})
    console.log("Connection to Databases established")
  }
  catch {
    console.log("Unable to connect")
  }
}

main()

const PORT = 3000
app.disable('x-powered-by')


app.use((req, res , next) => {
    console.log('Mi primer middleware')
    
    next()
})

app.get('/', (req, res) => {
  res.send('Hello World!')
  
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})


// app.use((req,res) => {
//     res.status(404).send('<h1>404</h1>')
// })
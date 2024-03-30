import {createApp} from "./app.js";
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


const app = createApp()
main()

const PORT = 3000
app.disable('x-powered-by')


app.get('/', (req, res) => {
  res.send('Hello World!')
  
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})


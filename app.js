const inquirer = require('inquirer')
const { User } = require('./models/user')

let user

console.clear()
console.log(`
------------------------------------------
    Concurso de preguntas y respuestas
------------------------------------------
`)
console.log('Lista de ganadores:\n')

User.getHistory()

setTimeout(() => {
  console.log('__________________________________________\n')
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Para empezar, escriba su nombre:',
        validate: input => {
          if (input.trim().length < 3) return 'Ingrese un nombre válido'
          return true
        },
      },
    ])
    .then(async ({ name }) => {
      user = new User(name.trim().replace(' ', '_'))

      const { won } = await user.play()

      if (won) {
        await user.save()
        console.log(`
          Felicidades! Has acumulado ${user.finalScore} puntos
          Aparecerás como (${user.username}) en la lista de ganadores
        `)
      }
    })
}, 500)

const inquirer = require('inquirer')
const { Question } = require('./question')

class Round {
  #question
  #points = 100

  constructor(number) {
    this.#question = new Question(number)
    this.#points *= number * 0.5
  }

  get result() {
    return new Promise(resolve => {
      setTimeout(async () => {
        await this.#question.ask()

        if (this.#question.correct) {
          console.log(`Bien! sumastes ${this.#points}pts`)
          if (this.#points < 250) {
            inquirer
              .prompt([
                {
                  type: 'confirm',
                  name: 'withdraws',
                  message: '¿Deseas retirarte con el acumulado actual?',
                },
              ])
              .then(({ withdraws }) => resolve({ withdraws, points: this.#points }))
          } else {
            resolve({ points: this.#points })
          }
        } else {
          resolve({ points: 0 })
          console.log('La respuesta es incorrecta! Perdistes tus puntos :(')
        }
      }, 500)
    })
  }
}

module.exports = { Round }

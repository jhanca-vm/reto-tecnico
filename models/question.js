const inquirer = require('inquirer')
const database = require('../database')

class Question {
  correct = false

  /**
   * @param {number} level nivel de dificultad de la pregunta
   */
  constructor(level) {
    /**
     * Obtiene la primera pregunta del nivel establecido,
     * ordenandolas aleatoriamente y ejecuta el metodo "ask"
     */
    database.get(
      'SELECT * FROM questions WHERE level=? ORDER BY random()',
      [level],
      this.ask
    )
  }

  /**
   * Recibe la respuesta de la base de datos.
   * Si no hay un error, reliza la pregunta
   * y comprueba si la respuesta es correcta
   */
  async ask(err, { question, options, answer }) {
    if (err) throw err

    const input = await inquirer.prompt([
      {
        type: 'list',
        name: 'answer',
        message: question,
        choices: JSON.parse(options),
      },
    ])

    if (input.answer === answer) this.correct = true
  }
}

module.exports = { Question }

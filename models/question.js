const inquirer = require('inquirer')
const database = require('../database')

class Question {
  #data
  #answer

  /**
   * @param {number} level nivel de dificultad de la pregunta
   */
  constructor(level) {
    /**
     * Obtiene la primera pregunta del nivel establecido,
     * ordenandolas aleatoriamente
     */
    database.get(
      'SELECT * FROM questions WHERE level=? ORDER BY random()',
      [level],
      (err, row) => {
        if (err) throw err
        this.#data = row
      }
    )
  }

  async ask() {
    const { answer } = await inquirer.prompt([
      {
        type: 'list',
        name: 'answer',
        message: this.#data.question,
        choices: JSON.parse(this.#data.options),
      },
    ])

    this.#answer = answer
  }

  get correct() {
    return this.#data.answer === this.#answer
  }
}

module.exports = { Question }

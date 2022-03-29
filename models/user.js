const database = require('../database')
const { Round } = require('./round')

class User {
  #id
  #name
  #score = 0
  #level = 1

  constructor(name) {
    this.#name = name
  }

  static getHistory() {
    database.each('SELECT * FROM users ORDER BY score DESC', (err, row) => {
      if (err) throw err
      console.log(`${row.score}pts  -  ${row.name}${row.id}`)
    })
  }

  play() {
    return new Promise(async resolve => {
      let state = await new Round(this.#level).result

      this.#score += state.points

      while (this.#level < 5 && state.points && !state.withdraws) {
        this.#level += 1
        state = await new Round(this.#level).result
        this.#score += state.points
      }

      resolve({ won: state.points !== 0 })
    })
  }

  save() {
    return new Promise(resolve => {
      database.serialize(() => {
        database
          .run('INSERT INTO users (name,score) VALUES (?,?)', [
            this.#name,
            this.#score,
          ])
          .get('SELECT id FROM users WHERE name=?', [this.#name], (err, { id }) => {
            if (err) throw err
            this.#id = id
            resolve()
          })
      })
    })
  }

  get finalScore() {
    return this.#score
  }

  get username() {
    return `${this.#name}${this.#id}`
  }
}

module.exports = { User }

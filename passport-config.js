const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || "postgres://mhbcyrmdbvoijw:0480dbecdc962bd96d8d2b8095bf40d06c69952effb1579597d5bffe6da2be45@ec2-34-193-42-173.compute-1.amazonaws.com:5432/d6babf4h0j1n8v";

const pool = new Pool({ connectionString: connectionString });

const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    const user = getUserByEmail(email)
    if (user == null) {
      return done(null, false, { message: 'No user with that email' })
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Password incorrect' })
      }
    } catch (e) {
      return done(e)
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id))
  })
}

module.exports = initialize
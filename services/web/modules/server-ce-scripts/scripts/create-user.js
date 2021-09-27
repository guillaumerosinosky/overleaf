const minimist = require('minimist')
const { db, waitForDb } = require('../../../app/src/infrastructure/mongodb')
const UserRegistrationHandler = require('../../../app/src/Features/User/UserRegistrationHandler')

async function main() {
  await waitForDb()

  const argv = minimist(process.argv.slice(2), {
    string: ['email'],
    boolean: ['admin'],
    string: ['password'],
  })

  const { admin, email, password } = argv
  if (!email) {
    console.error(`Usage: node ${__filename} [--admin] --email=joe@example.com`)
    process.exit(1)
  }

  await new Promise((resolve, reject) => {
    if (!password) {
      UserRegistrationHandler.registerNewUserAndSendActivationEmail(
        email,
        (error, user, setNewPasswordUrl) => {
          if (error) {
            return reject(error)
          }
          db.users.updateOne(
            { _id: user._id },
            { $set: { isAdmin: admin } },
            error => {
              if (error) {
                return reject(error)
              }

              console.log('')
              console.log(`\
  Successfully created ${email} as ${admin ? 'an admin' : 'a'} user.

  Please visit the following URL to set a password for ${email} and log in:

    ${setNewPasswordUrl}

  `)
              resolve()
            }
          )
        }
      )
    } else {
      var userDetails = {
        email: email,
        isAdmin: admin,
        password: password,
      }
      UserRegistrationHandler.registerNewUser(
        userDetails,
        (error, user) => {
          if (error) {
            return reject(error)
          }
          console.log(`Successfully created ${email}`)
          resolve()
        }
      )
    }
  })
}

main()
  .then(() => {
    console.error('Done.')
    process.exit(0)
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })

import express from 'express'
import mongoose from 'mongoose'
import { MONGODB_URL } from './src/lib/constants'
import router from './src/router'
import cors from 'cors'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql'
import User from './src/lib/mongoose/models/User'
import { Input } from './src/lib/types/User'
import Report from './src/lib/mongoose/models/Report'

const app = express()
app.use(express.json())
app.use(cors())

app.use(router)

mongoose.connect(MONGODB_URL)
const db = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error:'))
db.once('open', () => {
  console.log('Connected to MongoDB!')
})
const schema = buildSchema(`
type Query {
  hello: String
  getUsers: [User]
  getReport(targetId: String!, cycleId: String!): Report
  getUser(id: String): User
  
}

input UserInput {
  email: String!
  fullName: String
  hashedPw: String
  title: String
  isOlga: Boolean
  photo: String
  teamName: String
  companyName: String
}

type Mutation {
  createUser(input: UserInput): User
  changeUser(input: UserInput): User
}

type User {
  _id: String,
  email: String
  fullName: String
  hashedPw: String
  title: String
  isOlga: Boolean
  photo: String
  teamName: String
  companyName: String
}


type ReportID {
  target: String
  cycle: String
}

type Report {
  _id: ReportID
  remarks: String
  status: String
  reviews: Reviews
}

type Reviews {
  self : Review
  peer : [Review]
}
type Review {
  reviewer: String
  isDeclined: Boolean
  submitted: Boolean
  grades: [Grade]
}

type Grade {
  metric: String
  rating: Int
  maxRating: Int
  comment: String
 
}`)

const rootValue = {
  hello: () => {
    return 'Hello world!'
  },
  getUsers: async () => {
    try {
      const users = await User.find()
      return users
    } catch (error) {
      throw new Error('Error fetching users from the database')
    }
  },
  getUser: async ({ id }: { id: String }) => {
    try {
      const user = await User.findById(id)
      return user
    } catch (error) {
      throw new Error('Error fetching users from the database')
    }
  },
  createUser: async ({ input }: { input: Input }) => {
    try {
      const newUser = new User(input)
      const savedUser = await newUser.save()
      return savedUser
    } catch (error) {
      throw new Error('Error creating a new user and saving it to the database')
    }
  },
  changeUser: async ({ input }: { input: Input }) => {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { email: input.email },
        input,
        { new: true }
      )
      return updatedUser
    } catch (error) {
      throw new Error('Error updating a user in the database')
    }
  },
  getReport: async ({
    targetId,
    cycleId,
  }: {
    targetId: String
    cycleId: String
  }) => {
    try {
      const report = await Report.findOne({
        '_id.target': targetId,
        '_id.cycle': cycleId,
      })
      return report
    } catch (error) {
      throw new Error('Error fetching report from the database')
    }
  },
}

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: rootValue,
    graphiql: true,
  })
)
console.log('for arol listening now')
const server = app.listen(8080, () => {
  console.log('connectig to db...', MONGODB_URL)

  console.log('360 review server is listening on port 8080! 🤜🤛')
})

function shutdown() {
  console.log('for craig hello')
  server.close(() => {
    mongoose.connection.close().then(() => {
      process.exit(0)
    })
  })

  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully')
}
process.on('SIGTERM', () => {
  console.log('SIGTERM')
  shutdown()
})
process.on('SIGUSR2', () => {
  console.log('SIGUSR2')
  shutdown()
})
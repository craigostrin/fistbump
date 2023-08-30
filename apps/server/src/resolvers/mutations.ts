import {
  MutationResolvers,
  ReportInput,
  UserInput,
} from '../__generated__/resolvers-types'
import Report from '../lib/mongoose/models/Report'
import User from '../lib/mongoose/models/User'
import Auth from '../lib/services/services.auth'

const mutations: MutationResolvers = {
  Mutation: {

    signup: async (_: any, { email, hashedPw}: {email: string, hashedPw: string}) => {
      const hashedPwd = await Auth.hashPassword(hashedPw)
      const user = new User({ email, hashedPw: hashedPwd })
      await user.save()
      return 'user created'
    },

    createUser: async (_: any, { input }: { input: UserInput }) => {
      try {
        const newUser = new User(input)
        const savedUser = await newUser.save()
        return savedUser
      } catch (error) {
        throw new Error(
          'Error creating a new user and saving it to the database'
        )
      }
    },
    updateUser: async (_: any, { input }: { input: UserInput }) => {
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

    updateReport: async (
      _: any,
      {
        targetId,
        cycleId,
        input,
      }: {
        targetId: String
        cycleId: String
        input: ReportInput
      }
    ) => {
      try {
        const filter = { '_id.targetId': targetId, '_id.cycleId': cycleId }
        const updatedReport = await Report.findOneAndUpdate(filter, input, {
          new: true,
        })
        return updatedReport
      } catch (error) {
        throw new Error('Error updating a report in the database')
      }
    },
  },
}

export default mutations

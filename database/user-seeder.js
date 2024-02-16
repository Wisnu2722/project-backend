/**
 * The main function deletes all users from the database and then creates 5 new users with random
 * email, name, password, and role.
 */

import { faker } from '@faker-js/faker'
import bcrypt from 'bcrypt'
import { config } from 'dotenv'
import prisma from '../app/prisma.js'

config()

const bcryptRound = Number(process.env.BCRYPT_ROUND)

async function main() {
  await prisma.user.deleteMany()

  const roles = await prisma.role.findMany()
  for (let i = 0; i < 5; i++) {
    await prisma.user.create({
      data: {
        email: faker.internet.email().toLowerCase(),
        name: faker.person.fullName(),
        password: bcrypt.hashSync('password', bcryptRound),
        role_id: roles[Math.floor(Math.random() * roles.length)].id
      }
    })
  }
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
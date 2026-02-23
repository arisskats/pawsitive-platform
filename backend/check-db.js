const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const pets = await prisma.pet.findMany()
  console.log('Current Pets in DB:', JSON.stringify(pets, null, 2))
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

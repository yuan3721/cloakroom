import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create seasons
  const seasons = [
    { name: '春', icon: '🌸', displayOrder: 1 },
    { name: '夏', icon: '☀️', displayOrder: 2 },
    { name: '秋', icon: '🍂', displayOrder: 3 },
    { name: '冬', icon: '❄️', displayOrder: 4 },
  ]

  for (const season of seasons) {
    await prisma.season.upsert({
      where: { id: season.name },
      update: {},
      create: {
        id: season.name,
        name: season.name,
        icon: season.icon,
        displayOrder: season.displayOrder,
      },
    })
  }

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const spots = [
    {
      name: 'Pedion tou Areos Dog Park',
      description: 'Large urban green space with open walking paths for dogs.',
      latitude: 37.9927,
      longitude: 23.7364,
      type: 'DOG_PARK',
      rating: 4.5,
    },
    {
      name: 'Nea Smyrni Park Dog Area',
      description: 'Dog-friendly area inside Alsos Neas Smyrnis.',
      latitude: 37.9463,
      longitude: 23.7116,
      type: 'DOG_PARK',
      rating: 4.3,
    },
    {
      name: 'Flisvos Park Dog Walk',
      description: 'Seaside park route popular for dog walks near Palaio Faliro.',
      latitude: 37.9309,
      longitude: 23.6881,
      type: 'DOG_PARK',
      rating: 4.4,
    },
    {
      name: 'Syngrou Grove Dog Spot',
      description: 'Shaded walking grove suitable for daily dog exercise.',
      latitude: 37.9451,
      longitude: 23.7646,
      type: 'DOG_PARK',
      rating: 4.2,
    },
  ];

  for (const spot of spots) {
    await prisma.spot.upsert({
      where: { id: `${spot.name.toLowerCase().replace(/\s+/g, '-')}` },
      update: {
        description: spot.description,
        latitude: spot.latitude,
        longitude: spot.longitude,
        type: spot.type,
        rating: spot.rating,
      },
      create: {
        id: `${spot.name.toLowerCase().replace(/\s+/g, '-')}`,
        name: spot.name,
        description: spot.description,
        latitude: spot.latitude,
        longitude: spot.longitude,
        type: spot.type,
        rating: spot.rating,
      },
    });
  }

  console.log(`Seeded ${spots.length} Athens spots`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

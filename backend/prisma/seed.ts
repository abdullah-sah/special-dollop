import { PrismaClient } from '@prisma/client';
import mockData from './mock.json';

const prisma = new PrismaClient();

const seedUsers = async () => {
	await prisma.user.deleteMany({});
	for (let i = 0; i < mockData.users.length; i++) {
		await prisma.user.create({ data: { ...mockData.users[i] } });
	}
};

const seedRooms = async () => {
	await prisma.room.deleteMany({});
	await prisma.roomMembers.deleteMany({});
	for (let i = 0; i < mockData.rooms.length; i++) {
		await prisma.room.create({
			data: { ...mockData.rooms[i], createdAt: new Date(), members: {} },
		});
	}
};

const seedRoomMembers = async () => {
	for (let i = 0; i < mockData.rooms.length; i++) {
		await prisma.roomMembers.create({
			data: {
				user: {
					connect: {
						id: mockData.users[i].id,
					},
				},
				room: {
					connect: {
						id: mockData.rooms[i].id,
					},
				},
			},
		});
	}
};

const seed = async () => {
	await seedUsers();
	await seedRooms();
	await seedRoomMembers();
};

seed()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
import { Request, Response, Router } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const chatRouter = Router();

export default chatRouter;

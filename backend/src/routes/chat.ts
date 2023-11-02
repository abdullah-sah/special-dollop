import { Request, Response, Router } from 'express';
import { Prisma, PrismaClient } from '../../node_modules/generated/prisma';

const prisma = new PrismaClient();
const chatRouter = Router();

export default chatRouter;

import { NextFunction, Request, Response } from 'express';
import prisma from '../db/PrismaClient';
import APIError from '../errors/APIError';

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await prisma.product.findMany({});
    return res.json(products);
  } catch (error) {
    next(error);
  }
};

const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({ where: { id: id } });

    if (!product) throw new APIError('Product not found', 404);

    return res.json(product);
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;

    const product = await prisma.product.create({ data });

    if (!product) throw new APIError('Product not created', 500);

    return res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) throw new APIError('Product not found', 404);

    const updatedProduct = await prisma.product.update({
      where: { id: id },
      data,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw new APIError('Product not found', 404);
    await prisma.product.delete({ where: { id: id } });
    return res.status(204).json();
  } catch (error) {
    next(error);
  }
};

export default {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};

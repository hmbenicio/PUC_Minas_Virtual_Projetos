import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import * as ProductService from '../services/product.service';

/**
 * @desc    Cria um novo produto
 * @route   POST /api/v1/products
 * @access  Privado (Admin)
 */
export const createProduct = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const product = await ProductService.createProductService(req.body);
  res.status(201).json(product);
});

/**
 * @desc    Obtém todos os produtos
 * @route   GET /api/v1/products
 * @access  Público
 */
export const getAllProducts = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const products = await ProductService.getAllProductsService();
  res.status(200).json(products);
});

/**
 * @desc    Obtém um produto pelo ID
 * @route   GET /api/v1/products/:id
 * @access  Público
 */
export const getProductById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const product = await ProductService.getProductByIdService(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Produto não encontrado');
  }
  res.status(200).json(product);
});

/**
 * @desc    Atualiza um produto
 * @route   PUT /api/v1/products/:id
 * @access  Privado (Admin)
 */
export const updateProduct = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const updatedProduct = await ProductService.updateProductService(req.params.id, req.body);
  if (!updatedProduct) {
    res.status(404);
    throw new Error('Produto não encontrado para atualização');
  }
  res.status(200).json(updatedProduct);
});

/**
 * @desc    Deleta um produto
 * @route   DELETE /api/v1/products/:id
 * @access  Privado (Admin)
 */
export const deleteProduct = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const deletedProduct = await ProductService.deleteProductService(req.params.id);
  if (!deletedProduct) {
    res.status(404);
    throw new Error('Produto não encontrado para exclusão');
  }
  res.status(200).json({ message: 'Produto deletado com sucesso' });
});
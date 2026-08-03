import Product, { IProduct } from '../models/product.model';

// O tipo para o payload de criação pode omitir os campos de Document
type CreateProductPayload = Omit<IProduct, keyof Document | 'createdAt' | 'updatedAt'>;
type UpdateProductPayload = Partial<CreateProductPayload>;

export const createProductService = async (payload: CreateProductPayload): Promise<IProduct> => {
  const product = new Product(payload);
  return await product.save();
};

export const getAllProductsService = async (): Promise<IProduct[]> => {
  return await Product.find();
};

export const getProductByIdService = async (id: string): Promise<IProduct | null> => {
  return await Product.findById(id);
};

export const updateProductService = async (id: string, payload: UpdateProductPayload): Promise<IProduct | null> => {
  return await Product.findByIdAndUpdate(id, payload, { new: true });
};

export const deleteProductService = async (id: string): Promise<IProduct | null> => {
  return await Product.findByIdAndDelete(id);
};
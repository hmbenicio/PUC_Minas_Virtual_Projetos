import { Schema, model, Document } from 'mongoose';

// Interface para tipagem com TypeScript
export interface IProduct extends Document {
  nome: string;
  tipo: 'M' | 'F' | 'I' | 'E';
  tamanho: string;
  estampa: boolean;
  preco: number;
  quantidade: number;
  promo: boolean;
  precoPromo?: number;
  imagem?: string; 
  ads?: string;    
}

const productSchema = new Schema<IProduct>({
  nome: { type: String, required: true, trim: true },
  tipo: {
    type: String,
    required: true,
    enum: {
      values: ['M', 'F', 'I', 'E'],
      message: '{VALUE} não é um tipo suportado. Use M, F, I ou E.'
    }
  },
  tamanho: { type: String, required: true },
  estampa: { type: Boolean, required: true },
  preco: { type: Number, required: true, min: 0 },
  quantidade: { type: Number, required: true, min: 0, default: 0 },
  promo: { type: Boolean, required: true, default: false },
  precoPromo: { 
    type: Number,
    min: 0,
    validate: [
      function(this: IProduct, value: number): boolean {
        return this.preco > value;
      },
      'O preço promocional deve ser menor que o preço normal.'
    ]
  },
  imagem: { type: String, required: false },
  ads: { type: String, required: false },
}, {
  timestamps: true
});

const Product = model<IProduct>('Product', productSchema);

export default Product;
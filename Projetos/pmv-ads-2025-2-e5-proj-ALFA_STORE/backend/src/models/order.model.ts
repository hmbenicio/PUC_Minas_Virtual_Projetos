import mongoose, { Document, Schema } from "mongoose";

export type OrderStatus = "pending" | "paid" | "cancelled";
export type PaymentStatus = "pending" | "approved" | "failure";

export interface OrderItem {
  productId?: string;
  title: string;
  quantity: number;
  unitPrice: number;
}

export interface Order extends Document {
  user?: mongoose.Types.ObjectId;
  customerName?: string;
  customerEmail?: string;
  externalReference: string;
  preferenceId?: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  items: OrderItem[];
  shippingAddress?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<OrderItem>({
  productId: { type: String },
  title: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
});

const OrderSchema = new Schema<Order>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    customerName: { type: String },
    customerEmail: { type: String },
    externalReference: { type: String, required: true, index: true },
    preferenceId: { type: String, index: true },
    status: {
      type: String,
      enum: ["pending", "paid", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "approved", "failure"],
      default: "pending",
    },
    totalAmount: { type: Number, required: true, min: 0 },
    items: { type: [OrderItemSchema], required: true },
    shippingAddress: { type: Schema.Types.Mixed },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export default mongoose.model<Order>("Order", OrderSchema);

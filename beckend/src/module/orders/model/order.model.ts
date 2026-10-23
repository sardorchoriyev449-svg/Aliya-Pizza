import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";

@Schema({ _id: false })
export class OrderItem {
    @Prop({ type: SchemaTypes.ObjectId, ref: 'Product', required: true })
    product_id: Types.ObjectId;

    @Prop({ type: SchemaTypes.String, required: true })
    title: string;

    @Prop({ type: SchemaTypes.Number, required: true })
    price: number;

    @Prop({ type: SchemaTypes.Number, required: true })
    qty: number;
}
export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

// Buyurtma vaqtidagi manzil "suratini" (snapshot) saqlaymiz — chunki foydalanuvchi
// keyinchalik manzilni o'chirsa/o'zgartirsa ham, eski buyurtmaning manzili o'zgarmasligi kerak.
@Schema({ _id: false })
export class OrderAddress {
    @Prop({ type: SchemaTypes.String, required: true })
    label: string;

    @Prop({ type: SchemaTypes.String, required: true })
    address_text: string;

    // GPS koordinatalari MAJBURIY — soxta/qo'lda kiritilgan manzil bilan
    // aldashning oldini olish uchun buyurtma faqat haqiqiy joylashuv bilan qabul qilinadi.
    @Prop({ type: SchemaTypes.Number, required: true })
    lat: number;

    @Prop({ type: SchemaTypes.Number, required: true })
    lng: number;
}
export const OrderAddressSchema = SchemaFactory.createForClass(OrderAddress);

export enum OrderStatus {
    pending = 'PENDING',
    cancelled = 'CANCELLED',
}

@Schema({ collection: 'order', timestamps: true, versionKey: false })
export class Order {
    @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
    user_id: Types.ObjectId;

    @Prop({ type: [OrderItemSchema], required: true })
    items: OrderItem[];

    @Prop({ type: SchemaTypes.Number, required: true })
    total: number;

    @Prop({ type: OrderAddressSchema, required: true })
    address: OrderAddress;

    @Prop({ type: SchemaTypes.String, enum: OrderStatus, default: OrderStatus.pending })
    status: OrderStatus;

    // Taxminan necha daqiqada tayor bo'lishi (frontend shu asosda "taxminan tayor
    // bo'lish vaqti"ni hisoblaydi: createdAt + estimated_minutes)
    @Prop({ type: SchemaTypes.Number, default: 40 })
    estimated_minutes: number;
}
export const OrderSchema = SchemaFactory.createForClass(Order);
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Order, OrderStatus } from "./model/order.model";
import { CreateOrderDto } from "./dtos/order-create.dtos";
import { RequestWithUser } from "../../common/helper/get-user-interface";
import { UserRole } from "../../common/helper/role.types";
import { User } from "../users/model/user.model";
import { Product } from "../products/model/products.moduel";
import { Category } from "../categories/model/category.model";
import { OrderGateway } from "./order.gateway";
import { TelegramService } from "../../common/telegram/telegram.service";

@Injectable()
export class OrderService {
    constructor(
        @InjectModel(Order.name) private readonly model: Model<Order>,
        @InjectModel(User.name) private readonly userModel: Model<User>,
        @InjectModel(Product.name) private readonly productModel: Model<Product>,
        @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
        private readonly gateway: OrderGateway,
        private readonly telegram: TelegramService,
    ) {}

    async create(dto: CreateOrderDto, req: RequestWithUser) {
        const total = dto.items.reduce((sum, item) => sum + item.price * item.qty, 0);

        const order = await this.model.create({
            user_id: req.user.id,
            items: dto.items,
            address: dto.address,
            total,
        });

        const populatedOrder = await this.model.findById(order._id).populate('user_id', 'name phone');

        // Admin panelga real vaqtda xabar beramiz
        this.gateway.emitNewOrder(populatedOrder);
        // Telegramga ham chiroyli formatlangan xabarnoma yuboramiz
        this.telegram.sendOrderNotification(populatedOrder);

        return { success: true, message: 'Buyurtma qabul qilindi!', data: order };
    }

    async getAll(req: RequestWithUser) {
        if (req.user.role !== UserRole.admin) return { success: false, message: 'Faqat Admin!' };
        return await this.model.find().populate('user_id', 'name phone').sort({ createdAt: -1 });
    }

    // Foydalanuvchining o'z buyurtmalari ("Buyurtmalarim" sahifasi uchun)
    async getMine(req: RequestWithUser) {
        return await this.model.find({ user_id: req.user.id }).sort({ createdAt: -1 });
    }

    // Foydalanuvchi o'z buyurtmasini FAQAT birinchi 20 daqiqa ichida va u
    // hali "PENDING" holatida bo'lsa bekor qila oladi.
    async cancel(id: string, req: RequestWithUser) {
        const order = await this.model.findOne({ _id: id, user_id: req.user.id });
        if (!order) return { success: false, message: 'Buyurtma topilmadi' };

        if (order.status === OrderStatus.cancelled) {
            return { success: false, message: 'Bu buyurtma allaqachon bekor qilingan' };
        }

        const minutesPassed = (Date.now() - (order as any).createdAt.getTime()) / 60000;
        if (minutesPassed > 20) {
            return { success: false, message: 'Bekor qilish vaqti tugagan (buyurtmadan 20 daqiqadan ko\'p vaqt o\'tgan)' };
        }

        order.status = OrderStatus.cancelled;
        await order.save();

        this.gateway.emitOrderCancelled(order._id.toString());

        return { success: true, message: 'Buyurtma bekor qilindi', data: order };
    }

    async getStats(req: RequestWithUser) {
        if (req.user.role !== UserRole.admin) return { success: false, message: 'Faqat Admin!' };

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const [userCount, productCount, categoryCount, orderCount, monthOrders, allOrders] = await Promise.all([
            this.userModel.countDocuments(),
            this.productModel.countDocuments(),
            this.categoryModel.countDocuments(),
            this.model.countDocuments(),
            this.model.find({ createdAt: { $gte: startOfMonth }, status: { $ne: OrderStatus.cancelled } }),
            this.model.find({ status: { $ne: OrderStatus.cancelled } }),
        ]);

        const revenueThisMonth = monthOrders.reduce((sum, o) => sum + o.total, 0);
        const revenueTotal = allOrders.reduce((sum, o) => sum + o.total, 0);

        return {
            success: true,
            data: {
                userCount,
                productCount,
                categoryCount,
                orderCount,
                ordersThisMonth: monthOrders.length,
                revenueThisMonth,
                revenueTotal,
            },
        };
    }
}
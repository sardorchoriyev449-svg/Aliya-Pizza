import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({
    cors: {
        origin: 'http://localhost:5173', // frontend manzili
        credentials: true,
    },
})
export class OrderGateway {
    @WebSocketServer()
    server: Server;

    // Yangi buyurtma yaratilganda barcha ulangan mijozlarga (admin panelga) xabar beradi
    emitNewOrder(order: any) {
        this.server.emit('new-order', order);
    }

    // Buyurtma bekor qilinganda ham admin panelga xabar beramiz
    emitOrderCancelled(orderId: string) {
        this.server.emit('order-cancelled', orderId);
    }
}
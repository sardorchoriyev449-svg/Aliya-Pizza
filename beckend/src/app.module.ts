import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose'
import { AuthGuard } from './common/guards/auth.guard';
import { UserModule } from './module/users/user.module';
import { ProductModule } from './module/products/products.module';
import { AuthModule } from './module/auth/auth.module';
import { CategoryModule } from './module/categories/category.module';
import { UploadModule } from './module/upload/upload.module';
import { OrderModule } from './module/orders/order.module';
import { JwtModule } from '@nestjs/jwt';
import { AddressModule } from './module/addres/address.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    JwtModule.register({
      global:true
    }),
    MongooseModule.forRoot(process.env.MONGO_URL as string),
    UserModule,
    ProductModule,
    AuthModule,
    CategoryModule,
    UploadModule,
    OrderModule,
    AddressModule,
  ],
  providers: [{
    provide: APP_GUARD,
    useClass: AuthGuard
  }],
})
export class AppModule {}

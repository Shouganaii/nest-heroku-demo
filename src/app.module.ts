import { Module } from '@nestjs/common';
import { EstablishmentController } from './modules/businessLayer/controllers/establishment.controller';
import { CustomerController } from './modules/businessLayer/controllers/customer.controller';
import { OrderController } from './modules/businessLayer/controllers/order.controller';
import { EstablishmentService } from './modules/businessLayer/services/establishment.service';
import { CustomerService } from './modules/businessLayer/services/customer.service';
import { OrderService } from './modules/businessLayer/services/order.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerSchema } from './modules/businessLayer/schemas/customer.schema';
import { EstablishmentSchema } from './modules/businessLayer/schemas/establishment.schema';
import { OrderSchema } from './modules/businessLayer/schemas/order.schema';
import { AuthModule } from './modules/businessLayer/auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './modules/businessLayer/controllers/auth.controller';
import { AppController } from './app.controller';



@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..',  'files'),
      serveStaticOptions: { index: false }
    }),
  
    MulterModule.register({
      dest: './files',
    }),
    MongooseModule.forRoot('mongodb+srv://caiocaio:caiocaio@iwaiter.nwbd3.mongodb.net/<dbname>?retryWrites=true&w=majority'),
  //  MongooseModule.forRoot('mongodb://localhost:27017/iwaiter'),
    MongooseModule.forFeature([
      {
        name: 'Customer',
        schema: CustomerSchema
      },
      {
        name: 'Establishment',
        schema: EstablishmentSchema
      },
      {
        name: 'Order',
        schema: OrderSchema
      },
    ]),
  ],
  controllers: [
    EstablishmentController,
    CustomerController,
    AuthController,
    OrderController,
  AppController],
  
  providers: [EstablishmentService, CustomerService, OrderService],
})
export class AppModule { }

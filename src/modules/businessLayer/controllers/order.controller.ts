/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Param, HttpException, HttpStatus, Post, UseInterceptors, Body, Put } from '@nestjs/common';
import { OrderService } from 'src/modules/businessLayer/services/order.service';
import { Result } from 'src/modules/businessLayer/models/result.model';
import { OrderCatalog } from 'src/modules/businessLayer/models/order-catalog.model';
import { EstablishmentService } from '../services/establishment.service';
import { CustomerService } from '../services/customer.service';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
    ApiBody,
} from '@nestjs/swagger';

@ApiTags('orders')
@Controller('v1/orders')
export class OrderController {
    constructor(
        private readonly service: OrderService,
        private readonly establishmentService: EstablishmentService,
        private readonly customerService: CustomerService
    ) { }
    @Get(':id_establishment/verify/:id_point')
    @ApiOperation({
        summary: 'Verificação a existencia da mesa dentro do estabelecimento e traz o catalogo ',
    })
    @ApiResponse({ status: HttpStatus.OK, description: '' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Dados inválidos' })

    async verifiyPoint(@Param('id_establishment') idEstablishment: string, @Param('id_point') idPoint: string): Promise<any> {
        try {

            const bringEstablishmentInfo = await this.establishmentService.getEveything(idEstablishment)
            const { settings: { openingHours, closingTime } } = bringEstablishmentInfo[0];
            const currentHour = new Date().getHours()
            function parseTime(timeString) {
                if (timeString == '') return null;
                const d = new Date();
                const time = timeString.match(/(\d+)(:(\d\d))?\s*(p?)/i);
                d.setHours(parseInt(time[1], 10) + ((parseInt(time[1], 10) < 12 && time[4]) ? 12 : 0));
                d.setMinutes(parseInt(time[3], 10) || 0);
                d.setSeconds(0, 0);
                return d;
            }
            const open = parseTime(openingHours).getHours();
            const close = parseTime(closingTime).getHours();
            if (currentHour > open && currentHour < close) {
                const catalog = await this.service.getCatalog(idEstablishment);
                return new Result('Catalogo carregado com sucesso', true, catalog, null)
            } else {
                return new Result('Fora do horário de funcionamento desse restaurante não é possível abrir comanda', false, null, null)
            }
        } catch (error) {
            throw new HttpException(new Result('Não foi possível verificar o point', false, error, error), HttpStatus.NOT_FOUND);
        }

    }
    @Post('create/:id_customer/:id_establishment/:num_point')
    @ApiOperation({
        summary: 'Cria uma ordem',
    })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Pedido(s) efetuado(s) com sucesso!' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Não foi possível criar seu pedido' })
    async createOrder(
        @Param('id_customer') idCustomer: string,
        @Param('id_establishment') idEstablishment: string,
        @Param('num_point') idPoint: string,
        @Body() orders: any): Promise<any> {
        try {
            const newOrders = orders.map((item) => {
                delete item._id
                return item;
            })
            const pointNumber = await this.service.verifyPointNumber(idEstablishment, idPoint);
            const { num } = pointNumber[0];
            const establishmentInfo = await this.establishmentService.getAccountSettings(idEstablishment);
            const customerInfo = await this.customerService.findUserInfo(idCustomer);
            const order = await this.service.createOrder(idEstablishment, establishmentInfo, idCustomer, customerInfo, newOrders, idPoint, num);
            return new HttpException(new Result('Pedido(s) efetuado(s) com sucesso', true, order, null), HttpStatus.CREATED)
        } catch (error) {
            console.log(error)
            return new HttpException(new Result('Não foi possível criar seu pedido', false, null, error), HttpStatus.NOT_FOUND);
        }
    }

    @Post(':id_order/request')
    @ApiOperation({
        summary: 'Cria uma nova ordem',
    })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Pedido(s) efetuado(s) com sucesso!' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Não foi possível adicionar os itens na sua comanda' })
    async newRequest(@Param('id_order') idOrder: string, @Body() model: OrderCatalog): Promise<any> {
        try {
            const order = await this.service.newRequest(idOrder, model);
            return new HttpException(new Result('Pedido(s) efetuado(s) com sucesso', true, order, null), HttpStatus.CREATED)
        } catch (error) {
            return new HttpException(new Result('Não foi possível adicionar os itens na sua comanda', false, null, error), HttpStatus.NOT_FOUND);
        }
    }
    @Put(':id_order/status/:id_catalog')
    @ApiOperation({
        summary: 'Altera o status do pedido dentro de uma ordem',
    })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Status alterado com sucesso!' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Não foi possível alterar os status do item' })
    async changeRequestStatus(@Param('id_order') idOrder: string, @Param('id_catalog') idCatalog: string): Promise<any> {
        try {
            const order = await this.service.changeRequestStatus(idOrder, idCatalog, 0);
            console.log(order)
            return new Result(null, true, order, null)
        } catch (error) {
            throw new HttpException(new Result('Não foi possível mudar o status da comanda', false, null, error), HttpStatus.NOT_FOUND);
        }
    }
    @Post('id_establishment')
    @ApiOperation({
        summary: 'Pega todas as ordens,ativas ou inativas de um estabelecimento',
    })
    @ApiResponse({ status: HttpStatus.OK })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Não foi possível buscar as comandas ativas' })
    async getActiveOrders(@Body('id_establishment') idEstablishment: string): Promise<any> {
        try {
            const order = await this.service.getAllEstablishmentOrders(idEstablishment);
            return new Result(null, true, order, null)
        } catch (error) {
            return new HttpException(new Result('Não foi possível buscar as comandas ativas', false, null, error), HttpStatus.NOT_FOUND);
        }
    }
    @Get(':id_establishment/:id_customer/lastorder')
    async getLastOrderByEstablishment(@Param('id_establishment') idEstablishment: string,
        @Param('id_customer') idCustomer: string): Promise<any> {
        try {
            const lastOrder = await this.service.getLastOrder(idCustomer, idEstablishment);
            return new Result(null, true, lastOrder, null)

        } catch (error) {
            throw new HttpException(new Result('Não foi possível verificar o point', false, null, error), HttpStatus.NOT_FOUND);
        }
    }

    @Post(':id_order/changeOrderStatus/:nested_order_id/:value')
    @ApiOperation({
        summary: 'Altera o status de um pedido',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Status do pedido alterado com sucesso' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Não foi possível buscar as comandas ativas' })
    async changeOrderOrderStatus(@Param('id_order') idOrder: string, @Param('nested_order_id') nestedOrder: string, @Param('value') value: number): Promise<any> {
        try {
            const result = await this.service.changeRequestStatus(idOrder, nestedOrder, value);
            return new HttpException(new Result('Status do pedido alterado com sucesso', true, result, null), HttpStatus.OK);
        } catch (error) {
            return new HttpException(new Result('Não foi possível alterar o status do pedido', false, null, error), HttpStatus.NOT_FOUND);
        }

    }
    @Post(':id_order/cancelOrder/:id_establishment/:id_customer')
    @ApiOperation({
        summary: 'Cancela um pedido,desde que não tenha itens confirmados',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Pedido cancelado' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Não foi possível cancelar seu pedido' })
    async cancelOrder(@Param('id_order') idOrder: string, @Param('id_establishment') idEstablishment: string, @Param('id_customer') idCustomer: string,): Promise<any> {
        try {
            console.log(idOrder)
            console.log(idEstablishment)
            console.log(idCustomer)
            const result = await this.service.cancelOrder(idOrder, idEstablishment, idCustomer)
            if (result.isCanceled)
                return new HttpException(new Result('Pedido cancelado', true, result, null), HttpStatus.OK);
        } catch (error) {
            return new HttpException(new Result('Não foi possível alterar o status do pedido', false, null, error), HttpStatus.NOT_FOUND);
        }

    }

    @Get('getById/:id_order')
    @Post(':id_order/changeOrderStatus/:nested_order_id/:value')
    @ApiOperation({
        summary: 'Traz todos os dados de uma ordem',
    })
    @ApiResponse({ status: HttpStatus.OK })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Não foi possível buscar a ordem' })
    async getOrderByIdAndCustomerAndEstablishment(@Param('id_order') idOrder: string) {
        try {
            const result = await this.service.getOrderById(idOrder);
            return new HttpException(new Result(null, true, result, null), HttpStatus.OK);
        } catch (error) {
            return new HttpException(new Result('Não foi possível trazer buscar a ordem', false, null, error), HttpStatus.NOT_FOUND);
        }
    }


    @Post('endOrder/:id_order/:method')
    @ApiOperation({
        summary: 'Faz o cliente fechar a comanda',
    })
    @ApiResponse({ status: HttpStatus.OK })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Não foi possível fechar sua comanda' })
    async endOrder(@Param('id_order') idOrder: string, @Param('method') method: string) {
        try {
            const result = await this.service.endOrder(idOrder, method);
            return new HttpException(new Result('Comanda fechada com sucesso! \n Dirija-se ao caixa para efetuar o pagamento no método selecionado', true, result, null), HttpStatus.OK);
        } catch (error) {
            return new HttpException(new Result('Não foi possível fechar sua comanda', false, null, error), HttpStatus.NOT_FOUND);
        }
    }
    @Post('confirmPayment/:id_order/:id_establishment/:id_customer')
    @ApiOperation({
        summary: 'Confirma o pagamento da comanda pelo estabelecimento',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Confirmação de pagamento processada com sucesso' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Não foi possível confirmar o pagamento' })
    async confirmPayment(
        @Param('id_order') idOrder: string,
        @Param('id_establishment') idEstablishment: string,
        @Param('id_customer') idCustomer: string

    ) {
        try {
            const result = await this.service.confirmPayment(idOrder, idEstablishment, idCustomer);
            return new HttpException(new Result('Confirmação de pagamento processada com sucesso', true, result, null), HttpStatus.OK);
        } catch (error) {
            return new HttpException(new Result('Não foi possível confirmar o pagamento', false, null, null), HttpStatus.NOT_FOUND);
        }
    }
}

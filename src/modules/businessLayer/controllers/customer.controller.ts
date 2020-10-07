/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Controller, Get, Post, UseGuards, Param, Body, UseInterceptors, HttpException, HttpStatus, Put } from "@nestjs/common";
import { Result } from "../models/result.model";
import { CustomerService } from "../services/customer.service";
import { UpdateCustomerDto } from "../dtos/customer/update-customer.dto";
import { JwtAuthGuard } from "src/modules/shared/guards/auth.guard";
import { RoleInterceptor } from "src/modules/shared/interceptors/role.interceptor";
import { OrderService } from "../services/order.service";

import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
@ApiBearerAuth()
@ApiTags('customers')
@Controller('v1/customers')
export class CustomerController {

    constructor(private readonly service: CustomerService, private readonly orderService: OrderService) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(new RoleInterceptor(['customer']))
    @ApiOperation({
        summary: 'Seleciona todos os clientes',
    })
    @ApiResponse({ status: HttpStatus.FOUND, description: 'Usuário autenticado com sucesso e catalogo aberto ' })
    async getAll() {
        const customers = await this.service.findAll();
        return new Result(null, true, customers, null);
    }
    @Get(':id_customer')
    @ApiOperation({
        summary: 'Pega as informações de um cliente',
    })
    @ApiResponse({ status: HttpStatus.FOUND, description: '' })
    async get(@Param('id_customer') id_customer: string) {
        const customers = await this.service.find(id_customer);
        return new Result(null, true, customers, null);
    }
    @Get('info/:id_customer')
    @ApiOperation({
        summary: 'Pega as informações de configurações de um cliente,juntamente com os dados das suas comandas',
    })
    @ApiResponse({ status: HttpStatus.FOUND, description: '' })

    async getUserInfo(@Param('id_customer') id_customer: string) {
        const customers = await this.service.findUserInfo(id_customer);
        const customerOrders = await this.orderService.getAllCustomerOrders(id_customer);

        return new Result(null, true, { customers, customerOrders }, null);
    }
    @Post(':id_customer')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(new RoleInterceptor(['customer']))
    @ApiOperation({
        summary: 'Atualiza as informações de configurações de um cliente',
    })
    @ApiResponse({ status: HttpStatus.OK, description: '' })
    async update(@Param('id_customer') id_customer, @Body() model: UpdateCustomerDto) {
        try {
            await this.service.update(id_customer, model);
            return new Result('Dados alterados com sucesso', true, null, null);
        } catch (err) {
            throw new HttpException(new Result('Não foi possível atualizar', false, null, err), HttpStatus.NOT_MODIFIED);
        }
    }

    @Put(':id_customer/update')
    @ApiOperation({
        summary: 'Atualiza as informações de configurações de um cliente',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Dados atualizados com sucesso' })
    async updateCustomerData(@Param('id_customer') id_customer: string, @Body() body: any) {
        try {
            const response = await this.service.updateCustomer(id_customer, body.data, body.type)
            return new Result('Dados atualizados com sucesso', true, response, []);
        } catch (err) {
            throw new HttpException(new Result('Não foi possível atualizar', false, null, err), HttpStatus.NOT_MODIFIED);
        }
    }

}

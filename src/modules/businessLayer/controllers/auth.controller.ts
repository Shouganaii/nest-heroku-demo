/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Post, HttpStatus, Body, HttpException, Controller } from "@nestjs/common";
import { ApiOperation, ApiBody, ApiResponse, ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthService } from "../auth/auth.service";
import { AuthDto } from "../dtos/customer/auth-customer.dto";
import { AuthWithOrderOpenDto } from "../dtos/customer/auth-with-order-open.dto";
import { CreateCustomerDto } from "../dtos/customer/create-customer.dto";
import { CustomerDto } from "../dtos/customer/customer-dto.dto";
import { AuthEstablishmentDto } from "../dtos/establishment/auth-establishment.dto";
import { Establishment } from "../models/Establishment.model";
import { Result } from "../models/result.model";
import { CustomerService } from "../services/customer.service";
import { EstablishmentService } from "../services/establishment.service";
import { OrderService } from "../services/order.service";


@ApiBearerAuth()
@ApiTags('auth')
@Controller('v1/auth')
export class AuthController {
    constructor(private readonly service: CustomerService,
        private readonly authService: AuthService,
        private readonly orderService: OrderService,
        private readonly establishmentService: EstablishmentService
    ) { }
    @Post('customers/login')
    @ApiOperation({
        summary: 'Autenticação normal de cliente',
    })
    @ApiBody({ type: AuthDto })
    @ApiResponse({ status: HttpStatus.OK, description: 'Cliente autenticado com sucesso' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Usuário ou senha inválidos' })
    @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Dados  inválidos' })
    async customerLogin(@Body() model: AuthDto): Promise<any> {
        try {
            if (!model.email || !model.password) {
                return new HttpException(new Result('Dados inválidos', false, null, null), HttpStatus.UNPROCESSABLE_ENTITY);
            }
            console.log(model)
            const customer = await this.service.authenticate(model.email, model.password);
            if (!customer) {
                return new HttpException(new Result('Usuário ou senha inválidos', false, null, null), HttpStatus.UNAUTHORIZED);
            }
            const token = await this.authService.createToken(customer.name, customer.email, customer.photo, customer.roles)
            return new Result('Cartão salvo com sucesso', true, { customer, token }, null)
        } catch (error) {
            console.log(error)
        }
    }

    @Post('customers/login/orderopen')
    @ApiOperation({
        summary: 'Autenticação de cliente com comanda aberta',
    })

    @ApiResponse({ status: 200, description: 'Usuário autenticado com sucesso e catalogo aberto ' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Usuário ou senha inválidos' })
    @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Dados inválidos' })
    async authWithOrderOpen(@Body() model: AuthWithOrderOpenDto): Promise<any> {
        try {
            console.log(model)
            if (!model.email || !model.id_establishment || !model.id_point || !model.password) {
                return new HttpException(new Result('Dados inválidos', false, null, null), HttpStatus.UNPROCESSABLE_ENTITY);
            }
            const customer = await this.service.authenticate(model.email, model.password);
            if (!customer) {
                return new HttpException(new Result('Usuário ou senha inválidos', false, null, null), HttpStatus.UNAUTHORIZED);
            }
            const token = await this.authService.createToken(customer.name, customer.email, customer.photo, customer.roles);

            const checkData = await this.orderService.getOrderOpen(model.id_establishment, model.id_point, customer._id, model.id_order);

            return new HttpException(new Result(null, true, { customer, token, checkData }, null), HttpStatus.OK)
        } catch (error) {
            console.log(error)
        }

    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    @Post('/customers/create')
    @ApiOperation({
        summary: 'Registra cliente',
    })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Usuário criado com sucesso!' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Email em uso' })
    @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Dados inválidos' })
    async post(@Body() model: CreateCustomerDto) {
        try {
            if (!model.email || !model.name || !model.password) {
                return new HttpException(new Result('Dados inválidos', false, null, null), HttpStatus.UNPROCESSABLE_ENTITY);
            }
            const customer = new CustomerDto(model.name, model.email, model.password);
            const res = await this.service.create(customer);
            return new Result('Usuário criado com sucesso', true, res, null);
        } catch (error) {
            //Rollback caso não dê pra adicionar usuário
            return new HttpException(new Result('Esse email já está em uso', false, null, error), HttpStatus.BAD_REQUEST);
        }
    }

    @Post('/establishments/login')
    @ApiOperation({
        summary: 'Autenticação padrão de estabelecimento',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Estabelecimento autenticado com sucesso' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Email ou senha inválidos' })
    @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Dados  inválidos' })
    async auth(@Body() model: AuthEstablishmentDto) {
        console.log(model)
        if (!model.email || !model.password) {
            return new HttpException(new Result('Dados  inválidos', false, null, null), HttpStatus.UNPROCESSABLE_ENTITY)
        }
        const establishment = await this.establishmentService.authenticate(model.email, model.password);
        if (!establishment) {
            return new HttpException(new Result('Email ou senha inválidos', false, null, null), HttpStatus.UNAUTHORIZED)
        }
        const token = this.authService.createToken(establishment.name, establishment.email, establishment.photo, establishment.roles)
        return new HttpException(new Result(null, true, { establishment, token }, null), HttpStatus.OK)
    }
    @Post('/establishments/create')
    @ApiOperation({
        summary: 'Registro  de estabelecimento',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Estabelecimento criado com sucesso' })
    @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Dados  inválidos' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Endereço de email já se encontra em uso' })
    async createEstablishment(@Body() model: Establishment): Promise<any> {
        try {
            const establishment = await this.establishmentService.createEstablishment(model);
            return new HttpException(new Result('Estabelecimento cadastrado com sucesso', true, establishment, null), HttpStatus.CREATED)
        } catch (error) {
            return new HttpException(new Result('Endereço de email já se encontra em uso', false, null, error), HttpStatus.UNAUTHORIZED);
        }
    }


}
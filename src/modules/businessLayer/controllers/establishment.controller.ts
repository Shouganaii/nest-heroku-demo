/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
    Controller, Get, Post, Body, HttpException, HttpStatus, Param, Put, UseInterceptors, UploadedFile, Delete
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'
import { Result } from 'src/modules/businessLayer/models/result.model';
import { Establishment } from 'src/modules/businessLayer/models/Establishment.model';
import { CreatePointDto } from 'src/modules/businessLayer/dtos/establishment/create-point.dto';
import { EstablishmentService } from '../services/establishment.service';
import { EstablishmentAccount } from '../models/Establishment-account.model';
import { editFileName, imageFileFilter, deleteFile } from '../utils/file-uploading.utils';
import { diskStorage } from 'multer';
import {
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';

@ApiTags('establishment')
@Controller('v1/establishment')
export class EstablishmentController {
    constructor(
        private readonly service: EstablishmentService
    ) { }

    @Post(':id_establishment/settings')
    @ApiOperation({
        summary: 'Configurações do estabelecimento',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Estabelecimento atualizado com sucesso' })
    @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Dados  inválidos' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Não foi possível atualizar seus dados' })
    async createSettings(@Param('id_establishment') id_establishment: string, @Body() model: Establishment): Promise<any> {
        try {
            const establishment = await this.service.createEstablishmentSettings(id_establishment, model);
            return new Result('Configurações atualizadas com sucesso', true, establishment, null)
        } catch (error) {
            throw new HttpException(new Result('Não foi possível atualizar seus dados', false, null, error), HttpStatus.NOT_FOUND);
        }
    }

    @Post(':id_establishment/address')
    @ApiOperation({
        summary: 'Criação da configuração de endereço do estabelecimento',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Endereço atualizado com sucesso' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Dados  inválidos' })
    @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Não foi possível atualizar seus dados' })
    async createAddress(@Param('id_establishment') id_establishment: string, @Body() model: any): Promise<any> {
        try {

            const establishment = await this.service.createOrUpdateAddress(id_establishment, model);
            return new HttpException(new Result('Endereço salvo com sucesso', true, establishment, null), HttpStatus.OK)
        } catch (error) {
            return new HttpException(new Result('Não foi possível adicionar seu endereço', false, null, error), HttpStatus.NOT_FOUND);
        }
    }
    @Post(':id_establishment/points')
    @ApiOperation({
        summary: 'Criação de pontos do estabelecimento',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Ponto adicionado com sucesso' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Dados  inválidos' })
    @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Não foi possível atualizar seus dados' })
    async createPoint(@Param('id_establishment') id_establishment: string, @Body() model: CreatePointDto): Promise<any> {
        try {
            const establishment = await this.service.createPoint(id_establishment, model);
            return new Result('Ponto salvo com sucesso', true, establishment, null)
        } catch (error) {
            throw new HttpException(new Result('Não foi possível adicionar seu ponto', false, null, error), HttpStatus.NOT_FOUND);
        }
    }
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: './files',
                filename: editFileName,
            }),
            fileFilter: imageFileFilter,
        }),
    )

    @Post(':id_establishment/catalog')
    @ApiOperation({
        summary: 'Criação de itens do catálogo do estabelecimento',
    })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Produto criado com sucesso' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Dados  inválidos' })
    @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Não foi possível inserir o item no seu catalogo' })
    async createCatalog(
        @UploadedFile() file,
        @Param('id_establishment') id_establishment: string, @Body() model: any): Promise<any> {
        const imageCatalog = file.filename;
        try {
            if (file) {
                if (!model.name || !model.value || !model.category || !model.description) {
                    return new HttpException(new Result('Não foi possível inserir o item no seu catalogo', true, null, null), HttpStatus.UNPROCESSABLE_ENTITY)
                }
                const establishment = await this.service.createCatalog(id_establishment, model, imageCatalog);
                return new HttpException(new Result('Produto salvo com sucesso', true, establishment, null), HttpStatus.CREATED)
            } else {
                return new HttpException(new Result('Não foi possível inserir um item sem imagem', false, null, null), HttpStatus.NOT_ACCEPTABLE);
            }
        } catch (error) {
            return new HttpException(new Result('Não foi possível cadastrar o item', false, null, error), HttpStatus.NOT_FOUND);
        }
    }

    @Delete(':id_establishment/catalog/:id_item/delete')
    @ApiOperation({
        summary: 'Deleta item do catálogo do estabelecimento',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Produto deletado com sucesso' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Dados  inválidos' })
    @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Não foi possível excluir o item' })
    async deleteItem(
        @Param('id_establishment') id_establishment: string,
        @Param('id_item') id_item: string): Promise<any> {
        try {
            const deleteItem = await this.service.deleteItem(id_establishment, id_item);
            if (deleteItem.nModified === 0) {
                return new HttpException(new Result('Produto deletado com sucesso', false, null, null), HttpStatus.OK);
            } else {
                return new HttpException(new Result('Não foi possível excluir o Produto', false, null, null), HttpStatus.NOT_FOUND);
            }
        } catch (error) {
            return new HttpException(new Result('Não foi possível excluir o Produto', false, null, error), HttpStatus.NOT_FOUND);
        }
    }

    @Put(':id_establishment/address')
    @ApiOperation({
        summary: 'Alteração de endereço do estabelecimento',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Endereço salvo com sucesso' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Dados  inválidos' })
    @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Não foi possível alterar seu endereço' })
    async updateAddress(@Param('id_establishment') id_establishment: string, @Body() model: any): Promise<any> {
        try {
            const establishment = await this.service.createOrUpdateAddress(id_establishment, model);
            return new Result('Endereço salvo com sucesso', true, establishment, null)
        } catch (error) {
            throw new HttpException(new Result('Não foi possível adicionar seu endereço', false, null, error), HttpStatus.NOT_FOUND);
        }
    }
    @Put(':id_establishment/catalog/:id_catalog')
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: './files',
                filename: editFileName,
            }),
            fileFilter: imageFileFilter,
        }),
    )
    @ApiOperation({
        summary: 'Alteração de itens do catálogo do estabelecimento',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Produto salvo com sucesso' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Dados  inválidos' })
    @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Não foi possível atualizar o item do seu catalogo' })
    async updateCatalog(
        @UploadedFile() file,
        @Param('id_establishment') id_establishment: string,
        @Param('id_catalog') id_catalog: string,
        @Body() model: any): Promise<any> {
        try {
            if (file) {
                model.photo = file.filename;
                await deleteFile('files', model.lastphoto);
                const establishment = await this.service.updateCatalog(id_establishment, id_catalog, model);
                return new Result('Produto salvo com sucesso', true, establishment, null)

            } else {
                return new Result('Seu produto não contem imagem', false, [], null)
            }
        } catch (error) {
            throw new HttpException(new Result('Não foi possível atulizar o item', false, null, error), HttpStatus.NOT_FOUND);
        }
    }
    @Get(':id_establishment/points')
    @ApiOperation({
        summary: 'Mostra os pontos ativos do estabelecimento',
    })
    @ApiResponse({ status: HttpStatus.OK, description: '' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Dados  inválidos' })
    async getPoints(@Param('id_establishment') id_establishment: string): Promise<any> {
        try {
            const establishment = await this.service.getPoints(id_establishment);
            const { points } = establishment[0];
            const activePoints = points.filter(points => points.active === true);
            return new Result(null, true, activePoints, null)
        } catch (error) {
            return new HttpException(new Result(null, false, null, error), HttpStatus.NOT_FOUND);
        }
    }
    @Get(':id_establishment/catalog')
    @ApiOperation({
        summary: 'Traz o catálogo do estabelecimento',
    })
    @ApiResponse({ status: HttpStatus.OK, description: '' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: '' })
    @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: '' })
    async getCatalog(@Param('id_establishment') id_establishment: string): Promise<any> {
        try {
            const establishment = await this.service.getCatalog(id_establishment);
            return new Result(null, true, establishment, null)
        } catch (error) {
            return new HttpException(new Result(null, false, null, error), HttpStatus.NOT_FOUND);
        }
    }

    @Post(':id_establishment/delete/:id_point')
    @ApiOperation({
        summary: 'Exclusão de pontos do estabelecimento',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Ponto deletado com sucesso' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Dados  inválidos' })
    @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Não foi possível inserir o item no seu catalogo' })
    async softDelete(@Param('id_establishment') id_establishment: string,
        @Param('id_point') id_point: string): Promise<any> {
        try {
            const establishment = await this.service.softDeletePoint(id_establishment, id_point);
            return new Result(null, true, establishment, null)
        } catch (error) {
            return new HttpException(new Result(null, false, null, error), HttpStatus.NOT_FOUND);
        }
    }
    @Get(':id_establishment/settings')
    @ApiOperation({
        summary: 'Traz as configurações do estabelecimento',
    })
    @ApiResponse({ status: HttpStatus.OK, description: '' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Dados  inválidos' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Não foi possível trazer seus dados' })
    async getSettings(@Param('id_establishment') id_establishment: string): Promise<any> {
        try {
            const establishment = await this.service.getSettings(id_establishment);
            return new HttpException(new Result(null, true, establishment, null), HttpStatus.OK);
        } catch (error) {
            return new HttpException(new Result(null, false, null, error), HttpStatus.NOT_FOUND);
        }
    }
    @Put(':id_establishment/settings')
    @ApiOperation({
        summary: 'Atualiza as configurações do estabelecimento',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Dados atualizados com sucesso' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Dados  inválidos' })
    @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: '' })
    async updateSettings(@Param('id_establishment') id_establishment: string, @Body() model: any): Promise<any> {
        try {
            console.log(model)
            const establishment = await this.service.createEstablishmentSettings(id_establishment, model);
            return new HttpException(new Result('Dados atualizados com sucesso!', true, establishment, null), HttpStatus.OK)
        } catch (error) {
            return new HttpException(new Result('Houve um problema ao atualizar seus dados', false, null, error), HttpStatus.NOT_FOUND);
        }
    }
    @Get(':id_establishment/account')
    @ApiOperation({
        summary: 'Traz informações de da conta do estabelecimento',
    })
    @ApiResponse({ status: HttpStatus.OK, description: '' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Dados  inválidos' })
    @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: '' })
    async getAccountSettings(@Param('id_establishment') id_establishment: string): Promise<any> {
        try {

            const establishment = await this.service.getAccountSettings(id_establishment);
            return new Result(null, true, establishment, null)
        } catch (error) {
            return new HttpException(new Result(null, false, null, error), HttpStatus.NOT_FOUND);
        }
    }

    @Put(':id_establishment/account')
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: './files',
                filename: editFileName,
            }),
            fileFilter: imageFileFilter,
        }),
    )
    @ApiOperation({
        summary: 'Atualiza informações da conta do estabelecimento',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Dados atualizados com sucesso' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Dados  inválidos' })
    @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: '' })
    async updateEstablishmentAccount(
        @UploadedFile() file,
        @Param('id_establishment') id_establishment: string, @Body() model: EstablishmentAccount): Promise<any> {
        try {
            if (file) {
                const imageName = await this.service.getAccountSettings(id_establishment);
                await deleteFile('files', imageName.photo);
                const establishment = await this.service.UpdateAccountWithPhoto(id_establishment, model, file.filename);
                return new Result('Conta atualizada com sucesso!', true, establishment, null)

            } else {
                const establishment = await this.service.UpdateAccount(id_establishment, model);
                return new Result('Conta atualizada com sucesso!', true, establishment, null)
            }
        } catch (error) {
            console.log(error)
            throw new HttpException(new Result(null, false, null, error), HttpStatus.NOT_FOUND);
        }
    }
}

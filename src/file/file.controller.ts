import {
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Query,
	UploadedFiles,
	UseInterceptors
} from '@nestjs/common'
import { FileService } from './file.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { FilesInterceptor } from '@nestjs/platform-express'
import { readdir } from 'fs-extra'
import { path } from 'app-root-path'

@Controller('file')
export class FileController {
	constructor(private readonly fileService: FileService) {}

	@Post()
	@HttpCode(HttpStatus.OK)
	@Auth('admin')
	@UseInterceptors(FilesInterceptor('file'))
	async uploadFile(
		@UploadedFiles() files: Express.Multer.File[],
		@Query('folder') folder?: string
	) {
		return this.fileService.saveFile(files, folder)
	}
}

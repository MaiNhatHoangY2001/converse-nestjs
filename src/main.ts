import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as morgan from 'morgan';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get(ConfigService);
	const port = configService.get('port');

	app.use(morgan('dev'));

	app.useGlobalPipes(new ValidationPipe());

	const documentConfig = new DocumentBuilder()
		.addSecurity('bearer', {
			type: 'http',
			scheme: 'bearer',
		})
		.setTitle('Converse API')
		.setDescription('The converse API description')
		.setVersion('1.0')
		.build();
	const documentFactory = () => SwaggerModule.createDocument(app, documentConfig);
	SwaggerModule.setup('api', app, documentFactory);

	Logger.debug(configService.get('db'));

	await app.listen(port as string, () =>
		Logger.log(`Application running on http://localhost:${port}`),
	);
}
void bootstrap();

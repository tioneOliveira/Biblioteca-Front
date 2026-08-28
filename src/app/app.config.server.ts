import { mergeApplicationConfig, ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { HttpClientModule } from '@angular/common/http';

const serverConfig: ApplicationConfig = {
	providers: [
		provideServerRendering(withRoutes(serverRoutes)),
		importProvidersFrom(HttpClientModule),
	],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);

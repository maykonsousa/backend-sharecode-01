import { container } from 'tsyringe';
import { IDateProvider } from './IDateProvider';
import { LuxonDateProvider } from './implementations/LuxonDateProvider';

container.registerSingleton<IDateProvider>('DateProvider', LuxonDateProvider);

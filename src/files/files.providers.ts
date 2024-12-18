import { FILES_REPOSITORY } from '@/constants/sequelize';
import { Files } from './files.model';

export const filesProviders = [
  {
    provide: FILES_REPOSITORY,
    useValue: Files,
  },
];

import { FILES_REPOSITORY } from '@/common/constants/sequelize';
import { Files } from './files.model';

export const filesProviders = [
  {
    provide: FILES_REPOSITORY,
    useValue: Files,
  },
];

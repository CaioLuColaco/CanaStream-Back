import { SetMetadata } from '@nestjs/common';
import { STRING_ALLOW_UNAUTHORIZED_REQUESTS } from 'src/utils/constants';

export const AllowUnauthorizedRequest = () =>
  SetMetadata(STRING_ALLOW_UNAUTHORIZED_REQUESTS, true);

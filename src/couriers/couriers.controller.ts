import { Roles } from '@/auth/decorators/roles-auth.decorator';
import { ApiResponses } from '@/common/constants/swaggerResponses';
import { RolesGuard } from '@/common/guards/auth.guard';
import { UserRolesEnum } from '@/users/user.model';
import { UserService } from '@/users/user.service';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CouriersService } from './couriers.service';

@ApiTags('Работа с курьерами')
@Roles('courier')
@UseGuards(RolesGuard)
@Controller('courier')
export class CouriersController {
  constructor(
    private couriersService: CouriersService,
    private userService: UserService,
  ) {}

  @ApiResponse({
    status: 200,
    example: {
      id: 1,
      email: 'john.doe@example.com',
      phoneNumber: '+7 (999) 999-99-99',
      name: 'Иван',
      secondName: 'Иванов',
      lastName: 'Иванович',
      birthDate: '1990-01-01',
      isApproved: false,
    },
  })
  @ApiResponses.Unauthorized
  @ApiResponses.InvalidToken
  @Get('')
  async getCourier(@Req() request: Request) {
    const id = request.user.id;
    const user = await this.userService.findUser(
      'id',
      id,
      UserRolesEnum.COURIER,
      false,
    );

    const courier = await this.couriersService.findCourier(user.id);

    return { ...courier, ...user };
  }
}

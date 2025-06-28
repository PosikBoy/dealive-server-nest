import { USER_REPOSITORY } from "@/common/constants/sequelize";
import { Inject, Injectable } from "@nestjs/common";
import { UserCreateDto } from "./dtos/create-user.dto";
import { EditUserDto } from "./dtos/edit-user.dto";
import { UserWithoutSensitiveInfoDto } from "./dtos/user-without-sensitive-info.dto";
import { User, UserRolesEnum } from "./user.model";

interface WhereConditions<T> {
  [key: string]: T | { [operator: string]: T };
}

@Injectable()
export class UserService {
  constructor(@Inject(USER_REPOSITORY) private userRepository: typeof User) {}

  async findUser(
    field: "id" | "email" | "phoneNumber",
    data: string | number,
    role: UserRolesEnum = UserRolesEnum.CLIENT,
    includeSensitiveInfo: boolean = false
  ) {
    let whereCondition: WhereConditions<number | string | boolean>;

    if (field === "id") {
      whereCondition = { id: data, role };
    } else if (field === "email") {
      whereCondition = { email: data, role };
    } else if (field === "phoneNumber") {
      whereCondition = { phoneNumber: data, role };
    }

    const user = await this.userRepository.findOne({
      where: whereCondition,
    });

    if (!user) {
      return null;
    }

    if (includeSensitiveInfo) {
      return user.dataValues;
    }

    return new UserWithoutSensitiveInfoDto(user);
  }

  async editUser(editUserDto: EditUserDto, role: UserRolesEnum) {
    const user = await this.userRepository.findOne({
      where: {
        role: role,
        id: editUserDto.id,
      },
    });
    user.phoneNumber = editUserDto.phoneNumber;
    user.email = editUserDto.email;
    await user.save();
    return user;
  }

  async create(user: UserCreateDto) {
    const createdUser = await this.userRepository.create(user);
    return createdUser.dataValues;
  }
}

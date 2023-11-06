import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { User } from 'src/modules/users/entities/user.entity';

export class Client {
  @ApiProperty({ type: () => User })
  @Type(() => User)
  user: User;
  @ApiProperty()
  user_id: string;
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  phoneNumber: string;
  @ApiProperty()
  profileImage: string;
  @ApiProperty()
  created_at: Date;
  @ApiProperty()
  updated_at: Date;
}

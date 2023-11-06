import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Role } from '@prisma/client';

import { Client } from 'src/modules/clients/entities/client.entity';

export class User {
  @ApiProperty()
  id: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
  role: Role;
  @ApiProperty()
  created_at: Date;
  @ApiProperty()
  updated_at: Date;
  @ApiProperty({ type: () => Client })
  @Type(() => Client)
  client?: Client;
}

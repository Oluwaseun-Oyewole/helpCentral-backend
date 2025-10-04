import { ApiProperty } from '@nestjs/swagger';
import { Children } from '../schema/children.schema';

export class ChildrenResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  fullname: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  gender: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  state: string;

  @ApiProperty()
  image: string;

  @ApiProperty({ type: Date, required: false })
  lastLoginDate: Date;

  @ApiProperty()
  activatedAt: Date;

  constructor(user: Children) {
    this.id = user._id.toString();
    this.fullname = user.fullname;
    this.email = user.email;
    this.address = user.address;
    this.gender = user.gender;
    this.activatedAt = user.activatedAt;
    this.lastLoginDate = user.lastLoginDate;
  }
}

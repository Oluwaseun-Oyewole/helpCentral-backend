import { ApiProperty } from '@nestjs/swagger';
import { Sponsor } from '../schema/sponsor.schema';

export class SponsorResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  fullname: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ type: Date, required: false })
  lastLoginDate: Date;

  @ApiProperty()
  activatedAt: Date;

  constructor(user: Sponsor) {
    this.id = user._id.toString();
    this.fullname = user.fullname;
    this.email = user.email;
    this.activatedAt = user.activatedAt;
    this.lastLoginDate = user.lastLoginDate;
  }
}

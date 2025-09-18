import { ApiProperty } from '@nestjs/swagger';
import { allowedLanguages, People } from '../schema/people.schema';

export class PeopleResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  fullname: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  countryCode: number;

  @ApiProperty()
  gender: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  state: string;

  @ApiProperty()
  country: string;

  @ApiProperty()
  image: string;

  @ApiProperty()
  language: (typeof allowedLanguages)[number];

  @ApiProperty({ type: Date, required: false })
  lastLoginDate: Date;

  @ApiProperty()
  activatedAt: Date;

  // @ApiProperty({ type: Date })
  // createdAt?: Date;

  // @ApiProperty({ type: Date })
  // updatedAt?: Date;

  constructor(user: People) {
    this.id = user._id.toString();
    this.fullname = user.fullname;
    this.email = user.email;
    this.address = user.address;
    this.gender = user.gender;
    this.country = user.country;
    this.activatedAt = user.activatedAt;
    this.language = user.language;
    this.lastLoginDate = user.lastLoginDate;
  }
}

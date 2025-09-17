import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PeopleController } from './people.controller';
import { PeopleRepository } from './people.repository';
import { PeopleService } from './people.service';
import { People, PeopleSchema } from './schema/people.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: People.name, schema: PeopleSchema }]),
  ],
  controllers: [PeopleController],
  providers: [PeopleService, PeopleRepository],
  exports: [PeopleService],
})
export class PeopleModule {}

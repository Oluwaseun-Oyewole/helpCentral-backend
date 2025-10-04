import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChildrenController } from './children.controller';
import { ChildrenRepository } from './children.repository';
import { ChildrenService } from './children.service';
import { Children, ChildrenSchema } from './schema/children.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Children.name, schema: ChildrenSchema },
    ]),
  ],
  providers: [ChildrenService, ChildrenRepository],
  controllers: [ChildrenController],
  exports: [ChildrenService],
})
export class ChildrenModule {}

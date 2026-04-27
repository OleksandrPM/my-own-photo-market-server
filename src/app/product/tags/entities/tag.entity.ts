import { TagOrmEntity } from 'src/app/infrastructure/data/database/tags/tag.orm-entity';
import { TagResponseDto } from '../dto/tag-response.dto';
import { TagUiResponseDto } from '../dto/tag-ui-response.dto';

export interface TagProps {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TagUiProps = Pick<TagProps, 'id' | 'name'>;

export class Tag {
  private constructor(private readonly props: TagProps) {}

  static fromOrm(orm: TagOrmEntity): Tag {
    return new Tag({
      id: orm.id,
      name: orm.name,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  toJSON(): TagResponseDto {
    return { ...this.props };
  }

  toUi(): TagUiResponseDto {
    return {
      id: this.props.id,
      name: this.props.name,
    };
  }

  get id(): number {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}

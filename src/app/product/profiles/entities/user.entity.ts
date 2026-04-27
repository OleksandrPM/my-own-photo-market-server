import { UserRole } from '../user.types';

export type UserId = number;

export interface UserProps {
  id: UserId;
  email: string;
  username: string | null;
  role: UserRole;
  avatarKey: string | null;
  isVerified: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class UserEntity {
  private constructor(private readonly props: UserProps) {}

  static from(props: UserProps): UserEntity {
    // мінімальні інваріанти (можете розширити)
    if (!props.email) {
      throw new Error('User email is required');
    }

    return new UserEntity({ ...props });
  }

  // Getters
  get id(): UserId {
    return this.props.id;
  }

  get email(): string {
    return this.props.email;
  }

  get username(): string | null {
    return this.props.username;
  }

  get role(): UserRole {
    return this.props.role;
  }

  get avatarKey(): string | null {
    return this.props.avatarKey;
  }

  get isVerified(): boolean {
    return this.props.isVerified;
  }

  get deletedAt(): Date | null {
    return this.props.deletedAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  verify(): UserEntity {
    if (this.props.isVerified) return this;
    return new UserEntity({ ...this.props, isVerified: true });
  }

  changeUsername(username: string | null): UserEntity {
    return new UserEntity({ ...this.props, username });
  }

  toJSON(): UserProps {
    return { ...this.props };
  }
}

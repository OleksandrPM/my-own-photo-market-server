import { UserRole } from '../profile.types';

export interface ProfileProps {
  id: number;
  email: string;
  username: string | null;
  role: UserRole;
  isVerified: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class ProfileEntity {
  private constructor(private readonly props: ProfileProps) {}

  static from(props: ProfileProps): ProfileEntity {
    if (!props.email) {
      throw new Error('Profile email is required');
    }

    return new ProfileEntity({ ...props });
  }

  // Getters
  get id(): number {
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

  verify(): ProfileEntity {
    if (this.props.isVerified) return this;
    return new ProfileEntity({ ...this.props, isVerified: true });
  }

  changeUsername(username: string | null): ProfileEntity {
    return new ProfileEntity({ ...this.props, username });
  }

  toJSON(): ProfileProps {
    return { ...this.props };
  }
}

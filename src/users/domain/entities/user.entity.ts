import { Entity } from '@/shared/domain/entities/entity'

export type UserProps = {
  name: string
  email: string
  password: string
  createdAt?: Date
}
export class UserEntity extends Entity<UserProps> {
  constructor(
    public readonly props: UserProps,
    id?: string,
  ) {
    super(props, id)
    this.props.createdAt = this.props.createdAt ?? new Date()
  }

  getName(): string {
    return this.props.name
  }
  getEmail(): string {
    return this.props.email
  }
  getPassword(): string {
    return this.props.password
  }
  getCreatedAt(): Date {
    return this.props.createdAt
  }
}

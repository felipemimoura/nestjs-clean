export type UserProps = {
  name: string
  email: string
  password: string
  createdAt?: Date
}
export class UserEntity {
  constructor(public readonly props: UserProps) {
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

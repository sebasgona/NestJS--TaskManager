import { Repository, EntityRepository } from "typeorm";
import { User } from "./user.entity";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { ConflictException } from "@nestjs/common";

@EntityRepository(User)
export class UserRepository extends Repository<User>{
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto
    const exists = this.findOne({ username })

    if (!exists) {

    }

    const user: User = new User()
    user.username = username;
    user.password = password;
    try {
      await user.save()
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists')
      }
    }
  }
}


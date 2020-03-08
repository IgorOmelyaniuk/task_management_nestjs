import { Repository, EntityRepository } from "typeorm";
import { User } from './user.entity';
import { AuthCredDto } from "./dto/auth-cred.dto";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from 'bcryptjs';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredDto: AuthCredDto): Promise<void> {
    const { username, password } = authCredDto;
    const user = new User();

    user.username = username;
    user.salt = await bcrypt.genSalt();;
    user.password = await this.hashPassword(password, user.salt);

    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') { // duplicate username
        throw new ConflictException('Username already exists');
      }

      throw new InternalServerErrorException();
    }
  }

  async validateUserPassword(authCredDto: AuthCredDto): Promise<string> {
    const { username, password } = authCredDto;
    const user = await this.findOne({ username });

    if (user && await user.validatePassword(password)) {
      return user.username;
    }

    return null;
  } 

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
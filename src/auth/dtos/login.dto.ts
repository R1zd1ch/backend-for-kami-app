import { IsString, IsNotEmpty, ValidateIf } from 'class-validator';

export class LoginDto {
  @ValidateIf((o) => !o.username)
  @IsNotEmpty({ message: 'Email не должен быть пустым' })
  @IsString()
  email?: string;

  @ValidateIf((o) => !o.email)
  @IsNotEmpty({ message: 'Username не должен быть пустым' })
  @IsString()
  username?: string;

  @IsNotEmpty({ message: 'Пароль не должен быть пустым' })
  @IsString()
  password: string;
}

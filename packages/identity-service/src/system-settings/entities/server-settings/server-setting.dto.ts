import { ApiProperty } from '@nestjs/swagger';
import { IsUrl, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';

export class ServerSettingsDto {
  uuid?: string;

  @IsUrl()
  @ApiProperty({ required: true })
  appURL: string;

  @IsUrl()
  @ApiProperty({ required: true })
  authServerURL: string;

  @IsNotEmpty()
  @ApiProperty({ required: true })
  clientId: string;

  @IsNotEmpty()
  @ApiProperty({ required: true })
  clientSecret: string;

  @IsUrl({ allow_underscores: true }, { each: true })
  @ApiProperty()
  @IsOptional()
  callbackURLs: string[];

  @IsUUID()
  @IsOptional()
  @ApiProperty()
  cloudStorageSettings: string;
}

export class RazorPaySettingsDto {
  @IsOptional()
  @ApiProperty()
  razorPayKey: string;

  @IsOptional()
  @ApiProperty()
  razorPaySecret: string;

  @IsOptional()
  @IsUrl()
  @ApiProperty()
  razorPayURL: string;
}

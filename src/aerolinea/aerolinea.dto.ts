/* eslint-disable prettier/prettier */
import {IsDate, IsNotEmpty, IsString} from 'class-validator';
export class AerolineaDto {

 @IsString()
 @IsNotEmpty()
 readonly nombre: string;
 
 @IsString()
 @IsNotEmpty()
 readonly descripcion: string;
 
 @IsDate()
 @IsNotEmpty()
 readonly fecha: Date;
 
 @IsString()
 @IsNotEmpty()
 readonly paginaWeb: string;
}
import httpStatus from 'http-status';
import { HttpException } from '@exceptions/HttpException';
import { UserEntity } from '@/entities/Users.entity';
import { VehicleDto } from './../dtos/vehicle.dto';
import { VehicleEntity } from './../entities/Vehicle.entity';
import { dbConnection } from '@/databases';

export class VehicleService {
  private vehicleRepository = dbConnection.getRepository(VehicleEntity);
  private userRepository = dbConnection.getRepository(UserEntity);

  public async vehicleGetIn(requestBody: VehicleDto) {
    const { id, type, username } = requestBody;

    const findUser = this.userRepository.find({ where: { email: username } });
    if (!findUser) throw new HttpException(httpStatus.CONFLICT, `${username} not found`);
    const vehicleValue = new VehicleEntity(id.twoFirstDigits, id.vehicleColor, id.block, id.slotId, id.fourLastDigits, type);
    const saveValue = await this.vehicleRepository.save(vehicleValue);
    return saveValue;
  }
}

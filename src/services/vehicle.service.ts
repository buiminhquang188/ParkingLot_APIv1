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
    if (type === 'OUT') throw new HttpException(httpStatus.CONFLICT, 'Invalid type');

    const findUser = await this.userRepository.findOne({ where: { email: username } });
    if (!findUser) throw new HttpException(httpStatus.CONFLICT, `${username} not found`);

    const findVehicle = await this.vehicleRepository.findOne({ where: { licensePlates: id.licensePlates, isIn: 'IN' } });
    if (findVehicle) throw new HttpException(httpStatus.CONFLICT, `${id.licensePlates} is available in park`);

    const vehicleValue = new VehicleEntity(id.twoFirstDigits, id.vehicleColor, id.block, id.slotId, id.fourLastDigits, type, id.licensePlates);
    const saveValue = await this.vehicleRepository.save(vehicleValue);
    return saveValue;
  }

  public async updateVehicleLocation(requestBody: VehicleDto) {
    const { id, type, username } = requestBody;
    if (type === 'OUT') throw new HttpException(httpStatus.CONFLICT, 'Vehicle is out of the parking lot');

    const findUser = this.userRepository.findOne({ where: { email: username } });
    if (!findUser) throw new HttpException(httpStatus.CONFLICT, `${username} not found`);

    const findLocation = await this.vehicleRepository.findOne({ where: { block: id.block, slotId: id.slotId, isIn: 'IN' } });
    if (findLocation) throw new HttpException(httpStatus.CONFLICT, `Block: ${findLocation.block} and SlotId: ${findLocation.slotId} has occupied`);

    const findVehicle = await this.vehicleRepository.findOne({ where: { licensePlates: id.licensePlates, isIn: 'IN' } });
    if (!findVehicle) throw new HttpException(httpStatus.CONFLICT, `Vehicle has license ${findVehicle.licensePlates} doesn't exist in parking lot`);

    await this.vehicleRepository.update({ licensePlates: findVehicle.licensePlates }, { block: id.block, slotId: id.slotId });

    const findNewSlot = await this.vehicleRepository.findOne({ where: { licensePlates: id.licensePlates, isIn: 'IN' } });

    return findNewSlot;
  }

  // public async vehicleGetOut(requestBody: VehicleDto) {}
}

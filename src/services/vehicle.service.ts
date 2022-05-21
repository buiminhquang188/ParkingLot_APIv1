import { User } from './../interfaces/users.interface';
import httpStatus from 'http-status';
import { HttpException } from '@exceptions/HttpException';
import { UserEntity } from '@/entities/Users.entity';
import { VehicleDto, ParkingVehicleDto } from './../dtos/vehicle.dto';
import { VehicleEntity } from './../entities/Vehicle.entity';
import { dbConnection } from '@/databases';
import { ParkingStatus } from '@/utils/enums';
export class VehicleService {
  private vehicleRepository = dbConnection.getRepository(VehicleEntity);
  private userRepository = dbConnection.getRepository(UserEntity);

  public async vehicleGetIn(requestBody: VehicleDto, currentUser: User) {
    const { id, type } = requestBody;
    const { email } = currentUser;

    if (type === ParkingStatus.OUT) throw new HttpException(httpStatus.BAD_REQUEST, 'Invalid type');

    const findVehicle = await this.vehicleRepository.findOne({ where: { licensePlates: id.licensePlates, isIn: ParkingStatus.IN } });
    if (findVehicle) throw new HttpException(httpStatus.CONFLICT, `${id.licensePlates} is available in park`);

    const vehicleValue = new VehicleEntity(id.twoFirstDigits, id.vehicleColor, id.fourLastDigits, type, id.licensePlates, email);
    const saveValue = await this.vehicleRepository.save(vehicleValue);
    return saveValue;
  }

  public async updateVehicleLocation(requestBody: ParkingVehicleDto) {
    const { licensePlates, blockId, slotId, type } = requestBody;
    if (type !== ParkingStatus.PARKING) throw new HttpException(httpStatus.BAD_REQUEST, 'Invalid type');

    const findLocation = await this.vehicleRepository.findOne({ where: { block: blockId, slotId: slotId, isIn: ParkingStatus.PARKING } });
    if (findLocation) throw new HttpException(httpStatus.CONFLICT, `Block: ${findLocation.block} and SlotId: ${findLocation.slotId} has occupied`);

    const findVehicle = await this.vehicleRepository.findOne({ where: { licensePlates, isIn: ParkingStatus.IN } });
    if (!findVehicle) throw new HttpException(httpStatus.CONFLICT, `Vehicle has license ${findVehicle.licensePlates} doesn't exist in parking lot`);

    await this.vehicleRepository.update({ licensePlates: findVehicle.licensePlates }, { block: blockId, slotId, isIn: type });

    const findNewSlot = await this.vehicleRepository.findOne({ where: { licensePlates: licensePlates, isIn: type } });

    return findNewSlot;
  }

  public async vehicleGetOut(requestBody: ParkingVehicleDto) {
    const { licensePlates, blockId, slotId, type } = requestBody;
    if (type !== ParkingStatus.OUT) throw new HttpException(httpStatus.BAD_REQUEST, 'Invalid type');

    const findLocation = await this.vehicleRepository.findOne({
      where: { licensePlates, block: blockId, slotId, isIn: ParkingStatus.PARKING || ParkingStatus.IN },
    });
    if (!findLocation)
      throw new HttpException(httpStatus.CONFLICT, `${licensePlates}, ${blockId} or ${slotId} doesn't exist in parking lot, please check again`);

    await this.vehicleRepository.update(
      { licensePlates: findLocation.licensePlates },
      { block: null, slotId: null, cameraId: null, isIn: ParkingStatus.OUT },
    );

    const findVehicleStatus = await this.vehicleRepository.findOne({ where: { licensePlates: findLocation.licensePlates } });
    return findVehicleStatus;
  }
  // public async vehicleGetOut(requestBody: VehicleDto) {}
}

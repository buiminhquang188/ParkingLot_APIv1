import { User } from './../interfaces/users.interface';
import httpStatus from 'http-status';
import { HttpException } from '@exceptions/HttpException';
import { UserEntity } from '@/entities/Users.entity';
import { VehicleDto, ParkingVehicleDto } from './../dtos/vehicle.dto';
import { VehicleEntity } from './../entities/Vehicle.entity';
import { dbConnection } from '@/databases';
import { ParkingStatus } from '@/utils/enums';
import { LocationEntity } from '@/entities/Location.entity';
export class VehicleService {
  private vehicleRepository = dbConnection.getRepository(VehicleEntity);
  private userRepository = dbConnection.getRepository(UserEntity);
  private locationRepository = dbConnection.getRepository(LocationEntity);

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
    const { licensePlates, macAddress, type } = requestBody;
    if (type !== ParkingStatus.PARKING) throw new HttpException(httpStatus.BAD_REQUEST, 'Invalid type');

    const findMacAddress = await this.locationRepository.findOne({ where: { macAddress } });
    if (!findMacAddress) throw new HttpException(httpStatus.CONFLICT, `${macAddress} is invalid`);

    const findLocation = await this.vehicleRepository.findOne({
      where: { cameraId: findMacAddress.macAddress, block: findMacAddress.blockId, slotId: findMacAddress.slotId, isIn: ParkingStatus.PARKING },
    });
    if (findLocation) throw new HttpException(httpStatus.CONFLICT, `Block: ${findLocation.block} and SlotId: ${findLocation.slotId} has occupied`);

    const findVehicle = await this.vehicleRepository.findOne({ where: { licensePlates, isIn: ParkingStatus.IN } });
    if (!findVehicle) throw new HttpException(httpStatus.CONFLICT, `Vehicle has license ${licensePlates} doesn't exist in parking lot`);

    await this.vehicleRepository.update(
      { licensePlates: findVehicle.licensePlates },
      { cameraId: findMacAddress.macAddress, block: findMacAddress.blockId, slotId: findMacAddress.slotId, isIn: ParkingStatus.PARKING },
    );

    const findNewSlot = await this.vehicleRepository.findOne({ where: { licensePlates: licensePlates, isIn: type } });

    return findNewSlot;
  }

  public async vehicleGetOut(requestBody: ParkingVehicleDto) {
    const { licensePlates, macAddress, type } = requestBody;
    if (type !== ParkingStatus.OUT) throw new HttpException(httpStatus.BAD_REQUEST, 'Invalid type');

    const findMacAddress = await this.locationRepository.findOne({ where: { macAddress } });
    if (!findMacAddress) throw new HttpException(httpStatus.CONFLICT, `${macAddress} is invalid`);

    const findLocation = await this.vehicleRepository.findOne({
      where: { licensePlates, block: findMacAddress.blockId, slotId: findMacAddress.slotId, isIn: ParkingStatus.PARKING || ParkingStatus.IN },
    });
    if (!findLocation) throw new HttpException(httpStatus.CONFLICT, `${licensePlates} doesn't exist in parking lot, please check again`);

    await this.vehicleRepository.update(
      { licensePlates: findLocation.licensePlates },
      { cameraId: null, block: null, slotId: null, isIn: ParkingStatus.OUT },
    );

    const findVehicleStatus = await this.vehicleRepository.findOne({ where: { licensePlates: findLocation.licensePlates } });
    return findVehicleStatus;
  }
}

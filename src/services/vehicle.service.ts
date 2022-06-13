import { User } from './../interfaces/users.interface';
import httpStatus from 'http-status';
import { HttpException } from '@exceptions/HttpException';
import { UserEntity } from '@/entities/Users.entity';
import { VehicleDto, ParkingVehicleDto, GetOutVehicleDto } from './../dtos/vehicle.dto';
import { VehicleEntity } from './../entities/Vehicle.entity';
import { dbConnection } from '@/databases';
import { ParkingStatus } from '@/utils/enums';
import { LocationEntity } from '@/entities/Location.entity';
import { In, IsNull, Not } from 'typeorm';
export class VehicleService {
  private vehicleRepository = dbConnection.getRepository(VehicleEntity);
  private userRepository = dbConnection.getRepository(UserEntity);
  private locationRepository = dbConnection.getRepository(LocationEntity);

  public async vehicleGetIn(requestBody: VehicleDto, currentUser: User) {
    const { id, type } = requestBody;
    const { email } = currentUser;

    if (type !== ParkingStatus.IN) throw new HttpException(httpStatus.BAD_REQUEST, 'Invalid type');

    const findUserInParkingLot = await this.vehicleRepository.findOne({
      where: { username: email, isIn: In([ParkingStatus.IN, ParkingStatus.PARKING]) },
    });
    if (findUserInParkingLot) throw new HttpException(httpStatus.CONFLICT, `${email} already in parking lot`);

    const findVehicle = await this.vehicleRepository.findOne({
      where: { licensePlates: id.licensePlates, isIn: In([ParkingStatus.IN, ParkingStatus.PARKING]) },
    });
    if (findVehicle) throw new HttpException(httpStatus.CONFLICT, `${id.licensePlates} is available in park`);

    const findSlotEmpty = await this.locationRepository.find({ where: { isOccupied: 'N', isUse: 'Y' }, select: ['blockId', 'slotId', 'isOccupied'] });
    if (findSlotEmpty?.length === 0) throw new HttpException(httpStatus.BAD_REQUEST, 'All slot is full');
    const location = findSlotEmpty.map((item) => ({ slot: item.blockId + item.slotId }));

    const vehicleValue = new VehicleEntity(id.twoFirstDigits, id.vehicleColor, id.fourLastDigits, type, id.licensePlates, email);
    await this.vehicleRepository.insert(vehicleValue);

    const insertValue = await this.vehicleRepository.findOne({
      where: {
        username: vehicleValue.username,
        twoDigits: vehicleValue.twoDigits,
        otherDigits: vehicleValue.otherDigits,
        isIn: vehicleValue.isIn,
        licensePlates: vehicleValue.licensePlates,
      },
    });

    return { insertValue, emptySlot: location };
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

  public async vehicleGetOut(requestBody: GetOutVehicleDto) {
    const { licensePlates, location, type } = requestBody;
    if (type !== ParkingStatus.OUT) throw new HttpException(httpStatus.BAD_REQUEST, 'Invalid type');
    const splitLocation = location.split(/([0-9]+)/).filter(Boolean);

    const findLocation = await this.vehicleRepository.findOne({
      where: { licensePlates, block: splitLocation[0], slotId: +splitLocation[1], isIn: In([ParkingStatus.PARKING, ParkingStatus.IN]) },
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

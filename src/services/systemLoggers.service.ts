import { SECRET_KEY } from '@config';
import { SystemLoggersDto } from '@/dtos/systemLoggers.dto';
import { SysLogEntity } from '@/entities/SysLog.entity';
import { UserEntity } from '@/entities/Users.entity';
import { DataStoredInToken } from '@/interfaces/auth.interface';
import { LogMorgan } from '@/interfaces/logMorgan.interface';
import { PaginationAwareObject } from '@/utils/pagination/helper/pagination';
import DeviceDetector from 'device-detector-js';
import jwt from 'jsonwebtoken';
import { Brackets, getRepository } from 'typeorm';
class SysLogService {
  private _sysLog = SysLogEntity;
  private deviceDetector = new DeviceDetector();

  /**
   * TODO: Create a new system log
   * @param request
   */
  public async create(request: LogMorgan) {
    const sysLogReponsitory = getRepository(this._sysLog);
    let currentUser = '';
    if (request.token === '-') {
      currentUser = request.reqBody.username;
    } else {
      try {
        const token = request.token?.split('Bearer ')[1] || null;
        const secretKey: string = SECRET_KEY;
        const verificationResponse = jwt.verify(token, secretKey) as DataStoredInToken;
        const userId = verificationResponse.id;
        const userRepository = getRepository(UserEntity);
        const findUser: UserEntity = await userRepository.findOne(userId);
        currentUser = findUser.username;
      } catch {}
    }
    const device = this.deviceDetector.parse(request.userAgent);
    let saveDevice = '';
    if (device.os?.name) {
      saveDevice = `${device.client.name}/${device.client.version} [${device.os.name}]`;
    } else {
      saveDevice = `${device.client.name}/${device.client.version}`;
    }
    const sysLog: SysLogEntity = new SysLogEntity(
      saveDevice,
      request.method,
      request.url,
      parseInt(request.status),
      parseFloat(request.totalTime),
      parseFloat(request.responseTime),
      currentUser,
      request.ip,
    );
    await sysLogReponsitory.save(sysLog);
  }

  /**
   * TODO: Get list system log
   * @param searchRequest
   */
  public async getSysLog(searchRequest: SystemLoggersDto): Promise<PaginationAwareObject> {
    const logRepository = getRepository(this._sysLog);
    const result = await logRepository
      .createQueryBuilder('SysLogEntity')
      .where(sub => {
        if (searchRequest.method) {
          sub.where('SysLogEntity.method IS NULL').orWhere('UPPER(SysLogEntity.method) LIKE UPPER(:method)', { method: `%${searchRequest.method}%` });
        }
      })
      .andWhere(
        new Brackets(sub => {
          if (searchRequest.status) {
            sub.where('SysLogEntity.status IS NULL').orWhere('SysLogEntity.status LIKE :status', { status: `%${searchRequest.status}%` });
          }
        }),
      )
      .andWhere(
        new Brackets(sub => {
          if (searchRequest.startTime && searchRequest.endTime) {
            sub.where('SysLogEntity.createdAt IS NULL').orWhere('SysLogEntity.createdAt BETWEEN :startDate AND :endDate', {
              startDate: `${new Date(searchRequest.startTime).toISOString()}`,
              endDate: `${new Date(searchRequest.endTime).toISOString()}`,
            });
          }
        }),
      )
      .paginate();
    return result;
  }

  /**
   * TODO: Truncate systemLog table
   */
  public async delectionSysLog(): Promise<void> {
    const logRepository = getRepository(this._sysLog);
    return await logRepository.clear();
  }
}

export default SysLogService;

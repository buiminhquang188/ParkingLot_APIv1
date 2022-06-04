import { User } from './../interfaces/users.interface';
import { VehicleDto, ParkingVehicleDto } from './../dtos/vehicle.dto';
import { ContentType, Controller, Post, Body, Patch, CurrentUser, Authorized } from 'routing-controllers';
import { VehicleService } from './../services/vehicle.service';
import { OpenAPI } from 'routing-controllers-openapi';
import { ParkingStatus } from '@/utils/enums';

@Controller()
@OpenAPI({
  security: [{ BearerAuth: [] }],
})
export class VehicleController {
  private vehicleService = new VehicleService();

  @Post('/vehicle/get-in')
  @OpenAPI({
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/VehicleDto',
          },
        },
      },
    },
  })
  @Authorized()
  @ContentType('application/json')
  public async vehicleGetIn(@Body() requestBody: VehicleDto, @CurrentUser() currentUser: User) {
    return await this.vehicleService.vehicleGetIn(requestBody, currentUser);
  }

  @Patch('/vehicle/parking')
  @OpenAPI({
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/ParkingVehicleDto',
          },
          // example: {
          //   type: ParkingStatus.IN,
          //   licensePlates: 'string',
          //   blockId: 'string',
          //   slotId: 'string',
          // },
        },
      },
    },
  })
  @Authorized()
  @ContentType('application/json')
  public async vehicleParking(@Body() requestBody: ParkingVehicleDto) {
    return await this.vehicleService.updateVehicleLocation(requestBody);
  }

  @Patch('/vehicle/get-out')
  @OpenAPI({
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/ParkingVehicleDto',
          },
          example: {
            type: ParkingStatus.PARKING,
            licensePlates: 'string',
            blockId: 'string',
            slotId: 'string',
          },
        },
      },
    },
  })
  @Authorized()
  @ContentType('application/json')
  public async vehicleGetOut(@Body() requestBody: ParkingVehicleDto) {
    return await this.vehicleService.vehicleGetOut(requestBody);
  }
}

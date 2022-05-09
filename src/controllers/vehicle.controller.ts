import { VehicleDto } from './../dtos/vehicle.dto';
import { ContentType, Controller, Post, Body } from 'routing-controllers';
import { VehicleService } from './../services/vehicle.service';
import { OpenAPI } from 'routing-controllers-openapi';

@Controller()
export class VehicleController {
  private vehicleService = new VehicleService();

  @Post('/vehicle/getIn')
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
  @ContentType('application/json')
  public async vehicleGetIn(@Body() requestBody: VehicleDto) {
    return await this.vehicleService.vehicleGetIn(requestBody);
  }
}

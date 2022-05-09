import { MenuEntity } from './../entities/Menu.entity';
import { UserEntity } from '@/entities/Users.entity';
import { dbConnection } from '@databases';
class MenuService {
  private userRepository = dbConnection.getRepository(UserEntity);
  private menuRepository = dbConnection.getRepository(MenuEntity);
}

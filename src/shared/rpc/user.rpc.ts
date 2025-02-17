import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PublicUser } from '../data-model';
import { IPublicUserRpc } from '../interface';

@Injectable()
export class UserRPCClient implements IPublicUserRpc {
  constructor(private readonly userServiceUrl: string) {}

  async findById(id: string): Promise<PublicUser | null> {
    try {
      const { data } = await axios.get(`${this.userServiceUrl}/rpc/users/${id}`);
      const user = data.data;
      return {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
      } as PublicUser;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return null;
    }
  }

  async findByIds(ids: Array<string>): Promise<Array<PublicUser>> {
    const { data } = await axios.post(`${this.userServiceUrl}/rpc/users/list-by-ids`, { ids });

    const users: Array<PublicUser> = data.data.map((user: any) => {
      return {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      } as PublicUser;
    });

    return users;
  }
}

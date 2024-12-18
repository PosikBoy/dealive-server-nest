import { Client } from '@/clients/clients.model';

export class ClientWithoutSensitiveInfo {
  isEmailConfirmed: boolean;
  isNumberConfirmed: boolean;
  name: string;
  constructor(client: Client) {
    this.name = client.name || '';
    this.isEmailConfirmed = client.isEmailConfirmed;
    this.isNumberConfirmed = client.isNumberConfirmed;
  }
}

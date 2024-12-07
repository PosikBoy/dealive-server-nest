import { Client } from '@/clients/clients.model';

export class ClientWithoutSensitiveInfo {
  id: number;
  email: string;
  phoneNumber: string;
  isConfirmed: boolean;
  name: string;
  constructor(client: Client) {
    this.id = client.id;
    this.email = client.email;
    this.name = client.name || '';
    this.phoneNumber = client.phoneNumber || '';
    this.isConfirmed = client.isConfirmed;
  }
}

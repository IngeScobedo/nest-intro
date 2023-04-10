import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Pdf2imgService } from './pdf2img.service';
import { CreatePdf2imgDto } from './dto/create-pdf2img.dto';
import { UpdatePdf2imgDto } from './dto/update-pdf2img.dto';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  namespace: '/pdf2img',
})
export class Pdf2imgGateway implements OnGatewayInit {
  @WebSocketServer() wss: Server;

  private logger: Logger = new Logger('Pdf2imgGateway');

  constructor(private readonly pdf2imgService: Pdf2imgService) {}

  afterInit(server: any) {
    this.logger.log('Initialized');
  }

  @SubscribeMessage('createPdf2img')
  create(client: Socket, room: string) {
    console.log('-----PDF2IMG-----');
    client.emit('hola', room);
  }

  @SubscribeMessage('findAllPdf2img')
  findAll() {
    return this.pdf2imgService.findAll();
  }

  @SubscribeMessage('findOnePdf2img')
  findOne(@MessageBody() id: number) {
    return this.pdf2imgService.findOne(id);
  }

  @SubscribeMessage('updatePdf2img')
  update(@MessageBody() updatePdf2imgDto: UpdatePdf2imgDto) {
    return this.pdf2imgService.update(updatePdf2imgDto.id, updatePdf2imgDto);
  }

  @SubscribeMessage('removePdf2img')
  remove(@MessageBody() id: number) {
    return this.pdf2imgService.remove(id);
  }
}

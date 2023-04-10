import type { BrowserContext } from 'playwright';
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
import { InjectContext } from 'nestjs-playwright';

@WebSocketGateway({
  namespace: '/pdf2img',
})
export class Pdf2imgGateway implements OnGatewayInit {
  @WebSocketServer() wss: Server;

  private logger: Logger = new Logger('Pdf2imgGateway');

  constructor(
    private readonly pdf2imgService: Pdf2imgService,
    @InjectContext() private readonly browserContext: BrowserContext,
  ) {}

  afterInit(server: any) {
    this.logger.log('Initialized');
  }

  @SubscribeMessage('pdf2img')
  pdf2img(client: Socket, data: CreatePdf2imgDto) {
    console.log('-----PDF2IMG-----', { data });
    client.join(data.room);
    client.emit('extract-qr', { files: data.files });

    this.wss.to(data.room).emit('received-files', 'RECIBIDOS');
  }

  @SubscribeMessage('extract-qr')
  findAll(client: Socket, images: { files: FileList }) {
    console.log('EXTRACT QR', images);
    // return this.pdf2imgService.findAll();
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

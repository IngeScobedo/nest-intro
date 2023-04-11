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
  async pdf2img(client: Socket, data: CreatePdf2imgDto) {
    client.join(data.room);

    // Convert pdf to image and validate if isConverted is true
    // ! image needs rename with a hash
    const { isConverted } = await this.pdf2imgService.pdf2img(data.file);
    if (!isConverted) {
      this.wss
        .to(data.room)
        .emit('error-processing', 'Ocurrio un problema (ERRCODE: PDI001)'); // ! Documentar errors de codigo
      return;
    }

    // extract url of qrcode
    const { error, qrCodeText } = await this.pdf2imgService.extractQrLink();
    if (error) {
      this.wss
        .to(data.room)
        .emit('error-processing', 'Ocurrio un problema (ERRCODE: PDI002)'); // ! Documentar errors de codigo
      return;
    }

    // Get informacion of user from SAT
    const user = await this.pdf2imgService.getUserInfo(qrCodeText);
    console.log('INFORMACION DEL USUARIO', user);
    if (!user) {
      this.wss
        .to(data.room)
        .emit('error-processing', 'Ocurrio un problema (ERRCODE: PDI003)'); // ! Documentar errors de codigo
      return;
    }

    this.wss.to(data.room).emit('finishpdf2img', user);
  }

  @SubscribeMessage('getInfo')
  findAll(client: Socket, link: string) {
    console.log('EXTRACT INFORMATION OF SAT', link);
    // return this.pdf2imgService.findAll();
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

import {
  Controller,
  Get,
  Param,
  UseGuards,
  Req,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CertificatesService } from './certificates.service';
import type { Response } from 'express';

@Controller('certificates')
@UseGuards(JwtAuthGuard)
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Get('course/:courseId')
  async getCertificate(@Param('courseId') courseId: string, @Req() req: any) {
    return this.certificatesService.getCertificate(courseId, req.user.userId);
  }

  @Get('course/:courseId/download')
  async downloadCertificate(
    @Param('courseId') courseId: string,
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { buffer, filename, mimeType } = await this.certificatesService.downloadCertificate(
      courseId,
      req.user.userId,
    );

    res.set({
      'Content-Type': mimeType,
      'Content-Disposition': `attachment; filename="${filename}"`,
    });

    return new StreamableFile(buffer);
  }
}

import {
  Controller,
  Get,
  Param,
  UseGuards,
  Req,
  Res,
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
    return this.certificatesService.getCertificate(courseId, req.user.id);
  }

  @Get('course/:courseId/download')
  async downloadCertificate(
    @Param('courseId') courseId: string,
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { html, filename, mimeType } = await this.certificatesService.downloadCertificate(
      courseId,
      req.user.id,
    );

    res.set({
      'Content-Type': mimeType,
      'Content-Disposition': `inline; filename="${filename}"`,
    });

    return html;
  }
}

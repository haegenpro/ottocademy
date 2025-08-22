import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as puppeteer from 'puppeteer';

@Injectable()
export class CertificatesService {
  constructor(private readonly prisma: PrismaService) {}

  async getCertificate(courseId: string, userId: string) {
    // Check if user has purchased the course
    const userCourse = await this.prisma.userCourse.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      include: {
        course: {
          include: {
            modules: true,
          },
        },
      },
    });

    if (!userCourse) {
      throw new BadRequestException('Course not purchased');
    }

    // Get all module completions for this user and course
    const moduleCompletions = await this.prisma.moduleCompletion.findMany({
      where: {
        userId,
        module: {
          courseId,
        },
      },
    });

    // Calculate completion percentage
    const totalModules = userCourse.course.modules.length;
    const completedModules = moduleCompletions.filter(completion => completion.isCompleted).length;
    const completionPercentage = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;

    if (completionPercentage < 100) {
      throw new BadRequestException('Course not completed yet');
    }

    // Check if certificate already exists
    let certificate = await this.prisma.certificate.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      include: {
        course: true,
        user: true,
      },
    });

    // If not exists, create it
    if (!certificate) {
      certificate = await this.createCertificate(courseId, userId);
    }

    return certificate;
  }

  async downloadCertificate(courseId: string, userId: string) {
    const certificate = await this.getCertificate(courseId, userId);
    
    // Generate PDF if not exists or regenerate
    const pdfBuffer = await this.generateCertificatePDF(certificate);
    
    return {
      buffer: pdfBuffer,
      filename: `certificate-${courseId}-${userId}.pdf`,
      mimeType: 'application/pdf',
    };
  }

  private async createCertificate(courseId: string, userId: string) {
    const certificate = await this.prisma.certificate.create({
      data: {
        courseId,
        userId,
        finishDate: new Date(),
      },
      include: {
        course: true,
        user: true,
      },
    });

    return certificate;
  }

  private async generateCertificatePDF(certificate: any): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      
      // Set page size to A4 landscape
      await page.setViewport({ width: 1123, height: 794 });
      
      const html = this.generateCertificateHTML(certificate);
      
      await page.setContent(html, { waitUntil: 'networkidle0' });
      
      const pdf = await page.pdf({
        format: 'A4',
        landscape: true,
        printBackground: true,
        margin: {
          top: '20px',
          bottom: '20px',
          left: '20px',
          right: '20px',
        },
      });

      return Buffer.from(pdf);
    } finally {
      await browser.close();
    }
  }

  private generateCertificateHTML(certificate: any): string {
    const issuedDate = new Date(certificate.finishDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: 'Georgia', serif;
            margin: 0;
            padding: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
          }
          .certificate {
            background: white;
            width: 800px;
            height: 600px;
            padding: 60px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            border: 8px solid #gold;
            border-image: linear-gradient(45deg, #FFD700, #FFA500, #FF6347) 1;
            text-align: center;
            position: relative;
          }
          .certificate::before {
            content: '';
            position: absolute;
            top: 20px;
            left: 20px;
            right: 20px;
            bottom: 20px;
            border: 2px solid #ddd;
            pointer-events: none;
          }
          .header {
            margin-bottom: 40px;
          }
          .logo {
            font-size: 48px;
            margin-bottom: 10px;
          }
          .title {
            font-size: 42px;
            color: #2c3e50;
            margin-bottom: 20px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 2px;
          }
          .subtitle {
            font-size: 18px;
            color: #7f8c8d;
            margin-bottom: 40px;
          }
          .recipient {
            font-size: 32px;
            color: #e74c3c;
            margin-bottom: 30px;
            font-weight: bold;
          }
          .course {
            font-size: 24px;
            color: #2c3e50;
            margin-bottom: 40px;
            font-style: italic;
          }
          .completion-text {
            font-size: 16px;
            color: #7f8c8d;
            margin-bottom: 40px;
            line-height: 1.5;
          }
          .signature-section {
            display: flex;
            justify-content: space-between;
            margin-top: 60px;
          }
          .signature {
            text-align: center;
            flex: 1;
          }
          .signature-line {
            border-top: 2px solid #34495e;
            width: 200px;
            margin: 0 auto 10px;
          }
          .date {
            font-size: 14px;
            color: #7f8c8d;
          }
          .seal {
            position: absolute;
            bottom: 40px;
            right: 40px;
            width: 80px;
            height: 80px;
            background: radial-gradient(circle, #FFD700, #FFA500);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            color: white;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="header">
            <div class="logo">🍌</div>
            <div class="title">Certificate of Completion</div>
            <div class="subtitle">This is to certify that</div>
          </div>
          
          <div class="recipient">
            ${certificate.user.firstName} ${certificate.user.lastName}
          </div>
          
          <div class="completion-text">
            has successfully completed the course
          </div>
          
          <div class="course">
            "${certificate.course.title}"
          </div>
          
          <div class="completion-text">
            demonstrating dedication to professional development and mastery of the course curriculum.
          </div>
          
          <div class="signature-section">
            <div class="signature">
              <div class="signature-line"></div>
              <div>Grocademy</div>
              <div class="date">Platform</div>
            </div>
            <div class="signature">
              <div class="signature-line"></div>
              <div>Date Issued</div>
              <div class="date">${issuedDate}</div>
            </div>
          </div>
          
          <div class="seal">
            🏆
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

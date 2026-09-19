// import puppeteer, { Browser } from 'puppeteer';
// import QRCode from 'qrcode';

// export interface TicketPdfData {
//   movieTitle: string;
//   movieAgeRating: string;
//   movieDuration: number;
//   roomName: string;
//   roomFormat: string;
//   locationName: string;
//   sessionDate: Date;
//   sessionTime: string;
//   ticketCode: string;
//   qrToken: string;
//   seatRow: string;
//   seatNumber: number;
//   seatType: string;
//   price: number;
//   email?: string;
//   whatsapp?: string;
//   paymentMethod: string;
// }

// export class TicketPdfGenerator {
//   /**
//    * Gera QR code como URL de dados (data URI)
//    */
//   private async generateQrDataUri(payload: string): Promise<string> {
//     try {
//       return await QRCode.toDataURL(payload, {
//         errorCorrectionLevel: 'M',
//         type: 'image/png',
//         width: 200,
//         margin: 1,
//         color: {
//           dark: '#000000',
//           light: '#FFFFFF',
//         },
//       });
//     } catch (error) {
//       console.error('Erro ao gerar QR code:', error);
//       throw new Error('Falha na geração do QR code');
//     }
//   }

//   /**
//    * Gera o HTML individual ou agrupado dos bilhetes
//    */
//   private async generateTicketHtml(
//     ticketData: TicketPdfData,
//     qrDataUri: string,
//     index: number,
//     total: number
//   ): Promise<string> {
//     const formattedDate = new Intl.DateTimeFormat('pt-PT', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric',
//     }).format(new Date(ticketData.sessionDate));

//     const formatPrice = (val: number): string => {
//       return new Intl.NumberFormat('pt-AO', {
//         style: 'currency',
//         currency: 'AOA',
//         minimumFractionDigits: 0,
//       }).format(val);
//     };

//     const seatLabel = `${ticketData.seatRow}${ticketData.seatNumber}`;

//     return `
//       <div class="ticket">
//         <div class="ticket-header">
//           <div class="logo">cineize</div>
//           <div class="location">${ticketData.locationName}</div>
//           <div class="receipt-label">Bilhete Entrada - ${index + 1}/${total}</div>
//         </div>

//         <div class="section">
//           <div class="section-label">Filme</div>
//           <div class="movie-title">${ticketData.movieTitle}</div>
//           <div class="movie-info">
//             Classificação: M/${ticketData.movieAgeRating} | Duração: ${ticketData.movieDuration} min
//           </div>
//         </div>

//         <div class="divider-dashed"></div>

//         <div class="seat-box">
//           <div class="seat-item">
//             <div class="seat-label">Sessão / Sala</div>
//             <div class="seat-value" style="font-size: 14px;">${ticketData.roomName} (${ticketData.roomFormat})</div>
//           </div>
//           <div class="seat-item right">
//             <div class="seat-label">Lugar</div>
//             <div class="seat-value">${seatLabel}</div>
//           </div>
//         </div>

//         <table class="details-table">
//           <tr>
//             <td>Data</td>
//             <td>${formattedDate}</td>
//           </tr>
//           <tr>
//             <td>Hora</td>
//             <td>${ticketData.sessionTime}</td>
//           </tr>
//           <tr>
//             <td>Tipo Lugar</td>
//             <td>${ticketData.seatType}</td>
//           </tr>
//           <tr>
//             <td>Preço</td>
//             <td>${formatPrice(ticketData.price)}</td>
//           </tr>
//           <tr>
//             <td>Pagamento</td>
//             <td>${ticketData.paymentMethod}</td>
//           </tr>
//         </table>

//         <div class="divider"></div>

//         <div class="qr-section">
//           <div class="qr-container">
//             <div class="qr-code">
//               <img src="${qrDataUri}" alt="QR Code Bilhete" />
//             </div>
//           </div>
//           <div class="barcode-code">${ticketData.ticketCode}</div>
//         </div>

//         <div class="disclaimer">
//           Conserve este bilhete até ao final da sessão.<br/>
//           Não é permitida a troca ou devolução.
//         </div>
//       </div>
//     `;
//   }

//   /**
//    * Gera o buffer PDF contendo um ou múltiplos bilhetes
//    */
//   async generateMultipleTicketsPdf(tickets: TicketPdfData[]): Promise<Buffer> {
//     let browser: Browser | null = null;

//     try {
//       browser = await puppeteer.launch({
//         headless: true,
//         args: [
//           '--no-sandbox',
//           '--disable-setuid-sandbox',
//           '--disable-dev-shm-usage',
//         ],
//       });

//       const page = await browser.newPage();

//       // Gerar HTMLs de todos os bilhetes
//       const ticketsHtmlArray = await Promise.all(
//         tickets.map(async (ticket, index) => {
//           const qrUri = await this.generateQrDataUri(ticket.qrToken);
//           return this.generateTicketHtml(ticket, qrUri, index, tickets.length);
//         })
//       );

//       const fullContentHtml = `
//         <!DOCTYPE html>
//         <html lang="pt-PT">
//         <head>
//           <meta charset="UTF-8">
//           <style>
//             * {
//               margin: 0;
//               padding: 0;
//               box-sizing: border-box;
//             }
//             body {
//               font-family: 'Courier New', monospace;
//               background: #ffffff;
//               padding: 0;
//             }
//             .ticket {
//               width: 80mm;
//               margin: 0 auto;
//               padding: 5mm;
//               background: white;
//               page-break-after: always;
//             }
//             .ticket:last-child {
//               page-break-after: avoid;
//             }
//             .ticket-header {
//               border-bottom: 2px dashed black;
//               padding-bottom: 4mm;
//               margin-bottom: 4mm;
//               text-align: center;
//             }
//             .logo {
//               font-size: 22px;
//               font-weight: bold;
//               margin-bottom: 2mm;
//             }
//             .location {
//               font-size: 10px;
//               font-weight: bold;
//               text-transform: uppercase;
//               color: #333;
//             }
//             .receipt-label {
//               font-size: 8px;
//               color: #666;
//             }
//             .section {
//               margin-bottom: 4mm;
//             }
//             .section-label {
//               font-size: 8px;
//               font-weight: bold;
//               text-transform: uppercase;
//               color: #666;
//             }
//             .movie-title {
//               font-size: 14px;
//               font-weight: bold;
//               text-transform: uppercase;
//             }
//             .movie-info {
//               font-size: 9px;
//               color: #333;
//             }
//             .divider-dashed {
//               border-top: 1px dashed black;
//               margin: 4mm 0;
//             }
//             .divider {
//               border-top: 1px solid black;
//               margin: 4mm 0;
//             }
//             .seat-box {
//               background: #f8f8f8;
//               border: 1px solid #ccc;
//               padding: 4mm;
//               display: flex;
//               justify-content: space-between;
//             }
//             .seat-label {
//               font-size: 8px;
//               font-weight: bold;
//               color: #666;
//             }
//             .seat-value {
//               font-size: 18px;
//               font-weight: bold;
//             }
//             .details-table {
//               width: 100%;
//               font-size: 9px;
//               margin-top: 2mm;
//             }
//             .details-table td {
//               padding: 1.5mm 0;
//             }
//             .details-table td:last-child {
//               text-align: right;
//               font-weight: bold;
//             }
//             .qr-section {
//               display: flex;
//               flex-direction: column;
//               align-items: center;
//               margin: 4mm 0;
//             }
//             .qr-code img {
//               width: 40mm;
//               height: 40mm;
//             }
//             .barcode-code {
//               font-size: 9px;
//               font-weight: bold;
//               letter-spacing: 2px;
//               margin-top: 2mm;
//             }
//             .disclaimer {
//               font-size: 7px;
//               text-align: center;
//               color: #666;
//             }
//           </style>
//         </head>
//         <body>
//           ${ticketsHtmlArray.join('')}
//         </body>
//         </html>
//       `;

//       await page.setContent(fullContentHtml, { waitUntil: 'networkidle0' });

//       // Gera PDF formatado para impressora térmica de 80mm
//       const pdfBuffer = await page.pdf({
//         width: '80mm',
//         printBackground: true,
//         margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
//       });

//       return Buffer.from(pdfBuffer);
//     } finally {
//       if (browser) {
//         await browser.close();
//       }
//     }
//   }
// }

// /**
//  * Helper para obter a instância
//  */
// export async function getPdfGenerator() {
//   return new TicketPdfGenerator();
// }
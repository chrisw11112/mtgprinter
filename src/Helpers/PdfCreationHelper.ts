import { CardStore } from "@/Stores/store";
import { delay } from "./ScryfallHelper";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";

async function getAllPicturesAsBuffers(cards: CardStore[] ): Promise<ArrayBuffer[]> {
    const cardURLS: ArrayBuffer[] = [];

    for(let i = 0; i < cards.length; i++) {
        const largeImageFront = cards[i].image.replace("normal", "large");
        const frontImage = await fetch(largeImageFront);
        const frontImageArrayBugger = await frontImage.arrayBuffer();
        await delay(100);
        for (let j = 0; j < cards[i].quantity; j++) {
            cardURLS.push(frontImageArrayBugger);
        }
        if (cards[i].otherSideImage) {
            const largeImageBack = cards[i].otherSideImage?.replace("normal", "large");
            if (largeImageBack) {
                const backImage = await fetch(largeImageBack);
                const backImageArrayBugger = await backImage.arrayBuffer();
                await delay(100);
                for (let j = 0; j < cards[i].quantity; j++) {
                    cardURLS.push(backImageArrayBugger);
                }
            }
        }
    }
    return cardURLS;
}

async function createPDF(cards: CardStore[]): Promise<Blob> {
    const cardURLS = await getAllPicturesAsBuffers(cards);
    let i = 0;
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage();
    const marginOffset = 28.5;
    const widthOfCardInPdfPoints = 180;
    const heightOfCardinPdfPoints = 252;

    /*
        This is the comment to explain this thing:
        1 inch equals 72 pdf points. A magic card is 2.5 inches x 3.5 inches
        so the width is 180 pdf points x 252 pdf points. There is a left margin which is 10 mm
        10 mm in pdf points is around 28.5. The reason for the y is There is a little bit of a top margin
        and then the rest of that mess gets it to the top . The 430 is the height plus some margin
    */
    let x = marginOffset;
    let yAxisOffset = 0;
    while (i < cardURLS.length) {
        if (i % 9 === 0 && i !== 0) {
            yAxisOffset = 0;
            x = marginOffset;
            page = pdfDoc.addPage();
        }
        if (i % 3 === 0) {
            yAxisOffset -= heightOfCardinPdfPoints;
            x = marginOffset;
        }
        const embededImage = await pdfDoc.embedJpg(cardURLS[i]);
        const dims = embededImage.scale(.25);
        page.drawImage(embededImage, {
            x: x,
            y: page.getHeight() / 2 - (dims.height / 4) + 430 + yAxisOffset,
            width: widthOfCardInPdfPoints,
            height: heightOfCardinPdfPoints
        });
        x += widthOfCardInPdfPoints;
        i += 1;
    }
    const pdf = await pdfDoc.save();
    return new Blob([pdf], { type: 'application/pdf' });
}
export async function downloadPDF(cards: CardStore[]) {
    const pdf = await createPDF(cards);
    saveAs(pdf, "Cards.pdf");
}
export async function openNewWindowWithPDF(cards: CardStore[]) {
    const pdf = await createPDF(cards);
    const url = URL.createObjectURL(pdf);
    window.open(url);
}
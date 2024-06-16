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
    let x = 28.5;
    let yAxisOffset = 0;
    while (i < cardURLS.length) {
        console.log(cardURLS[i]);
        if (i % 9 === 0 && i !== 0) {
            yAxisOffset = 0;
            x = 28.5;
            page = pdfDoc.addPage();
        }
        if (i % 3 === 0) {
            yAxisOffset -= 248;
            x = 28.5;
        }
        const embededImage = await pdfDoc.embedJpg(cardURLS[i]);
        const dims = embededImage.scale(.25);
        page.drawImage(embededImage, {
            x: x,
            y: page.getHeight() / 2 - dims.height / 4 + 426 + yAxisOffset,
            width: 176,
            height: 248
        });
        x += 176;
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
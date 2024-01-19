import { InternalServerErrorException } from "@nestjs/common";
import * as path from "path";
import * as fs from 'fs';
import * as sharp from 'sharp';

export const downloadImageAsPng = async ( url: string, fullPath: boolean = false ) => {

    const response = await fetch(url);

    if(!response.ok) {
        throw new InternalServerErrorException('Download image was not possible');
    }

    const folderPath = path.resolve('./', './generated/images/');
    fs.mkdirSync(folderPath, { recursive: true });

    const imageName = `${new Date().getTime()}.png`;
    const buffer = Buffer.from( await response.arrayBuffer() );

    const completedPath = path.join(folderPath, imageName);

    // fs.writeFileSync(`${ folderPath }/${ imageName }`, buffer);

    // I USE SHARP TO MAKE SURE I CONVERT THE IMAGE INTO PNG //
    await sharp(buffer).png().ensureAlpha().toFile(completedPath);

    return fullPath ? completedPath : imageName;

}

export const downloadBase64ImageAsPng = async (base64Image: string, fullPath: boolean = false) => {

    // HEADER REMOVER //
    base64Image = base64Image.split(';base64,').pop();
    const imageBuffer = Buffer.from(base64Image, 'base64');
  
    const folderPath = path.resolve('./', './generated/images/');
    fs.mkdirSync(folderPath, { recursive: true });
  
    const imageName = `${ new Date().getTime() }-64.png`;
    
    const completedPath = path.join(folderPath, imageName)
  
    // TRANSFORM TO RGBA, PNG // THIS IS WHAT OPENAI EXPECTS
    await sharp(imageBuffer).png().ensureAlpha().toFile(completedPath);
  
    return fullPath ? completedPath : imageName;
  
}
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';
import { FileRepository } from './file.repository';
import { v4 as uuidv4 } from 'uuid';
import { S3 } from 'aws-sdk'
@Injectable()
export class FileService {
  BUCKET_NAME = process.env.BUCKET_NAME
  AWSAccessKeyId = process.env.AWSAccessKeyId
  AWSSecretKey = process.env.AWSSecretKey
  AWSRegion = process.env.AWSRegion


//amazon client
  s3 = new S3({
    secretAccessKey: this.AWSSecretKey,
    accessKeyId: this.AWSAccessKeyId,
    region: this.AWSRegion
  });

  constructor(
    @InjectRepository(FileRepository)
    private fileRepository: FileRepository) {
  }

  async create(file: Express.Multer.File) {
    const fileObj: FileEntity = this.fileRepository.create();
    fileObj.fileName = file.originalname;
    fileObj.passkey = makeid(6);
    fileObj.path = uuidv4() + "-" + file.originalname + " "
    fileObj.type = file.mimetype.split('/').pop();

    const params = {
      Bucket: this.BUCKET_NAME,
      Key: fileObj.path, // File name you want to save as in S3
      Body: file.buffer,
      ContentType: file.mimetype
    };
    await this.pushFileToAws(params);
    return this.fileRepository.save(fileObj);

  }

  async findAll() {
    return await this.fileRepository.find()
  }

  async findOne(passKey: string) {
    const obj: FileEntity = await this.fileRepository.findOne({
      where: {
        passkey: passKey
      }
    })
    if (obj) {
      const url = await this.s3.getSignedUrlPromise("getObject", {
        Bucket: this.BUCKET_NAME,
        Key: obj.path,
        Expires: 60

      })

      return url;
    } else
      return 'invalid pass key expired'


  }

  // update(id: number, updateFileDto: UpdateFileDto) {
  //   return `This action updates a #${id} file`;
  // }

  async remove(passKey: string) {

    const obj: FileEntity = await this.fileRepository.findOne({
      where: {
        passkey: passKey
      }
    })
    if (obj) {
      const url = await this.s3.deleteObject({
        Bucket: this.BUCKET_NAME,
        Key: obj.path,
      }).promise()

      await this.fileRepository.remove(obj);

      return "file Removed"
    } else
      return 'invalid pass key expired'
  }

  async pushFileToAws(params: any) {

    await this.s3.putObject({
      Bucket: params.Bucket,
      Key: params.Key,
      ContentType: params.ContentType,
      Body: params.Body
    }, (err) => {
      if (err)
        throw err
    }).promise()


    // this.s3.upload(params, (err, data) => {
    //   if (err)
    //     console.log(err);
    //   err;
    //   console.log(data);
    //   data;
    // })
    return `s3://${this.BUCKET_NAME}/${params.Key}`
  }
}

function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}

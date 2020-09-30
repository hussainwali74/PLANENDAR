import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  baseUrl: string = environment.url

  constructor(private http: HttpClient) { }

  async uploadFile(file) {
    const contentType = file.type;
    const bucket = new S3(
      {
        accessKeyId: 'AKIASJPFOIKSRO746TXE',
        secretAccessKey: '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',
        region: 'eu-west-2'
      }
    );
    const params = {
      Bucket: 'planendar-images-2',
      // Key: this.FOLDER + file.name,
      Key: file.name,
      Body: file,
      ACL: 'public-read',
      ContentType: contentType
    };
    let x = await bucket.upload(params, function (err, data) {
      if (err) {
        console.log('There was an error uploading your file: ', err);
        return false;
      }
      console.log('Successfully uploaded file.', data);
      return data['Location'];
    });
    return x;
    //for upload progress   
    /*bucket.upload(params).on('httpUploadProgress', function (evt) {
              console.log(evt.loaded + ' of ' + evt.total + ' Bytes');
          }).send(function (err, data) {
              if (err) {
                  console.log('There was an error uploading your file: ', err);
                  return false;
              }
              console.log('Successfully uploaded file.', data);
              return true;
          });*/
  }
  updateProfilePhoto(photo) {
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    let url = this.baseUrl + 'save-profile-pic';
    return this.http.put(url, { photo: photo }, { headers });
  }

}

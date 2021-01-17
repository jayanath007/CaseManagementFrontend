import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ImageCropperComponent, ImageCroppedEvent } from 'ngx-image-cropper';
import { User } from '../../../auth';

@Component({
  selector: 'dps-user-image-cropper-popup',
  templateUrl: './user-image-cropper-popup.component.html',
  styleUrls: ['./user-image-cropper-popup.component.scss']
})
export class UserImageCropperPopupComponent implements OnInit {

  @ViewChild(ImageCropperComponent) imageCropper: ImageCropperComponent;

  imageFile: File;
  croppedImage: any = '';
  croppedFile: Blob;
  showCropper = false;
  showCroppedImage = false;
  imageNotFound;

  constructor(@Inject(MAT_DIALOG_DATA) public data: User, public dialogRef: MatDialogRef<UserImageCropperPopupComponent>) { }

  ngOnInit() {
  }
  onFileChange(files: File[]) {
    this.imageFile = files[0];
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.croppedFile = event.file;
  }
  imageLoaded() {
    this.showCropper = true;
    this.imageNotFound = false;
  }
  cropperReady() {
  }
  loadImageFailed() {
  }
  rotateLeft() {
    this.imageCropper.rotateLeft();
  }
  rotateRight() {
    this.imageCropper.rotateRight();
  }
  flipHorizontal() {
    this.imageCropper.flipHorizontal();
  }
  flipVertical() {
    this.imageCropper.flipVertical();
  }
  onCroppedImageLoad() {
    this.showCroppedImage = true;
  }
  onImageLoad(event: Event) {
    this.imageNotFound = false;
    const img = <HTMLImageElement>event.currentTarget;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    canvas.toBlob((blob) => {
      this.imageFile = <File>blob;
      canvas.remove();
    });
  }
  onImageError() {
    this.imageNotFound = true;
  }
  onClose() {
    this.dialogRef.close();
  }
  onSave() {
    if (this.croppedFile) {
      this.dialogRef.close(this.croppedFile);
    } else {
      this.dialogRef.close();
    }
  }
  onDelete() {
    this.dialogRef.close();
  }
}

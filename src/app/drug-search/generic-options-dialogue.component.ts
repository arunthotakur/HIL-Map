import { Inject } from '@angular/core';
import { Component } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'generic-options-dialog',
  templateUrl: 'generic-options-dialog.html',
})
export class GenericOptionsDialog {

  constructor(
    public dialogRef: MatDialogRef<GenericOptionsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  freshness = ["Brand New", "Second Hand", "Refreshness"];
  productForm!: FormGroup;
  actionBtn: string = "Save";

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any
    ) {

   }

  ngOnInit(): void {

    this.productForm = this.formBuilder.group({
      productName : ['', Validators.required],
      category : ['', Validators.required],
      freshness : ['', Validators.required],
      price : ['', Validators.required],
      productDescription : ['', Validators.required],
      date : ['', Validators.required]
    })

    if(this.editData){
      this.actionBtn = "Update";
      this.productForm.controls['productName'].setValue(this.editData.productName);
      this.productForm.controls['category'].setValue(this.editData.category);
      this.productForm.controls['date'].setValue(this.editData.date);
      this.productForm.controls['freshness'].setValue(this.editData.freshness);
      this.productForm.controls['price'].setValue(this.editData.price);
      this.productForm.controls['productDescription'].setValue(this.editData.productDescription);
    }
  }
  addProduct(){
    if(!this.editData){
      if(this.productForm.valid){
        this.api.postProduct(this.productForm.value)
        .subscribe({
          next:(res) => {
            alert("Product added successfully!");
            this.productForm.reset();
            this.dialogRef.close('save');
          },
          error:() => {
            alert("Error while adding the product!");
          }
        })
      }
    }else{
      this.updateProduct();
    }
  }

  updateProduct(){
    this.api.putProduct(this.productForm.value, this.editData.id)
    .subscribe({
      next:(res)=>{
        alert("Product updated successfully!");
        this.productForm.reset();
        this.dialogRef.close('update');
      },
      error:()=>{
        alert("Error while updating the product!");
      }
      
    })
  }


}

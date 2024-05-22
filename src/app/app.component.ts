import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { Product } from '../domain/Product';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    TableModule,
    HttpClientModule,
    InputTextModule,
    DialogModule,
    ToolbarModule,
    ConfirmDialogModule,
    RatingModule,
    InputNumberModule,
    InputTextareaModule,
    RadioButtonModule,
    DropdownModule,
    ButtonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {

  productDialog: boolean | undefined;

  products!: Product[];

  product!: Product;

  selectedProducts!: Product[] | null;

  submitted!: boolean;

  statuses!: any[];

  constructor(private productService: ProductService, private messageService: MessageService, private confirmationService: ConfirmationService) { }

  ngOnInit() {
      this.productService.getProducts().then(data => this.products = data);

      this.statuses = [
          {label: 'INSTOCK', value: 'instock'},
          {label: 'LOWSTOCK', value: 'lowstock'},
          {label: 'OUTOFSTOCK', value: 'outofstock'}
      ];
  }

  openNew() {
      this.product = {};
      this.submitted = false;
      this.productDialog = true;
  }

  deleteSelectedProducts() {
      this.confirmationService.confirm({
          message: 'Are you sure you want to delete the selected products?',
          header: 'Confirm',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
              this.products = this.products.filter(val => !this.selectedProducts?.includes(val));
              this.selectedProducts = null;
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'Products Deleted', life: 3000});
          }
      });
  }

  editProduct(product: Product) {
      this.product = {...product};
      this.productDialog = true;
  }

  deleteProduct(product: Product) {
      this.confirmationService.confirm({
          message: 'Are you sure you want to delete ' + product.name + '?',
          header: 'Confirm',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
              this.products = this.products.filter(val => val.id !== product.id);
              this.product = {};
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'Product Deleted', life: 3000});
          }
      });
  }

  hideDialog() {
      this.productDialog = false;
      this.submitted = false;
  }
  
  saveProduct() {
      this.submitted = true;

      if (this.product.name?.trim()) {
          if (this.product.id) {
              this.products[this.findIndexById(this.product.id)] = this.product;                
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'Product Updated', life: 3000});
          }
          else {
              this.product.id = this.createId();
              this.product.image = 'product-placeholder.svg';
              this.products.push(this.product);
              this.messageService.add({severity:'success', summary: 'Successful', detail: 'Product Created', life: 3000});
          }

          this.products = [...this.products];
          this.productDialog = false;
          this.product = {};
      }
  }

  findIndexById(id: string): number {
      let index = -1;
      for (let i = 0; i < this.products.length; i++) {
          if (this.products[i].id === id) {
              index = i;
              break;
          }
      }

      return index;
  }

  createId(): string {
      let id = '';
      var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      for ( var i = 0; i < 5; i++ ) {
          id += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return id;
  }
}
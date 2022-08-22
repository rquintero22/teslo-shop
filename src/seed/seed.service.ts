import { Injectable } from '@nestjs/common';
import { ProductsService } from './../products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {

  constructor(private readonly productsSrv: ProductsService) {}

  async runSeed() {
    await this.insertNewProducts();

    return 'Execute seed';
  }

  private async insertNewProducts() {
    await this.productsSrv.deleteAllProducts();

    const products = initialData.products;

    const insertPromises = [];

    products.forEach(product => {
      insertPromises.push(this.productsSrv.create(product));
    });

    const results = await Promise.all(insertPromises);

    return true;
  }
  
}

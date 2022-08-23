import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { ProductsService } from './../products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {

  constructor(private readonly productsSrv: ProductsService,
              @InjectRepository(User)
              private readonly userRepository: Repository<User>) {}

  async runSeed() {

    await this.deleteTables();
    const adminUser = await this.insertUsers(); 

    await this.insertNewProducts(adminUser);

    return 'Execute seed';
  }

  private async deleteTables() {
    await this.productsSrv.deleteAllProducts();

    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder
      .delete()
      .where({})
      .execute();
  }

  private async insertUsers() {
    const seedUsers = initialData.users;
    const users: User[] = [];
    seedUsers.forEach(user => {
      users.push(this.userRepository.create(user));
    });

    const dbUsers = await this.userRepository.save(seedUsers);

    return dbUsers[0];
  }

  private async insertNewProducts(user: User) {
    await this.productsSrv.deleteAllProducts();

    const products = initialData.products;

    const insertPromises = [];

    products.forEach(product => {
      insertPromises.push(this.productsSrv.create(product, user));
    });

    const results = await Promise.all(insertPromises);

    return true;
  }
  
}
